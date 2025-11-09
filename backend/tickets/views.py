from rest_framework import permissions, viewsets, generics
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import TicketSerializer, AgentSerializer, DashboardSerializer
from .models import Ticket, Agent
from django.db.models import Count, Q
# for priority queue

from django.db.models import Case, When, Value, IntegerField
# Create your views here.

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.DjangoModelPermissions, permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Ticket.objects.all().order_by(
        Case(
            When(severity = "urgent", then=Value(0)),
            default=Value(1),
            output_field=IntegerField(),
        ),
        '-created_at')
        
        agent_id = self.request.query_params.get('agent_id', None) #type: ignore
        title = self.request.query_params.get('title', None) #type: ignore
        severity = self.request.query_params.get('severity', None) #type: ignore
        
        if title:
            queryset = queryset.filter(title__icontains=title);
            
        if severity:
            queryset = queryset.filter(severity=severity);
        
        if user.groups.filter(name="Requesters").exists():
            return queryset.filter(requester=user)
            
        elif user.groups.filter(name="Managers").exists():
            if agent_id:
                return queryset.filter(assigned_agent=agent_id)
            
            return queryset
        
        
            
        return Ticket.objects.none()
    
    def partial_update(self, request, *args, **kwargs):
        user = self.request.user
        ticket = self.get_object()

        if user.groups.filter(name="Requesters").exists() and ticket.status != "pending":
            raise ValidationError({"detail": "The ticket has already been assessed."})
        
        serialized_data = self.get_serializer(instance=ticket, data=request.data["params"], partial=True)
        serialized_data.is_valid(raise_exception=True)
        serialized_data.save()

        return Response(serialized_data.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        ticket = self.get_object()
        
        if user.groups.filter(name="Managers").exists():
            raise ValidationError({"detail": "A manager can't delete a submitted ticket!"})
        
        if ticket.status != "pending":
            raise ValidationError({"detail": "You can only delete pending tickets!"})
        
        ticket.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
            
    
class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all().order_by('last_name')
    serializer_class = AgentSerializer
    permission_classes = [permissions.DjangoModelPermissions, permissions.IsAuthenticated]
    

class DashboardAPIView(APIView):
    def get(self, request, *args, **kwargs):
        user = self.request.user
        tickets = Ticket.objects.all()
        
        if user.groups.filter(name="Requesters").exists():
            tickets = tickets.filter(requester=user)
            
        dashboard_counts = tickets.aggregate(
            total_tickets_sent=Count('id'),
            urgent_tickets_sent=Count("id", filter=Q(severity="urgent")),
            resolved_tickets_sent=Count("id", filter=Q(status="resolved"))
        )
        
        latest_ticket = tickets.order_by('-created_at').first()
        
        serializer = DashboardSerializer({'dashboard_counts': dashboard_counts, 'latest_ticket': latest_ticket}, context={'request': request});
        
        return Response(serializer.data, status=status.HTTP_200_OK)
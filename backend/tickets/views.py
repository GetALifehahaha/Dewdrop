from rest_framework import permissions, viewsets, generics
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from .serializers import TicketSerializer, AgentSerializer
from .models import Ticket, Agent
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
            When(severity = "ur", then=Value(0)),
            default=Value(1),
            output_field=IntegerField(),
        ),
        '-created_at')
        
        if user.groups.filter(name="Requesters").exists():
            return queryset.filter(requester=user)
            
        elif user.groups.filter(name="Managers").exists():
            return queryset
            
        return Ticket.objects.none()
    
    def partial_update(self, request, *args, **kwargs):
        user = self.request.user
        ticket = self.get_object()

        if user.groups.filter(name="Requesters").exists() and ticket.status != "pending":
            raise ValidationError({"detail": "The ticket has already been assessed."})
        
        serialized_data = self.get_serializer(instance=ticket, data=request.data, partial=True)
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
    queryset = Agent.objects.all().order_by('first_name')
    serializer_class = AgentSerializer
    permission_classes = [permissions.DjangoModelPermissions, permissions.IsAuthenticated]
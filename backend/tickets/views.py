from rest_framework import permissions, viewsets
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
    
    def create(self, request, *args, **kwargs):
        print("RAW DATA:", request.data)
        serializer = self.get_serializer(data=request.data)
        print("BEFORE VALID:", serializer.initial_data)
        serializer.is_valid(raise_exception=True)
        print("AFTER VALID:", serializer.validated_data)
        return super().create(request, *args, **kwargs)
    
    
class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all().order_by('first_name')
    serializer_class = AgentSerializer
    permission_classes = [permissions.DjangoModelPermissions, permissions.IsAuthenticated]
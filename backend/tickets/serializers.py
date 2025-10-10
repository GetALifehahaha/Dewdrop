from .models import Ticket, Agent
from rest_framework import serializers

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['title', 'description', 'created_at', 'severity', 'assigned_agent', 'status', 'resolved_at']
        read_only_fields = ['created_at', 'resolved_at']
        
        
class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['first_name', 'last_name', 'email']
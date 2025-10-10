from .models import Ticket, Personnel
from rest_framework import serializers

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['title', 'description', 'created_at', 'severity', 'assigned_personnel', 'status', 'resolved_at']
        read_only_fields = ['created_at', 'resolved_at']
        
        
class PersonnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personnel
        fields = ['first_name', 'last_name', 'email']
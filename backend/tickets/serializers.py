from django.forms import ValidationError
from .models import Ticket, Agent
from rest_framework import serializers

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'first_name', 'last_name', 'email']
        read_only_fields = ['id']
        
        
class TicketSerializer(serializers.ModelSerializer):
    assigned_agent = AgentSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'requester', 'created_at', 'severity', 'assigned_agent', 'status', 'resolved_at']
        read_only_fields = ['id', 'created_at', 'resolved_at']
    
    def get_fields(self):
        fields = super().get_fields()
        user = self.context['request'].user
        
        allowed_fields = []
        
        if user.groups.filter(name="Requesters").exists():
            allowed_fields = ['title', 'description', 'severity']
                    
        elif user.groups.filter(name="Managers").exists():
            if self.context['request'].method == 'POST':
                raise ValidationError("Managers cannot create tickets!")
                
            allowed_fields = ['assigned_agent', 'status']
            
        for field_name in list(fields.keys()):
            if field_name not in allowed_fields and field_name not in self.Meta.read_only_fields:
                fields[field_name].read_only = True
                
        return fields
        
    def create(self, validated_data):
        validated_data['requester'] = self.context['request'].user
        return super().create(validated_data)
    
    
class DashboardSerializer(serializers.Serializer):
    dashboard_counts = serializers.DictField()
    latest_ticket = TicketSerializer()
    
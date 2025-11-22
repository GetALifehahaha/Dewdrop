from re import search
from django.forms import ValidationError

from authentication.serializers import UserSerializer
from .models import Ticket, Agent, Department, TicketType
from rest_framework import serializers


class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        

class TicketMonthlySerializer(serializers.Serializer):
    month = serializers.SerializerMethodField()
    count = serializers.IntegerField()
    
    def get_month(self, obj):
        return obj['month'].strftime("%Y-%m-%d")

class AgentSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(source='department', read_only=True)
    
    class Meta:
        model = Agent
        fields = ['id', 'first_name', 'last_name', 'email', 'department', 'department_details']
        read_only_fields = ['id']
        
        
class TicketSerializer(serializers.ModelSerializer):
    assigned_agent_details = AgentSerializer(source='assigned_agent', read_only=True)
    requester_details = UserSerializer(source='requester', read_only=True)
    ticket_type_details = TicketTypeSerializer(source='ticket_type', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'requester', 'created_at', 'severity', 'severity_display', 'assigned_agent', 'assigned_agent_details', 'ticket_type', 'ticket_type_details', 'requester_details', 'status_display', 'status', 'resolved_at']
        read_only_fields = ['id', 'resolved_at', 'severity_display', 'status_display', 'assigned_agent_details', 'requester_details']
    
    def get_fields(self):
        fields = super().get_fields()
        user = self.context['request'].user
        
        allowed_fields = []
        
        if user.groups.filter(name="Requesters").exists():
            allowed_fields = ['title', 'description', 'severity', 'ticket_type']
                    
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


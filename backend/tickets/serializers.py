from django.db import transaction, models
from django.forms import ValidationError
from django.utils import timezone

from authentication.serializers import UserSerializer
from .models import Ticket, Agent, Department, TicketType, Specialization
from rest_framework import serializers
from django.db.models import Count


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
    specializations = serializers.SerializerMethodField()
      
    class Meta:
        model = Agent
        fields = ['id', 'first_name', 'last_name', 'email', 'department', 'department_details', 'specializations']
        read_only_fields = ['id']
        
    def get_specializations(self, obj):
        ticket_types = [spec.ticket_type for spec in obj.specializations.all()]
        
        return TicketTypeSerializer(ticket_types, many=True).data
        
        
class SpecializationSerializer(serializers.ModelSerializer):
    agent_id = serializers.IntegerField(required=False)
    ticket_type_id = serializers.IntegerField()
    extra_kwargs = {
        'id': {'read_only': True},
        'agent_id': {'read_only': True}
    }
    
    class Meta:
        model = Specialization
        fields = ['id', 'agent_id', 'ticket_type_id']
        
        
class AgentCreateSerializer(serializers.ModelSerializer):
    specializations = SpecializationSerializer(many=True)
    
    class Meta:
        model = Agent
        fields = ['id', 'first_name', 'last_name', 'email', 'department', 'specializations']
    
    def validate_specializations(self, value):
        """Validate that there are no duplicate ticket types."""
        # 'value' is a list of OrderedDict objects after nested serializer validation
        print("validate_specializations value:", value)
        
        ticket_type_ids = [spec.get('ticket_type_id') for spec in value if 'ticket_type_id' in spec]
        
        if len(ticket_type_ids) != len(set(ticket_type_ids)):
            raise serializers.ValidationError("Duplicate ticket types are not allowed.")
        
        return value
    
    def create(self, validated_data):
        specializations_data = validated_data.pop('specializations', [])

        with transaction.atomic():
            agent = Agent.objects.create(**validated_data)
            Specialization.objects.bulk_create([
                Specialization(agent=agent, ticket_type_id=spec['ticket_type_id']) 
                for spec in specializations_data
            ])
            
        return agent
    
    def update(self, instance, validated_data):
        specializations_data = validated_data.pop('specializations', [])

        # Update agent fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Get new ticket type IDs
        new_ticket_type_ids = {spec['ticket_type_id'] for spec in specializations_data}
        
        # Get existing ticket type IDs
        existing_specializations = instance.specializations.all()
        existing_ticket_type_ids = set(existing_specializations.values_list('ticket_type_id', flat=True))

        with transaction.atomic():
            # Delete removed specializations
            to_delete = existing_ticket_type_ids - new_ticket_type_ids
            if to_delete:
                existing_specializations.filter(ticket_type_id__in=to_delete).delete()

            # Add new specializations
            to_add = new_ticket_type_ids - existing_ticket_type_ids
            if to_add:
                Specialization.objects.bulk_create([
                    Specialization(agent=instance, ticket_type_id=tid) 
                    for tid in to_add
                ])

        return instance
                
        
        
class TicketSerializer(serializers.ModelSerializer):
    assigned_agent_details = AgentSerializer(source='assigned_agent', read_only=True)
    requester_details = UserSerializer(source='requester', read_only=True)
    ticket_type_details = TicketTypeSerializer(source='ticket_type', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'requester', 'created_at', 'severity', 'severity_display', 'assigned_agent', 'assigned_agent_details', 'ticket_type', 'ticket_type_details', 'requester_details', 'status_display', 'status', 'resolved_at', 'image']
        read_only_fields = ['id', 'resolved_at', 'severity_display', 'status_display', 'assigned_agent_details', 'requester_details']
    
    def get_fields(self):
        fields = super().get_fields()
        user = self.context['request'].user
        
        allowed_fields = []
        
        if user.groups.filter(name="Requesters").exists():
            allowed_fields = ['title', 'description', 'severity', 'ticket_type', 'image']
                    
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
    
    
class MostSentTicketTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    count = serializers.IntegerField()
    
    
class DashboardSerializer(serializers.Serializer):
    dashboard_counts = serializers.DictField()
    latest_ticket = TicketSerializer()
    most_sent_ticket_type = serializers.SerializerMethodField()
    
    def get_most_sent_ticket_type(self, obj):
        now = timezone.now()
        month = now.month
        year = now.year
        
        queryset = (Ticket.objects.filter(
            created_at__year=year, created_at__month=month
            )
            .values('ticket_type__name')
            .annotate(total=Count('id'))
            .order_by('-total')
        )
        
        if not queryset:
            return None
        
        top = queryset[0]
        
        return {
            'ticket_type': top['ticket_type__name'],
            'count': top['total']
        }

from django.contrib import admin
from .models import Department, Agent, Specialization, TicketType, Ticket

# ----------------------------
# Department
# ----------------------------
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# ----------------------------
# Agent
# ----------------------------
@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'department', 'get_agent_specializations',)
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('department',)
    
    def get_agent_specializations(self, obj):
        return ", ".join([spec.ticket_type.name for spec in obj.specializations.all()])
    get_agent_specializations.short_description = 'Agent Specializations'


# ----------------------------
# TicketType
# ----------------------------
@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


# ----------------------------
# Ticket
# ----------------------------
@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'requester', 'assigned_agent', 'severity', 'status', 'created_at', 'resolved_at', 'ticket_type')
    list_filter = ('severity', 'status', 'created_at', 'ticket_type')
    search_fields = ('title', 'description', 'requester__username', 'assigned_agent__first_name', 'assigned_agent__last_name')
    date_hierarchy = 'created_at'
    autocomplete_fields = ('requester', 'assigned_agent', 'ticket_type')
    
    

@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('id', 'agent', 'ticket_type')
    list_filter = ('agent', 'ticket_type')
    search_fields = ('agent__first_name', 'agent__last_name', 'ticket_type__name')
    autocomplete_fields = ('agent', 'ticket_type')
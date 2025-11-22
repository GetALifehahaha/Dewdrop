from django.contrib import admin
from .models import Department, Agent, TicketType, Ticket

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
    list_display = ('id', 'first_name', 'last_name', 'email', 'department')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('department',)


# ----------------------------
# TicketType
# ----------------------------
@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'department')
    search_fields = ('name',)
    list_filter = ('department',)


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

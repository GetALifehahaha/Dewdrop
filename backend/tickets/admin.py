from django.contrib import admin
from .models import Agent, Ticket, Department, TicketType

# Register your models here.
admin.site.register(Agent)
admin.site.register(Ticket)
admin.site.register(Department)
admin.site.register(TicketType)

from django.shortcuts import render
from rest_framework import permissions, viewsets
from .serializers import TicketSerializer, PersonnelSerializer
from .models import Ticket, Personnel
# for priority queue
from django.db.models import Case, When, Value, IntegerField
# Create your views here.

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by(
        Case(
            When(severity = "ur", then=Value(0)),
            default=Value(0),
            output_field=IntegerField(),
        ),
        '-created_at')
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
class PersonnelViewSet(viewsets.ModelViewSet):
    queryset = Personnel.objects.all().order_by('first_name')
    serializer_class = PersonnelSerializer
    permission_classes = [permissions.IsAuthenticated]
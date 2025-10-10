from django.urls import path
from .views import TicketViewSet, AgentViewSet

urlpatterns = [
    path('tickets/', TicketViewSet.as_view(), name="tickets"),
    path('agents/', AgentViewSet.as_view(), name="agents"),
]
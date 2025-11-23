from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, AgentViewSet, DashboardAPIView, TicketTypeViewSet, DepartmentViewSet, TicketStatsViewSet, resolve_ticket

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'agents', AgentViewSet)
router.register(r'ticket_types', TicketTypeViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'stats', TicketStatsViewSet, basename="stats")


urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
    path('tickets/<int:ticket_id>/resolve', resolve_ticket, name='resolve_ticket'),
]

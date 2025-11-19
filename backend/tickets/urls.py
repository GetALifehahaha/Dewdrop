from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, AgentViewSet, DashboardAPIView, TicketTypeViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'agents', AgentViewSet)
router.register(r'ticket_types', TicketTypeViewSet)
router.register(r'departments', DepartmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
]

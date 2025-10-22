from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, AgentViewSet, DashboardAPIView

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'agents', AgentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
]

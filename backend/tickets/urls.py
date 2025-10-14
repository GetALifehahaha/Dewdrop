from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, AgentViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'agents', AgentViewSet)

urlpatterns = router.urls

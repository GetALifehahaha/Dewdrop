from calendar import month
from decouple import config

from django.forms import DateField
from django.utils import timezone
from django.db.models.functions import TruncMonth
from datetime import timedelta

from rest_framework import permissions, viewsets, generics
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes, api_view

from .serializers import AgentCreateSerializer, DepartmentSerializer, TicketSerializer, AgentSerializer, DashboardSerializer, TicketTypeSerializer, TicketMonthlySerializer
from .models import Ticket, Agent, TicketType, Department
from django.db.models import Count, Q

# for email
import resend
from django.conf import settings
import secrets
import hashlib

# for priority queue
from django.db.models import Case, When, Value, IntegerField

from django.http import JsonResponse, HttpResponse

# Create your views here.

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Ticket.objects.all().order_by(
        Case(
            When(severity = "urgent", then=Value(0)),
            default=Value(1),
            output_field=IntegerField(),
        ),
        '-created_at')
        
        agent_id = self.request.query_params.get('agent_id', None) #type: ignore
        title = self.request.query_params.get('title', None) #type: ignore
        severity = self.request.query_params.get('severity', None) #type: ignore
        status = self.request.query_params.get('status', None) #type: ignore
        ticket_type = self.request.query_params.get('ticket_type', None)#type: ignore
        start_date = self.request.query_params.get('start_date', None)#type: ignore
        end_date = self.request.query_params.get('end_date', None)#type: ignore
        
        if title:
            queryset = queryset.filter(title__icontains=title)
            
        if severity:
            queryset = queryset.filter(severity=severity)
            
        if status:
            queryset = queryset.filter(status=status)
            
        if ticket_type:
            queryset = queryset.filter(ticket_type=ticket_type)
            
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
            
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        if user.groups.filter(name="Requesters").exists():
            return queryset.filter(requester=user)
            
        elif user.groups.filter(name="Managers").exists():
            if agent_id:
                return queryset.filter(assigned_agent=agent_id)
            
            return queryset
            
        return Ticket.objects.none()
    
    def partial_update(self, request, *args, **kwargs):
        user = self.request.user
        ticket = self.get_object()

        if user.groups.filter(name="Requesters").exists() and ticket.status != "pending":
            raise ValidationError({"detail": "The ticket has already been assessed."})
        
        old_status = ticket.status
        
        serialized_data = self.get_serializer(instance=ticket, data=request.data, partial=True)
        serialized_data.is_valid(raise_exception=True)
        updated_ticket = serialized_data.save()
        
        new_status = updated_ticket.status
        
        # Prepare response data
        response_data = serialized_data.data
        response_data['email_context'] = {} # We will send extra data for the frontend to use

        if old_status == "assessing" and new_status == "assigned":
            agent = updated_ticket.assigned_agent
            if agent:
                # Generate the secure link here
                token = generate_resolve_token(updated_ticket.id, agent.id, secret_key)
                resolve_url = f"https://dewdrop-gamma.vercel.app/resolve/{updated_ticket.id}?token={token}&agent_id={agent.id}"
                
                # Pass this URL to the frontend so it can put it in the email
                response_data['email_context']['resolve_url'] = resolve_url
                response_data['email_context']['agent_email'] = agent.email
                response_data['email_context']['agent_name'] = f"{agent.first_name} {agent.last_name}"
                
        if new_status == "resolved":
            updated_ticket.resolved_at = timezone.now()
            updated_ticket.save()

        return Response(response_data, status=status.HTTP_200_OK)
        
    
    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        ticket = self.get_object()
        
        if user.groups.filter(name="Managers").exists():
            raise ValidationError({"detail": "A manager can't delete a submitted ticket!"})
        
        if ticket.status != "pending":
            raise ValidationError({"detail": "You can only delete pending tickets!"})
        
        ticket.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
            
resend.api_key = settings.RESEND_API_KEY
secret_key = settings.SECRET_KEY

def generate_resolve_token(ticket_id, agent_id, secret_key):
    data = f"{ticket_id}:{agent_id}:{secret_key}"
    return hashlib.sha256(data.encode()).hexdigest()[:32]    

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def resolve_ticket(request, ticket_id):
    token = request.GET.get('token')
    agent_id = request.GET.get('agent_id')
    
    expected_token = generate_resolve_token(ticket_id, int(agent_id), secret_key)
    
    if token != expected_token:
        return HttpResponse("<h1>❌ Invalid or expired link</h1>", status=403)
    
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        ticket.status = "resolved"
        ticket.save()
        
        return Response({
            "message": "Success",
            "ticket_title": ticket.title,
            "requester_email": ticket.requester.email,
            "requester_name": ticket.requester.first_name
        }, status=200)
    except Ticket.DoesNotExist:
        return HttpResponse("<h1>❌ Ticket not found</h1>", status=404)

def send_email(to_emails, subject, html_content):
    
    if isinstance(to_emails, str):
        to_emails = [to_emails]
        
    params: resend.Emails.SendParams = {
        "from": "Dewdrop <onboarding@resend.dev>",
        "to": to_emails,
        "subject": subject,
        "html": html_content
    }
        
    try:
        resend.Emails.send(params)
    except Exception as e:
        print(f"Failed to send email: {e}")

    
class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all().order_by('last_name')
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AgentCreateSerializer
        return AgentSerializer
    

class DashboardAPIView(APIView):
    def get(self, request, *args, **kwargs):
        user = self.request.user
        tickets = Ticket.objects.all()
        
        if user.groups.filter(name="Requesters").exists():
            tickets = tickets.filter(requester=user)
            
        dashboard_counts = tickets.aggregate(
            total_tickets_sent=Count('id'),
            urgent_tickets_sent=Count("id", filter=Q(severity="urgent")),
            resolved_tickets_sent=Count("id", filter=Q(status="resolved"))
        )
        
        latest_ticket = tickets.order_by('-created_at').first()
        
        serializer = DashboardSerializer({'dashboard_counts': dashboard_counts, 'latest_ticket': latest_ticket}, context={'request': request});
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class TicketTypeViewSet(viewsets.ModelViewSet):
    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    
    
class TicketStatsViewSet(viewsets.ViewSet):
    def list(self, request):
        today = timezone.now().date()
        
        six_months_ago = today.replace(day=1) - timedelta(days=180)
        queryset = (
            Ticket.objects.filter(created_at__date__gte=six_months_ago)
            .annotate(month=TruncMonth("created_at")) #type: ignore
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
        
        serializer = TicketMonthlySerializer(queryset, many=True)
        return Response(serializer.data)
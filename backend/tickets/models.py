from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    

class Agent(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, related_name="agent", null=True, blank=True)
    
    def __str__(self):
        return self.first_name + ' ' + self.last_name
    

class TicketType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
    
class Specialization(models.Model):
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name="specializations")
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE, related_name="specializations")
    
    def __str__(self):
        return f"{self.agent.first_name} {self.agent.last_name} - {self.ticket_type.name}"
    
    
class Ticket(models.Model):
    SEVERITY = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('urgent', 'Urgent'),
    ]
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    requester = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="tickets", null=True, blank=True)
    severity = models.CharField(choices=SEVERITY, max_length=6) 
    
    assigned_agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, related_name="tickets", null=True, blank=True)
    image = models.URLField(max_length=500, blank=True, null=True)
    
    STATUS = [
        ('pending', 'Pending'),
        ('assessing', 'Assessing'),
        ('assigned', 'Assigned'),
        ('resolved', 'Resolved'),
    ]
    
    status = models.CharField(choices=STATUS, max_length=10, default='pending')
    resolved_at = models.DateTimeField(null=True, blank=True)
    ticket_type = models.ForeignKey(TicketType, on_delete=models.SET_NULL, related_name="tickets", null=True, blank=True)
    
    def __str__(self):
        return self.title

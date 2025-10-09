from random import choice
from django.db import models

# Create your models here.
class Personnel(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    
    def __str__(self):
        return self.first_name + ' ' + self.last_name
    
    
class Ticket(models.Model):
    SEVERITY = [
        ('lw', 'Low'),
        ('md', 'Medium'),
        ('ur', 'Urgent'),
    ]
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    severity = models.CharField(choices=SEVERITY, max_length=2)
    # reporter = 
    
    assigned_personnel = models.ForeignKey(Personnel, on_delete=models.SET_NULL, related_name="tickets", null=True, blank=True)
    
    STATUS = [
        ('op', 'Open'),
        ('ip', 'In Progress'),
        ('rs', 'Resolved'),
    ]
    
    status = models.CharField(choices=STATUS, max_length=2)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title

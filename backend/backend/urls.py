"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from os import name
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from authentication.views import UserViewSets 
from tickets.views import TicketViewSet, AgentViewSet


auth_routers = routers.DefaultRouter()
auth_routers.register(r'users', UserViewSets)

ticket_routers = routers.DefaultRouter()
ticket_routers.register(r'ticket', TicketViewSet)
ticket_routers.register(r'agent', AgentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include(auth_routers.urls)),
    path('api-auth/', include('rest_framework.urls', namespace="rest_framework")),
    path('tickets/', include(ticket_routers.urls))
]

from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User, Group
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, DjangoModelPermissions, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from .serializers import UserSerializer, UserProfileSerializer


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserViewSets(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [DjangoModelPermissions]
    
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token Missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=10
            )
            
            if idinfo['aud'] != settings.GOOGLE_CLIENT_ID:
                print(f"✗ Audience mismatch!")
                return Response({"error": "Invalid token audience"}, status=status.HTTP_400_BAD_REQUEST)
            
            email = idinfo.get("email")
            
            if not email:
                print(f"✗ No email in token")
                return Response({"error": "Email not found"}, status=status.HTTP_400_BAD_REQUEST)
            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': idinfo.get('given_name', ''),
                    'last_name': idinfo.get('family_name', ''),
                }
            )
            
            if created:
                requester, _ = Group.objects.get_or_create(name="Requesters")
                user.groups.add(requester)
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
            
        except ValueError as e:
            return Response({"error": f"Invalid Google Token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Authentication failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
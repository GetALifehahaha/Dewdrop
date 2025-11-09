from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User
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
        
        print(token)
        
        if not token:
            return Response({"error": "Token Missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            id = id_token.verify_oauth2_token(token, requests.Request())
            
            email = id.get("email")
            
            user = get_object_or_404(User, email=email)
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
            
        except ValueError: 
            return Response({"error": "Invalid Google Token"}, status=status.HTTP_400_BAD_REQUEST)
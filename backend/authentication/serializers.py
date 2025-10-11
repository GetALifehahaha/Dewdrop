from rest_framework import serializers
from django.contrib.auth.models import User, Group

# setup user serializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password']
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        requester, _ = Group.objects.get_or_create(name="requester")
        user.groups.add(requester)
        
        return user
        
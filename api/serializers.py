# api/serializers.py
from rest_framework import serializers
from user_management.models import UserProfile
from rest_framework import serializers
from .models import Item

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'description']

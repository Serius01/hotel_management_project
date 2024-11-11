from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Role, Permission
from .serializers import RoleSerializer, PermissionSerializer
from .permissions import IsAdminUser

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


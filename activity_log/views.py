from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import ActivityLog
from .serializers import ActivityLogSerializer

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Фильтрация по параметрам запроса
        user = self.request.query_params.get('user')
        action_type = self.request.query_params.get('actionType')
        start_date = self.request.query_params.get('startDate')
        end_date = self.request.query_params.get('endDate')

        if user:
            queryset = queryset.filter(user__username__icontains=user)
        if action_type:
            queryset = queryset.filter(action_type=action_type)
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)

        return queryset
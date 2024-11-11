from rest_framework import serializers
from .models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action_type', 'timestamp', 'description', 'ip_address', 'device_info']

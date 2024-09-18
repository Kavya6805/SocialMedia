from rest_framework import serializers

from user.serializers import UserProfileSerializer
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only = True)
    class Meta:
        model = Notification
        fields = ('id', 'body', 'type_of_notification', 'post_id', 'created_for_id', 'created_by', 'created_at_formatted')
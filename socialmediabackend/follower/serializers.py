from rest_framework import serializers
from .models import Follower
from user.models import User  # Adjust the import based on your User model location

class FollowerSerializer(serializers.ModelSerializer):
    # For the user being followed
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_profile_picture = serializers.ImageField(source='user.profile_picture', read_only=True)

    # For the follower
    follower_id = serializers.IntegerField(source='follower.id', read_only=True)
    follower_email = serializers.EmailField(source='follower.email', read_only=True)
    follower_username = serializers.CharField(source='follower.username', read_only=True)
    follower_profile_picture = serializers.ImageField(source='follower.profile_picture', read_only=True)

    class Meta:
        model = Follower
        fields = ['user_id','user_email', 'user_username', 'user_profile_picture', 
                  'follower_id',
                  'follower_email', 'follower_username', 'follower_profile_picture', 
                  'followed_at']

    
class FollowUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

class FollowStatusSerializer(serializers.Serializer):
    isFollowing = serializers.BooleanField()

class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','profile_picture']
from rest_framework import serializers

from user.serializers import UserProfileSerializer

from .models import Post, Trend, PostAttachment,Like

class PostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAttachment
        fields = ('id', 'get_media_url', 'get_media_type')

class LikeSerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only=True)  # Assuming you have a UserProfileSerializer for User

    class Meta:
        model = Like
        fields = ['id', 'created_by', 'created_at'] 

class PostSerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only = True)
    attachments = PostAttachmentSerializer(read_only=True, many=True)
    likes = LikeSerializer(many=True, read_only=True)  # Add likes serialization

    class Meta:
        model = Post
        fields = ('id', 'body', 'likes_count', 'created_by', 'created_at_formatted', 'attachments','comments','likes')

class TrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trend
        fields = ('id', 'hashtag', 'occurences',)
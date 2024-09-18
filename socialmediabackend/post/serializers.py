from rest_framework import serializers

from user.serializers import UserProfileSerializer

from .models import Post, Trend, PostAttachment,Like, Comment

class PostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAttachment
        fields = ('id', 'get_media_url', 'get_media_type')

class CommentSerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'created_by', 'text', 'created_at']

    # def get_created_by(self, obj):
    #     return {
    #         'id': obj.created_by.id,
    #         'username': obj.created_by.username,
    #         'profile_picture': obj.created_by.profile_picture.url if obj.created_by.profile_picture else None
    #     }

class LikeSerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only=True)  # Assuming you have a UserProfileSerializer for User

    class Meta:
        model = Like
        fields = ['id', 'created_by', 'created_at'] 

class PostSerializer(serializers.ModelSerializer):
    created_by = UserProfileSerializer(read_only = True)
    attachments = PostAttachmentSerializer(read_only=True, many=True)
    likes = LikeSerializer(many=True, read_only=True)  # Add likes serialization
    comments = CommentSerializer(many=True, read_only=True)  # Use the CommentSerializer


    class Meta:
        model = Post
        fields = ('id', 'body', 'likes_count', 'created_by', 'created_at_formatted', 'attachments','comments','comments_count','likes')

class TrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trend
        fields = ('id', 'hashtag', 'occurences',)
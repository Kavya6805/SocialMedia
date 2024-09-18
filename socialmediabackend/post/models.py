import uuid

from django.conf import settings
from django.db import models
from django.utils.timesince import timesince
import os

from user.models import User

def upload_to_path(instance, filename):
    extension = filename.split('.')[-1]
    if extension in ['jpg', 'jpeg', 'png', 'gif']:  # Add other image extensions if needed
        return os.path.join('post_attachments/images', filename)
    elif extension in ['mp4', 'avi', 'mov', 'mkv']:  # Add other video extensions if needed
        return os.path.join('post_attachments/videos', filename)
    else:
        return os.path.join('post_attachments/others', filename)

class Like(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(User, related_name='likes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    created_by = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)  # User who created the comment
    text = models.TextField(blank=True)  # The comment text
    created_at = models.DateTimeField(auto_now_add=True)

class PostAttachment(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to=upload_to_path, null=True, blank=True)
    video = models.FileField(upload_to=upload_to_path, null=True, blank=True)
    created_by = models.ForeignKey(User, related_name='post_attachments', on_delete=models.CASCADE)

    def get_media_url(self):
        if self.image:
            return settings.WEBSITE_URL + self.image.url  
        elif self.video:
            print(self.video)
            return settings.WEBSITE_URL + self.video.url
        else:
            return ''
    
    def get_media_type(self):
        if self.image:
            return 'image'
        elif self.video:
            return 'video'
        return 'unknown'

class Post(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    body = models.TextField(blank=True, null=True)

    attachments = models.ManyToManyField(PostAttachment, blank=True)

    # is_private = models.BooleanField(default=False)

    likes = models.ManyToManyField(Like, blank=True)
    likes_count = models.IntegerField(default=0)

    comments = models.ManyToManyField(Comment, blank=True)
    comments_count = models.IntegerField(default=0)

    # reported_by_users = models.ManyToManyField(User, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)

    class Meta:
        ordering = ('-created_at',)

    def created_at_formatted(self):
       return timesince(self.created_at)

class Trend(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hashtag = models.CharField(max_length=255)
    occurences = models.IntegerField()

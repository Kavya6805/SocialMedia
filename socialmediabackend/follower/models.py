from django.db import models
from django.conf import settings

class Follower(models.Model):
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='followers', on_delete=models.CASCADE)  # The user who is following another user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='following', on_delete=models.CASCADE)  # The user who is being followed
    followed_at = models.DateTimeField(auto_now_add=True)  # Track when the follow action happened

    class Meta:
        unique_together = ('follower','user')  # Prevent duplicate follow relationships

    def __str__(self):
        return f"{self.follower.email} follows {self.user.email}"

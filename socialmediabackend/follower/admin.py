from django.contrib import admin
from .models import Follower

@admin.register(Follower)
class FollowerAdmin(admin.ModelAdmin):
    list_display = ( 'follower','user', 'followed_at')
    search_fields = ('follower__email','user__email')

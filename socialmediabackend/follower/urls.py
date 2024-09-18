from django.urls import path
from .views import UserFollowersAPIView, UserFollowingAPIView ,FollowUserAPIView,UnfollowUserAPIView,CheckFollowStatusView,UserSearchAPIView

urlpatterns = [
    path('follow/', FollowUserAPIView.as_view(), name='follow_user'),
    path('unfollow/', UnfollowUserAPIView.as_view(), name='unfollow_user'),
    path('users/<int:user_id>/followers/', UserFollowersAPIView.as_view(), name='user-followers'),
    path('users/<int:user_id>/following/', UserFollowingAPIView.as_view(), name='user-following'),
    path('users/<int:user_id>/is-following/', CheckFollowStatusView.as_view(), name='check-follow-status'),
    path('search/', UserSearchAPIView.as_view(), name='search_users'),
]

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from user.models import User
from .models import Follower
from .serializers import FollowerSerializer, FollowUserSerializer,FollowStatusSerializer

class FollowUserAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FollowUserSerializer(data=request.data)
        if serializer.is_valid():
            user_to_follow = get_object_or_404(User, id=serializer.validated_data['user_id'])
            follower = request.user  # Use the authenticated user

            if user_to_follow == follower:  # Avoid self-follow
                return Response({"message": "Cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the follow relationship already exists
            follow_relation, created = Follower.objects.get_or_create(user=user_to_follow, follower=follower)
            if created:
                return Response({"message": "Followed successfully."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Already following this user."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UnfollowUserAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FollowUserSerializer(data=request.data)
        if serializer.is_valid():
            user_to_unfollow = get_object_or_404(User, id=serializer.validated_data['user_id'])
            follower = request.user  # Use the authenticated user

            follow_relation = Follower.objects.filter(user=user_to_unfollow, follower=follower).first()
            if follow_relation:
                follow_relation.delete()
                return Response({"message": "Unfollowed successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Follow relationship does not exist."}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from user.models import User
from .models import Follower
from .serializers import FollowerSerializer,UserSearchSerializer

class UserFollowersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        followers = Follower.objects.filter(user=user)
        serializer = FollowerSerializer(followers, many=True)
        return Response(serializer.data)


class UserFollowingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,user_id):
        user = get_object_or_404(User, id=user_id)
        following = Follower.objects.filter(follower=user)
        serializer = FollowerSerializer(following, many=True)
        return Response(serializer.data)

class CheckFollowStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        logged_in_user = request.user
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=404)

        # Check if the logged-in user is following the target user
        is_following = Follower.objects.filter(follower=logged_in_user, user=target_user).exists()

        serializer = FollowStatusSerializer({'isFollowing': is_following})
        return Response(serializer.data)
    
class UserSearchAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow authenticated and non-authenticated users to search

    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', None)  # Get 'q' parameter from the request
        if query:
            # Search for users whose usernames contain the query string (case-insensitive)
            users = User.objects.filter(username__icontains=query)
            serializer = UserSearchSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Please provide a search query."}, status=status.HTTP_400_BAD_REQUEST)
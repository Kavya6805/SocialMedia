from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .models import Post, Like, Trend,Comment
from .serializers import PostSerializer, TrendSerializer
from .forms import PostForm, AttachmentForm
from user.models import User
from follower.models import Follower
from user.serializers import UserProfileSerializer
from rest_framework.permissions import IsAuthenticated
from notification.utils import create_notification
from django.shortcuts import get_object_or_404


@api_view(['GET'])
def post_list(request):
    user_ids = []

   # Get the IDs of the users that the current user is following
    following_ids = Follower.objects.filter(follower=request.user).values_list('user_id', flat=True)
    print(following_ids)
    # Get the IDs of the users that are following the current user
    follower_ids = Follower.objects.filter(user=request.user).values_list('follower_id', flat=True)
    # print(follower_ids)
    # | set(follower_ids)
    user_ids = list(set(following_ids)| set(follower_ids) )
    posts = Post.objects.filter(created_by_id__in=list(user_ids))
    print(posts)
    print(user_ids)
    # posts = Post.objects.filter(created_by_id__in=user_ids)

    trend = request.GET.get('trend', '')

    if trend:
        posts = posts.filter(body__icontains='#' + trend).filter(is_private=False)

    serializer = PostSerializer(posts, many=True)

    return JsonResponse(serializer.data, safe=False)
@api_view(['GET'])
def all_post_list(request):
    user_ids = User.objects.values_list('id', flat=True)
    
    # user_ids = list(set(userIds) )
    posts = Post.objects.filter(created_by_id__in=list(user_ids))
    print(posts)
    print(user_ids)

    trend = request.GET.get('trend', '')

    if trend:
        posts = posts.filter(body__icontains='#' + trend).filter(is_private=False)

    serializer = PostSerializer(posts, many=True)

    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def post_list_profile(request):
    # Get user ID from query params
    id = request.GET.get('id')
    print(id)
    # Get the user object, or return a 404 if not found
    user = get_object_or_404(User, pk=id)
    
    # Filter posts by the user ID
    posts = Post.objects.filter(created_by_id=user.id)
    
    # Serialize the data
    posts_serializer = PostSerializer(posts, many=True)
    user_serializer = UserProfileSerializer(user)
    
    return JsonResponse({
        'posts': posts_serializer.data,
        # 'user': user_serializer.data
    }, safe=False)

@api_view(['POST'])
def post_like(request, pk):
    post = Post.objects.get(pk=pk)

    if not post.likes.filter(created_by=request.user):
        like = Like.objects.create(created_by=request.user)

        post = Post.objects.get(pk=pk)
        post.likes_count = post.likes_count + 1
        post.likes.add(like)
        post.save()

        notification = create_notification(request, 'post_like', post_id=post.id)

        return JsonResponse({'message': 'Post liked', 'user_id': like.created_by.id})
    else:
        existing_like = post.likes.filter(created_by=request.user).first()
        return JsonResponse({'message': 'Already liked', 'user_id': existing_like.created_by.id})
    
@api_view(['POST'])
def post_create_comment(request, pk):
    post = Post.objects.get(pk=pk)
    user = request.user
    comment_text = request.data.get('comment', '')
    
    if comment_text:
        comment = Comment.objects.create(post=post, created_by=user, text=comment_text)
        print("comment",comment.text)
        post.comments.add(comment)
        print(post.comments)
        post.comments_count=post.comments_count+1
        post.save()
        
        # Optionally send notification here
        notification = create_notification(request, 'post_comment', post_id=post.id)

        return JsonResponse({
            'id': comment.id,
            'created_by': {
                'id': user.id,
                'username': user.username,
                'avatar': user.profile_picture.url,
            },
            'text': comment.text
        })
    return JsonResponse({'error': 'Comment text required'}, status=400)



@api_view(['POST'])
def post_create(request):
    # Create and validate the PostForm
    post_form = PostForm(request.POST)
    if post_form.is_valid():
        post = post_form.save(commit=False)
        post.created_by = request.user
        post.save()
        # print(post_form)
        # List to hold saved attachments
        attachments = []
        
        # Process files with dynamic keys like image_0, video_0, etc.
        for key in request.FILES:
            print(request.FILES)
            file = request.FILES[key]
            attachment_form_data = {}
            
            if key.startswith('image'):
                print("image Done")
                attachment_form_data['image'] = file  # Set image in form data
            
            elif key.startswith('video'):
                attachment_form_data['video'] = file  # Set video in form data

            # Create a form instance for each file
            if attachment_form_data:
                # print("from attachment")
                attachment_form = AttachmentForm(attachment_form_data)
                
                if attachment_form.is_valid():
                    attachment = attachment_form.save(commit=False)
                    
                    if 'image' in attachment_form_data:
                        attachment.image = file  # Associate the image file with the attachment
                    elif 'video' in attachment_form_data:
                        attachment.video = file  # Associate the video file with the attachment
                    
                    attachment.created_by = request.user
                    attachment.save()
                    attachments.append(attachment)
                else:
                    # Print the form errors to debug why the form is not valid
                    print(f"Form errors for {key}: ", attachment_form.errors)
        
        # Add attachments to the post
        if attachments:
            print("hello")
            post.attachments.set(attachments)
        
        # Update user's posts count
        user = request.user
        user.posts_count = user.posts_count + 1
        user.save()
        
        # Serialize and return the created post
        serializer = PostSerializer(post)
        return JsonResponse(serializer.data, safe=False)
    else:
        return Response({'error': post_form.errors})


@api_view(['GET'])
def get_trends(request):
    serializer = TrendSerializer(Trend.objects.all(), many=True)

    return JsonResponse(serializer.data, safe=False)

from django.urls import path

from . import api


urlpatterns = [
    path('posts/', api.post_list, name='post_list'),
    path('post/create/', api.post_create, name='post_create'),
    path('post-profile/', api.post_list_profile, name='post_list_profile'),
    path('post/<int:pk>/like/', api.post_like, name='post_like'),
    path('allPost/', api.all_post_list, name='post_like'),
    # path('<uuid:pk>/', api.post_detail, name='post_detail'),
    # path('<uuid:pk>/comment/', api.post_create_comment, name='post_create_comment'),
    # path('<uuid:pk>/delete/', api.post_delete, name='post_delete'),
    # path('<uuid:pk>/report/', api.post_report, name='post_report'),
    path('trends/', api.get_trends, name='get_trends'),
]
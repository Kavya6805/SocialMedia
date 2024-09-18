from django.urls import path,include
from user.views import UserRegistrationView
from user.views import UserLoginView
from user.views import UserProfileView
from user.views import UserChangePasswordView
from user.views import SendPasswordResetEmailView
from user.views import UserPasswordResetView,UserProfileUpdateView

urlpatterns = [
    path('register/',UserRegistrationView.as_view(),name='register'),
    path('login/',UserLoginView.as_view(),name='login'),
    path('profile/',UserProfileView.as_view(),name='profile'),
    path('<int:id>/profile/', UserProfileView.as_view(), name='user_profile'),
    path('changepassword/',UserChangePasswordView.as_view(),name='changepassword'),
    path('send-reset-password-email/',SendPasswordResetEmailView.as_view(),name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/',UserPasswordResetView.as_view(),name='reset-password'),
    path('profile/updateprofile/',UserProfileUpdateView.as_view(),name='updateprofile')
    
]

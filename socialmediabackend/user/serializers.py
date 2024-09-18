from xml.dom import ValidationErr
from rest_framework import serializers
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from user.utils import Util
from .models import User
import json
from django.contrib.auth import get_user_model  # Use this if you're using a custom User model
from drf_extra_fields.fields import Base64ImageField


class UserRegistrationSerializer(serializers.ModelSerializer):
    # for confirm pass field
    password2=serializers.CharField(style={'input_type':'password'},write_only=True)
    class Meta:
        model=User
        fields=['username', 'email', 'password', 'password2', 'tc']
        extra_kwargs={
            'password':{'write_only':True}
        }

    def validate(self, attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        if password !=password2:
            raise serializers.ValidationError("Password and confirm password doesn't match")
        return attrs
    
    def create(self,validate_data):
        return User.objects.create_user(**validate_data)


class UserLoginSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        model=User
        fields=['email','password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
           'id','email','username','name','bio','date_of_birth','profile_picture','tc','password','backgroundImage','is_private'
        ]

class UserChangePasswordSerializer(serializers.Serializer):
    password=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    password2=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
    class Meta:
        fields=['password','password2']

    def validate(self,attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        user=self.context.get('user')
        if password !=password2:
            raise serializers.ValidationError("Password and confirm password doesn't match")
        user.set_password(password)
        user.save()
        return attrs
    
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        fields=['email']

    def validate(self,attrs):
        email=attrs.get('email')
        if User.objects.filter(email=email).exists():
            print("user is here")
            user=User.objects.get(email=email)
            uid=urlsafe_base64_encode(force_bytes(user.id))
            print("Encoded ID",uid)
            token=PasswordResetTokenGenerator().make_token(user)
            print('Password reset token',token)
            link='http:/localhost:3000/user/reset/'+uid+'/'+token
            print('Password reset Link',link)
            # encoded_link = urllib.parse.quote(link, safe='/:?=&')
            # send Email
            data={
                'email_subject':'Reset Your Password',
                # 'body':f'Please click on the link to reset your password: <a href="{encoded_link}">Reset Password</a>',
                'body':f'Please click on the link to reset your password {link}',
                # 'plain_text_body' : f'Please click on the link to reset your password: {link}',
                'to_email':user.email
            }
            Util.send_email(data)
            return attrs
        else:
            print("user is not here")
            raise serializers.ValidationError("User with this email doesn't exist")


class UserPasswordResetSerializer(serializers.Serializer): 
    
        password=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
        password2=serializers.CharField(max_length=255,style={'input_type':'password'},write_only=True)
        class Meta:
            fields=['password','password2']
   
        def validate(self,attrs):
            try: 
                # unicode ko decode karte hai islie try except
                password=attrs.get('password')
                password2=attrs.get('password2')
                uid=self.context.get('uid')
                token=self.context.get('token')
                if password !=password2:
                    raise serializers.ValidationError("Password and confirm password doesn't match")
                id=smart_str(urlsafe_base64_decode(uid))
                user=User.objects.get(id=id)
                if not PasswordResetTokenGenerator().check_token(user,token):
                    raise ValidationErr('Token is not valid or Expired')
                user.set_password(password)
                user.save()
                return attrs
            except DjangoUnicodeDecodeError :
                PasswordResetTokenGenerator().check_token(user,token)
                raise ValidationErr('Token is not valid or Expired')

User = get_user_model()  # Get the custom User model

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    backgroundImage = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'profile_picture', 'bio', 'date_of_birth', 'backgroundImage']

    def validate_email(self, value):
        """
        Ensure the email is unique for each user.
        """
        user = self.context.get('request').user
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    def validate_username(self, value):
        """
        Ensure the username is unique for each user.
        """
        user = self.context.get('request').user
        if User.objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def update(self, instance, validated_data):
        """
        Perform the actual update operation.
        Only update fields if they are provided and not None.
        """
        # print("hello from update")
        for field in ['username', 'email', 'name', 'profile_picture', 'bio', 'date_of_birth', 'backgroundImage']:
            value = validated_data.get(field, None)
            if value is not None:
                setattr(instance, field, value)

        instance.save()
        return instance
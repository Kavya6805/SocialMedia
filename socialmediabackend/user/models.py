import uuid
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

# custom user Manager
# 3-9/MUI SIMPLE DROPDOWN
class MyUserManager(BaseUserManager):
    def create_user(self, email, username, tc, password=None, password2=None,bio="",name="",date_of_birth=None):
        # print(password2)
        if not email:
            raise ValueError('Users must have an email address')
        # if password != password2:
        #     raise ValueError('Passwords must match')
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            tc=tc,
            name=name,
            bio=bio,
            date_of_birth=date_of_birth
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, tc, password=None):
        """
        Creates and saves a User with the given email,,username, role, tc and password.
        """
        user = self.create_user(
            email,
            password=password,
            username=username,
            tc=tc,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

# custom user model


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='Email',
        max_length=255,
        unique=True,
    )


    username = models.CharField(max_length=200,unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)  # Ensure the 'name' field exists
    tc = models.BooleanField()
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/',default='default_profile_picture.jpg', blank=True, null=True)
    backgroundImage = models.ImageField(upload_to='profile_pics/',default='background.jpg', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    is_private=models.BooleanField(default=False)
    people_you_may_know = models.ManyToManyField('self', blank=True)

    posts_count = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'tc']

    def _str_(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app app_label?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

class FriendshipRequest(models.Model):
    SENT = 'sent'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

    STATUS_CHOICES = (
        (SENT, 'Sent'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    )

    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_for = models.ForeignKey(User, related_name='received_friendshiprequests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, related_name='created_friendshiprequests', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,default=SENT)
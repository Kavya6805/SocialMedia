from django.contrib import admin
from user.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserModelAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('id','email', 'username','tc', 'is_admin')
    list_filter = ('is_admin',)
    fieldsets = (
        ('user credentials', {'fields': ('email', 'password','date_of_birth','bio','name','profile_picture','backgroundImage','posts_count','people_you_may_know')}),
        ('Personal info', {'fields': ('username','tc')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username','name','bio','date_of_birth','profile_picture','tc','password', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email','id')
    filter_horizontal = ()
admin.site.register(User, UserModelAdmin)

from django.contrib import admin
from . import models
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    model = models.User
    list_display = ['username', 'email', 'is_staff', 'is_active']
    list_filter = ['username', 'email', 'is_staff', 'is_active']
    ordering = ['username', 'email']
    readonly_fields = ['date_joined', 'last_login']
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('firstName', 'lastName', 'phone')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ['username', 'email']

admin.site.register(models.User, CustomUserAdmin)

class FollowAdmin(admin.ModelAdmin):
    model = models.Follow
    list_display = ['follower', 'following']
    list_filter = ['follower', 'following']
    ordering = ['updated_at', 'id']

admin.site.register(models.Follow, FollowAdmin)

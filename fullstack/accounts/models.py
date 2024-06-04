from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager

class User(AbstractUser):
    objects = UserManager()
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    username = models.CharField(max_length=50, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['id', 'username']

    def __str__(self):
        return self.username
    
    def has_module_perms(self, app_label):
        return super().has_module_perms(app_label)
    
    def has_perm(self, perm, obj = None):
        return super().has_perm(perm, obj)
    
    def has_perms(self, perm_list, obj):
        return super().has_perms(perm_list, obj)
    
    def getFollowers(self):
        return Follow.objects.filter(following=self)

    def getFollowing(self):
        return Follow.objects.filter(follower=self)
    
class Follow(models.Model):
    follower = models.ForeignKey('User', on_delete=models.CASCADE, related_name='follower')
    following = models.ForeignKey('User', on_delete=models.CASCADE, related_name='following')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Follow'
        verbose_name_plural = 'Follows'
        ordering = ['updated_at', 'id']
    

    
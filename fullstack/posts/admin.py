from django.contrib import admin
from . import models

class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'title', 'content', 'created_at', 'updated_at')
    list_filter = ('id', 'author', 'title', 'content', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ['id', 'title']
    ordering = ['id', 'updated_at']
    fieldsets = (
        (None, {'fields': ('author', 'title', 'content')}),
        ('Date information', {'fields': ('created_at', 'updated_at')})
    )

admin.site.register(models.Post, PostAdmin)

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'post', 'content', 'created_at', 'updated_at')
    list_filter = ('id', 'author', 'post', 'content', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ['id', 'content']
    ordering = ['id', 'updated_at']
    fieldsets = (
        (None, {'fields': ('author', 'post', 'content')}),
        ('Date information', {'fields': ('created_at', 'updated_at')})
    )

admin.site.register(models.Comment, CommentAdmin)

class LikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'post', 'created_at', 'updated_at')
    list_filter = ('id', 'author', 'post', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ['id']
    ordering = ['id', 'updated_at']
    fieldsets = (
        (None, {'fields': ('author', 'post')}),
        ('Date information', {'fields': ('created_at', 'updated_at')})
    )

admin.site.register(models.Like, LikeAdmin)

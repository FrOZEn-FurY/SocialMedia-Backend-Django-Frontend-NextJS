from django.urls import path
from . import views

app_name = 'posts'
urlpatterns = [
    path('', views.PostsView.as_view(), name='posts'),
    path('comments/', views.CommentsView.as_view(), name='comments'),
    path('likes/<int:post_id>/', views.LikesView.as_view(), name='likes'),
]

from django.urls import path
from . import views

app_name = 'accounts'
urlpatterns = [
    path('', views.AccountsView.as_view(), name='accounts'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('follow/<str:username>/', views.FollowView.as_view(), name='follow'),
]

from django.http import JsonResponse
from django.http.request import HttpRequest as HttpRequest
from django.http.response import HttpResponse as HttpResponse
from .models import User, Follow
from django.views import View
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
import json

class AccountsView(View):
    def get(self, request):
        id = request.GET.get('id')
        if id is not None:
            user = get_object_or_404(User ,id=id)
            posts = []
            for post in user.posts.all():
                posts.append({
                    'id': post.id,
                    'title': post.title,
                    'content': post.content
                })
            followers = []
            for follow in user.getFollowers():
                followers.append({
                    'id': follow.follower.id,
                    'username': follow.follower.username
                    })
            followings = []
            for follow in user.getFollowing():
                followings.append({
                    'id': follow.following.id,
                    'username': follow.following.username
                })
            return JsonResponse({'id': user.id, 'username': user.username, 'firstName': user.firstName, 'lastName': user.lastName, 'email': user.email, 'phone': user.phone, 'posts': posts, 'followers': followers, 'following': followings}, status=200)
        else:
            if request.user.is_authenticated:
                user = request.user
                posts = []
                for post in user.posts.all():
                    posts.append({
                        'id': post.id,
                        'title': post.title,
                        'content': post.content
                    })
                followers = []
                for follow in user.getFollowers():
                    followers.append({
                        'id': follow.follower.id,
                        'username': follow.follower.username
                        })
                followings = []
                for follow in user.getFollowing():
                    followings.append({
                        'id': follow.following.id,
                        'username': follow.following.username
                    })
                return JsonResponse({'id': user.id, 'username': user.username, 'firstName': user.firstName, 'lastName': user.lastName, 'email': user.email, 'phone': user.phone, 'posts': posts, 'followers': followers, 'followings': followings}, status=200)
        return JsonResponse({'message': 'Unauthorized'}, status=401)

    def post(self, request):
        decoded = request.body.decode('utf-8')
        data = json.loads(decoded)
        try:
            user = User.objects.create(email=data["email"], username=data["username"], firstName=data["firstName"], lastName=data["lastName"], phone=data["phone"])
            user.set_password(data["password"])
            user.save()
        except Exception as e:
            return JsonResponse({'message': 'User already exists, note that email and username must be unique.'}, status=401)
        return JsonResponse({'id': user.id, 'firstName': user.firstName, 'lastName': user.lastName, 'email': user.email, 'phone': user.phone}, status=200)
    
    def put(self, request):
        decoded = request.body.decode('utf-8')
        data = json.loads(decoded)
        user = User.objects.get(id=data.get('id'))
        try:
            if data.get("username") is not None and data.get("username") != '':
                user.username = data.get('username')
            if data.get("email") is not None and data.get("email") != '':
                user.email = data.get('email')
            if data.get("first_name") is not None and data.get("first_name") != '':
                user.firstName = data.get('first_name')
            if data.get("last_name") is not None and data.get("last_name") != '':
                user.lastName = data.get('last_name')
            if data.get("phone") is not None and data.get("phone") != '':
                user.phone = data.get('phone')
            user.save()
        except:
            return JsonResponse({'message': 'User already exists, note that email and username must be unique.'}, status=401)
        return JsonResponse({'id': user.id, 'firstName': user.firstName, 'lastName': user.lastName, 'email': user.email, 'phone': user.phone}, status=200)
    
    def delete(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        user = User.objects.get(id=request.user.id)
        response = {'id': user.id, 'firstName': user.firstName, 'lastName': user.lastName, 'email': user.email, 'phone': user.phone}
        user.delete()
        return JsonResponse(response, status=200)
    
class FollowView(View):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        try:
            follow = Follow.objects.get(following=user, follower=request.user)
            follow.delete()
            return JsonResponse({'message': 'Unfollowed successfully.'}, status=200)
        except Follow.DoesNotExist:
            follow = Follow.objects.create(following=user, follower=request.user)
            return JsonResponse({'id': follow.id, 'message': 'Followed successfully.'}, status=200)
    
class LoginView(View):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return JsonResponse({'message': 'Already logged in!'}, status=401)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        decoded = request.body.decode('utf-8')
        data = json.loads(decoded)
        user = authenticate(request, username=data.get('email'), password=data.get('password'))
        if user:
            login(request, user)
            return JsonResponse({'id': user.id, 'username': user.username,'firstName': user.firstName, 'lastName': user.lastName, 'email': user.email, 'phone': user.phone}, status=200)
        return JsonResponse({'message': 'User not found.'}, status=401)

class LogoutView(View):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Not logged in!'}, status=401)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        logout(request)
        return JsonResponse({'message': 'Successfully logged out.'}, status=200)


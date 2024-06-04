from django.http import JsonResponse
from django.http.request import HttpRequest as HttpRequest
from django.http.response import HttpResponse as HttpResponse
from .models import Post, Comment, Like
from accounts.models import User
import json
from django.views import View
from django.shortcuts import get_object_or_404, get_list_or_404
from django.db.models import Q

class PostsView(View):
    def get(self, request):
        id = request.GET.get('id')
        if id is not None:
            post = get_object_or_404(Post ,id=id)
            comments = []
            for comment in post.comments.all():
                comments.append({
                    'id': comment.id,
                    'author': comment.author.username,
                    'post': comment.post.id,
                    'content': comment.content,
                    'created_at': comment.created_at,
                    'updated_at': comment.updated_at
                })
            try:
                Like.objects.get(author=request.user.id, post=post.id)
                liked = True
            except Like.DoesNotExist:
                liked = False
            return JsonResponse({'id': post.id, 'author':{'id': post.author.id, 'email': post.author.email, 'username': post.author.username}, 'title': post.title, 'content': post.content, 'comments': comments, 'created_at': post.created_at, 'updated_at': post.updated_at, 'likes': post.getLikesCount(), 'liked': liked}, status=200)
        
        userID = request.GET.get('user')
        if userID is not None:
            user = get_object_or_404(User, id=userID)
            posts = get_list_or_404(Post, author=user)
            return JsonResponse({'posts': posts}, safe=False, status=200)
        
        posts = Post.objects.all()
        response = {'posts': []}
        for post in posts:
            response['posts'].append({'id': post.id, 'author':{'id': post.author.id, 'email': post.author.email, 'username': post.author.username}, 'title': post.title, 'content': post.content, 'created': post.created_at, 'updated': post.updated_at, 'likes': post.getLikesCount()})
        return JsonResponse(response, status=200)

    def post(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        decoded = request.body.decode('utf-8')
        data = json.loads(decoded)
        author = User.objects.get(id=data["author"])
        post = Post.objects.create(title=data["title"], content=data["content"], author=author)
        post.author = request.user
        post.save()
        return JsonResponse({'id': post.id, 'author':author.username, 'title': post.title, 'content': post.content, 'created_at': post.created_at, 'updated_at': post.updated_at}, status=200)
    
    def put(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        decoded = request.body.decode('utf-8')
        data = json.loads(decoded)
        post = get_object_or_404(Post, id=data.get('id'))
        if request.user != post.author:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        if data.get("title") is not None and data.get('title') != '':
            post.title = data.get('title')
        if data.get("content") is not None and data.get('content') != '':
            post.content = data.get('content')
        post.save()
        return JsonResponse({'id': post.id, 'author':{'id': post.author.id, 'email': post.author.email, 'username': post.author.username}, 'title': post.title, 'content': post.content, 'created_at': post.created_at, 'updated_at': post.updated_at}, status=200)
    
    def delete(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        id = request.GET.get('id')
        if id is not None:
            post = get_object_or_404(Post, id=id)
            if request.user != post.author:
                return JsonResponse({'message': 'Unauthorized'}, status=401)
            response = {'id': post.id, 'author':{'id': post.author.id, 'email': post.author.email, 'username': post.author.username}, 'title': post.title, 'content': post.content, 'created_at': post.created_at, 'updated_at': post.updated_at}
            post.delete()
            return JsonResponse(response, status=200)
        return JsonResponse({'message': "Invalid argument."}, status=401)

class CommentsView(View):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        decoded = request.body.decode('utf-8')
        id = json.loads(decoded).get('id')
        if id is not None:
            comment = get_object_or_404(Comment ,id=id)
            return JsonResponse({'id': comment.id, 'author':comment.author, 'post': comment.post, 'content': comment.content, 'created_at': comment.created_at, 'updated_at': comment.updated_at}, status=200)
        return JsonResponse({'message': "Invalid argument."}, status=401)

    def post(self, request):
        decoded = request.body.decode('utf-8')
        data = json.loads(decoded)
        post = get_object_or_404(Post, id=data.get('post'))
        comment = Comment.objects.create(content=data["content"], author=request.user, post=post)
        return JsonResponse({'id': comment.id, 'author':comment.author.username, 'post': comment.post.id, 'content': comment.content, 'created_at': comment.created_at, 'updated_at': comment.updated_at}, status=200)

    def put(self, request):
        decoded = request.body.decode('utf-8')
        data = json.loads(decoded)
        authorID = get_object_or_404(User, id=data.get('author'))
        postID = get_object_or_404(Post, id=data.get('post'))
        conditions = Q(author=authorID) & Q(post=postID)
        comment = get_object_or_404(Comment, conditions)
        if request.user != comment.author:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        if data.get("content") is not None:
            comment.content = data.get('content')
        return JsonResponse({'id': comment.id, 'author':comment.author, 'post': comment.post, 'content': comment.content, 'created_at': comment.created_at, 'updated_at': comment.updated_at}, status=200)

    def delete(self, request):
        decoded = request.body.decode('utf-8')
        data = json.loads(decoded)
        comment = get_object_or_404(Comment, id=data.get('id'))
        if request.user != comment.author:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        response = {'id': comment.id, 'author':comment.author, 'post': comment.post, 'content': comment.content, 'created_at': comment.created_at, 'updated_at': comment.updated_at}
        comment.delete()
        return JsonResponse(response, status=200)
    
class LikesView(View):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'Unauthorized'}, status=401)
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request, post_id):
        likeStatus = request.GET.get('likeStatus')
        if likeStatus is not None:
            if likeStatus == 'true':
                post = get_object_or_404(Post, id=post_id)
                try:
                    like = Like.objects.get(author=request.user.id, post=post.id)
                    return JsonResponse({'message': 'Like created.'}, status=200)
                except Like.DoesNotExist:
                    like = Like.objects.create(author=request.user, post=post)
                    return JsonResponse({'message': 'Like created.'}, status=200)
            elif likeStatus == 'false':
                post = get_object_or_404(Post, id=post_id)
                try:
                    like = Like.objects.get(author=request.user.id, post=post.id)
                    like.delete()
                    return JsonResponse({'message': 'Like deleted.'}, status=200)
                except Like.DoesNotExist:
                    return JsonResponse({'message': 'Like deleted.'}, status=200)
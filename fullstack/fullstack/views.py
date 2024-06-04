from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def getCSRFToken(req):
    return JsonResponse({'token': req.META.get('CSRF_COOKIE')}, status=200)
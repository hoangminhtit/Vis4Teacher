from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.status import HTTP_200_OK

# Create your views here.

@api_view(["GET"])
def health_check(request):
    data = {
        "user_name": "hoangminhtit",
        "status": 200
    }
    return JsonResponse(data)
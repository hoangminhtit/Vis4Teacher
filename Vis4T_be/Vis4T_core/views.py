from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, generics
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer, 
    TeacherSerializer,
    UniversityClassSerializer,
    StudentSerializer
)
from .models import User, Teacher, UniversityClass, Student

# Create your views here.

@api_view(["GET"])
def health_check(request):
    data = {
        "user_name": "hoangminhtit",
        "status": 200,
        "message": "Vis4Teacher API is running!"
    }
    return JsonResponse(data)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print(f"Registration data received: {request.data}")  # Debug log
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Tạo token cho user mới
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                }
            }, status=status.HTTP_201_CREATED)
        
        print(f"Registration validation errors: {serializer.errors}")  # Debug log
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
            
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({
                "message": "Logout successful"
            }, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({
                "error": "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            
            return Response({
                'access': str(token.access_token),
            })
        except (TokenError, InvalidToken, KeyError):
            return Response({
                'error': 'Invalid refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)

# Class Management Views
class ClassListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UniversityClassSerializer
    
    def get_queryset(self):
        # Lấy hoặc tạo Teacher record
        try:
            teacher = Teacher.objects.get(teacher_id=self.request.user.id)
        except Teacher.DoesNotExist:
            # Tạo Teacher record tự động nếu chưa có
            teacher = Teacher.objects.create(
                teacher_id=self.request.user.id,
                teacher_fullname=self.request.user.full_name or self.request.user.username,
                year_of_birth=1990,  # default value
                academic_title="Giảng viên", 
                major="Chưa xác định",
                gender="O",
                number_of_current_class=0,
                phone_number="",
                user=self.request.user
            )
        return UniversityClass.objects.filter(teacher_id=teacher.teacher_id)
    
    def perform_create(self, serializer):
        try:
            teacher = Teacher.objects.get(teacher_id=self.request.user.id)
            serializer.save(teacher_id=teacher.teacher_id)
        except Teacher.DoesNotExist:
            # Tạo Teacher record tự động nếu chưa có
            teacher = Teacher.objects.create(
                teacher_id=self.request.user.id,
                teacher_fullname=self.request.user.full_name or self.request.user.username,
                year_of_birth=1990,  # default value
                academic_title="Giảng viên", 
                major="Chưa xác định",
                gender="O",
                number_of_current_class=0,
                phone_number="",
                user=self.request.user
            )
            serializer.save(teacher_id=teacher.teacher_id)

class ClassDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UniversityClassSerializer
    lookup_field = 'class_name'
    
    def get_queryset(self):
        try:
            teacher = Teacher.objects.get(teacher_id=self.request.user.id)
        except Teacher.DoesNotExist:
            # Tạo Teacher record tự động nếu chưa có
            teacher = Teacher.objects.create(
                teacher_id=self.request.user.id,
                teacher_fullname=self.request.user.full_name or self.request.user.username,
                year_of_birth=1990,  # default value
                academic_title="Giảng viên", 
                major="Chưa xác định",
                gender="O",
                number_of_current_class=0,
                phone_number="",
                user=self.request.user
            )
        return UniversityClass.objects.filter(teacher_id=teacher.teacher_id)

class ClassStudentsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentSerializer
    
    def get_queryset(self):
        class_name = self.kwargs['class_name']
        try:
            teacher = Teacher.objects.get(teacher_id=self.request.user.id)
            return Student.objects.filter(
                class_name__class_name=class_name,
                class_name__teacher_id=teacher.teacher_id
            )
        except Teacher.DoesNotExist:
            return Student.objects.none()

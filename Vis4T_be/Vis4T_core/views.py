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
from rest_framework.parsers import MultiPartParser, FormParser
import tempfile
import os
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer, 
    TeacherSerializer,
    UniversityClassSerializer,
    StudentSerializer
)
from .models import User, Teacher, UniversityClass, Student
from .utils import DataProcessor

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
        
        # Validation: Check if class name already exists
        class_name = serializer.validated_data.get('class_name')
        if UniversityClass.objects.filter(class_name=class_name).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError(f"Lớp '{class_name}' đã tồn tại!")
        
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


class UploadStudentsView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, class_name):
        try:
            # Kiểm tra xem có file được upload không
            if 'file' not in request.FILES:
                return Response(
                    {"error": "Vui lòng chọn file để upload"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Sử dụng class_name từ URL path thay vì request.data
            if not class_name:
                return Response(
                    {"error": "Vui lòng cung cấp tên lớp"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Kiểm tra quyền của teacher
            try:
                teacher = Teacher.objects.get(teacher_id=request.user.id)
                university_class = UniversityClass.objects.get(
                    class_name=class_name,
                    teacher_id=teacher.teacher_id
                )
            except Teacher.DoesNotExist:
                return Response(
                    {"error": "Bạn không có quyền thực hiện hành động này"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            except UniversityClass.DoesNotExist:
                return Response(
                    {"error": "Lớp học không tồn tại hoặc bạn không có quyền truy cập"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            uploaded_file = request.FILES['file']
            
            # Kiểm tra định dạng file
            if not (uploaded_file.name.endswith('.xlsx') or uploaded_file.name.endswith('.csv')):
                return Response(
                    {"error": "Chỉ hỗ trợ file Excel (.xlsx) hoặc CSV (.csv)"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Lưu file tạm thời để xử lý
            with tempfile.NamedTemporaryFile(
                delete=False, 
                suffix='.xlsx' if uploaded_file.name.endswith('.xlsx') else '.csv'
            ) as temp_file:
                for chunk in uploaded_file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name
            
            try:
                # Sử dụng DataProcessor để xử lý file
                processor = DataProcessor(temp_file_path)
                students_data = processor.get_all_student_detail()
                
                # Kiểm tra dữ liệu có hợp lệ không
                if students_data.empty:
                    return Response(
                        {"error": "File không chứa dữ liệu hợp lệ"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Cập nhật hoặc tạo sinh viên
                created_count = 0
                updated_count = 0
                errors = []
                
                for _, row in students_data.iterrows():
                    try:
                        student_data = {
                            'student_id': str(row['student_id']),
                            'class_name': university_class,
                            'student_name': row['student_name'],
                            'student_gmail': row['student_gmail'],
                            'passed_credit': int(row['passed_credit']),
                            'score_10': float(row['score_10']),
                            'score_4': float(row['score_4']),
                            'score_char': row['score_char']
                        }
                        
                        # Tạo hoặc cập nhật sinh viên
                        student, created = Student.objects.update_or_create(
                            student_id=student_data['student_id'],
                            defaults=student_data
                        )
                        
                        if created:
                            created_count += 1
                        else:
                            updated_count += 1
                            
                    except Exception as e:
                        errors.append(f"Lỗi xử lý sinh viên {row['student_id']}: {str(e)}")
                
                # Xóa file tạm
                os.unlink(temp_file_path)
                
                # Trả về kết quả
                response_data = {
                    'message': 'Upload thành công',
                    'created': created_count,
                    'updated': updated_count,
                    'total': len(students_data),
                }
                
                if errors:
                    response_data['errors'] = errors
                
                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                # Xóa file tạm nếu có lỗi
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
                return Response(
                    {"error": f"Lỗi xử lý file: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {"error": f"Có lỗi xảy ra: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

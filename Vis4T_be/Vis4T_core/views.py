from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
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
import hashlib
import hmac
import time
import json
from urllib.parse import urlencode
from django.conf import settings
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
        teacher = self.get_or_create_teacher()
        return UniversityClass.objects.filter(teacher=teacher)
    
    def get_or_create_teacher(self):
        """Helper method to get or create teacher for current user"""
        try:
            return Teacher.objects.get(email=self.request.user.email)
        except Teacher.DoesNotExist:
            return Teacher.objects.create(
                teacher_id=f"T{self.request.user.id:06d}",
                email=self.request.user.email,
                password="",
                teacher_fullname=self.request.user.full_name or self.request.user.username,
                year_of_birth=1990,
                academic_title="Giảng viên", 
                major="Chưa xác định",
                gender="O",
                number_of_current_class=0,
                phone_number=""
            )
    
    def create(self, request, *args, **kwargs):
        teacher = self.get_or_create_teacher()
        
        # Check if class already exists
        class_name = request.data.get('class_name')
        existing_class = UniversityClass.objects.filter(class_name=class_name).first()
        
        if existing_class:
            # Nếu lớp đã tồn tại, gán teacher hiện tại làm chủ nhiệm
            existing_class.teacher = teacher
            existing_class.class_major = request.data.get('class_major', existing_class.class_major)
            existing_class.total_semester = request.data.get('total_semester', existing_class.total_semester)
            existing_class.total_credit = request.data.get('total_credit', existing_class.total_credit)
            existing_class.teacher_note = request.data.get('teacher_note', existing_class.teacher_note)
            existing_class.save()
            
            serializer = self.get_serializer(existing_class)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Tạo lớp mới
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(teacher=teacher)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ClassDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UniversityClassSerializer
    lookup_field = 'class_name'
    
    def get_queryset(self):
        try:
            teacher = Teacher.objects.get(email=self.request.user.email)
        except Teacher.DoesNotExist:
            # Tạo Teacher record tự động nếu chưa có
            teacher = Teacher.objects.create(
                teacher_id=f"T{self.request.user.id:06d}",  # T000001 format
                email=self.request.user.email,
                password="",  # Not used for auth
                teacher_fullname=self.request.user.full_name or self.request.user.username,
                year_of_birth=1990,  # default value
                academic_title="Giảng viên", 
                major="Chưa xác định",
                gender="O",
                number_of_current_class=0,
                phone_number=""
            )
        return UniversityClass.objects.filter(teacher=teacher)

class ClassStudentsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentSerializer
    
    def get_queryset(self):
        class_name = self.kwargs['class_name']
        try:
            teacher = Teacher.objects.get(email=self.request.user.email)
            return Student.objects.filter(
                class_name__class_name=class_name,
                class_name__teacher=teacher
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
                teacher = Teacher.objects.get(email=request.user.email)
                university_class = UniversityClass.objects.get(
                    class_name=class_name,
                    teacher=teacher
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


class ClassDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, class_name):
        """
        Generate Metabase dashboard URL for specific class
        """
        try:
            # Verify teacher has permission to view this class
            teacher = Teacher.objects.get(email=request.user.email)
            university_class = UniversityClass.objects.get(
                class_name=class_name,
                teacher=teacher
            )
            
            # Metabase configuration (thêm vào settings.py sau)
            metabase_url = getattr(settings, 'METABASE_URL', 'http://localhost:3000')
            dashboard_id = getattr(settings, 'METABASE_DASHBOARD_ID', '2')
            secret_key = getattr(settings, 'METABASE_SECRET_KEY')
            
            # Parameters for the dashboard
            params = {
                'class_name_id': class_name
            }
                        
            # Generate signed URL for Metabase embedding
            payload = {
                'resource': {'dashboard': int(dashboard_id)},
                'params': params,
                'exp': int(time.time()) + 600  # Expires in 10 minutes
            }
            
            # Create JWT token for Metabase
            payload_json = json.dumps(payload, separators=(',', ':'), sort_keys=True)
            signature = hmac.new(
                secret_key.encode('utf-8'),
                payload_json.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            # Simple embedding URL (for development)
            # For production, use proper JWT signing
            dashboard_url = f"{metabase_url}/embed/dashboard/{dashboard_id}?" + f"?text={class_name}"
                        
            return Response({
                'dashboard_url': dashboard_url,
                'class_name': class_name,
                'class_info': {
                    'class_name': university_class.class_name,
                    'class_major': university_class.class_major,
                    'number_of_student': university_class.number_of_student
                }
            }, status=status.HTTP_200_OK)
            
        except Teacher.DoesNotExist:
            return Response(
                {"error": "Teacher not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except UniversityClass.DoesNotExist:
            return Response(
                {"error": "Class not found or you don't have permission to view this class"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, student_id):
        """
        Generate Metabase dashboard URL for specific student
        """
        try:
            # Verify teacher has permission to view this student
            teacher = Teacher.objects.get(email=request.user.email)
            student = Student.objects.get(student_id=student_id)
            
            # Check if teacher owns the class this student belongs to
            if student.class_name.teacher != teacher:
                return Response(
                    {"error": "You don't have permission to view this student"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Metabase configuration
            metabase_url = getattr(settings, 'METABASE_URL', 'http://localhost:3000')
            student_dashboard_id = getattr(settings, 'METABASE_STUDENT_DASHBOARD_ID', '3')
            secret_key = getattr(settings, 'METABASE_SECRET_KEY')
            
            # Parameters for the dashboard
            params = {
                'student_id': student_id
            }
                        
            # Generate signed URL for Metabase embedding
            payload = {
                'resource': {'dashboard': int(student_dashboard_id)},
                'params': params,
                'exp': int(time.time()) + 600  # Expires in 10 minutes
            }
            
            # Create JWT token for Metabase
            payload_json = json.dumps(payload, separators=(',', ':'), sort_keys=True)
            signature = hmac.new(
                secret_key.encode('utf-8'),
                payload_json.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            # Simple embedding URL (for development)
            dashboard_url = f"{metabase_url}/embed/dashboard/{student_dashboard_id}?student_id={student_id}"
                        
            return Response({
                'dashboard_url': dashboard_url,
                'student_id': student_id,
                'student_info': {
                    'student_id': student.student_id,
                    'student_name': student.student_name,
                    'class_name': student.class_name.class_name,
                    'score_10': student.score_10,
                    'score_4': student.score_4,
                    'score_char': student.score_char
                }
            }, status=status.HTTP_200_OK)
            
        except Teacher.DoesNotExist:
            return Response(
                {"error": "Teacher not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Student.DoesNotExist:
            return Response(
                {"error": "Student not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StudentRedirectView(APIView):
    """
    Simple redirect endpoint for Metabase click behavior
    Returns HTML that sends postMessage to parent window
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, student_id):
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Redirecting...</title>
        </head>
        <body>
            <script>
                // Send message to parent window
                window.parent.postMessage({{
                    type: 'NAVIGATE_TO_STUDENT',
                    studentId: '{student_id}'
                }}, '*');
                
                // Close this window/tab if possible
                setTimeout(() => {{
                    window.close();
                }}, 100);
            </script>
            <p>Redirecting to student dashboard...</p>
        </body>
        </html>
        """
        return HttpResponse(html_content, content_type='text/html')
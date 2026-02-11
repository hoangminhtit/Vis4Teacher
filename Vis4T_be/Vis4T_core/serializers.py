from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Teacher, UniversityClass, Student

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'full_name', 'phone']
    
    def validate(self, attrs):
        password_confirm = attrs.get('password_confirm')
        if password_confirm and attrs['password'] != password_confirm:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm', None)  # Remove safely if exists
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid username or password')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Username and password are required')
        return attrs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    
    class Meta:
        model = Teacher
        fields = ['user', 'teacher_id', 'teacher_fullname', 'year_of_birth', 
                 'academic_title', 'major', 'gender', 'gender_display', 
                 'number_of_current_class', 'phone_number']

class UniversityClassSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = UniversityClass
        fields = ['class_name', 'number_of_student', 'class_major', 
                 'teacher_note', 'total_credit', 'status', 'status_display', 'total_semester']
        
class UniversityClassCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversityClass
        fields = ['class_name', 'number_of_student', 'class_major', 
                 'teacher_note', 'total_credit', 'total_semester']

class StudentSerializer(serializers.ModelSerializer):
    class_name_display = serializers.CharField(source='class_name.class_name', read_only=True)
    
    class Meta:
        model = Student
        fields = ['student_id', 'class_name', 'class_name_display', 'student_name', 
                 'student_gmail', 'passed_credit', 'score_10', 'score_4', 
                 'score_char', 'is_graduated']
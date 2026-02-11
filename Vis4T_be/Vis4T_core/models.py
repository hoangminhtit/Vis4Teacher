from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class Teacher(models.Model):
    teacher_id = models.CharField(max_length=20, unique=True, primary_key=True)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    teacher_fullname = models.CharField(max_length=50)
    year_of_birth = models.IntegerField()
    academic_title = models.CharField(max_length=100)
    major = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=[
        ('M', 'Nam'),
        ('F', 'Nữ'),
        ('O', 'Khác')
    ])
    number_of_current_class = models.IntegerField(default=0)
    phone_number = models.CharField(max_length=20)

    class Meta:
        db_table = 'teacher'

    def __str__(self):
        return f"Teacher: {self.teacher_fullname}"

class UniversityClass(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='classes')
    class_name = models.CharField(max_length=255, unique=True, primary_key=True)
    number_of_student = models.IntegerField(default=0)
    class_major = models.CharField(max_length=30)
    teacher_note = models.TextField(max_length=250, blank=True, default='')
    total_credit = models.IntegerField()
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Đang học'),
        ('completed', 'Hoàn thành'),
        ('suspended', 'Tạm dừng')
    ])
    total_semester = models.IntegerField()

    class Meta:
        db_table = 'university_class'
        ordering = ['class_name']
        verbose_name_plural = 'Classes'

    def __str__(self):
        return f"{self.class_name} - {self.class_major}"

class Subject(models.Model):
    subject_id = models.CharField(max_length=20, primary_key=True)
    subject_name = models.CharField(max_length=255)
    credit = models.IntegerField()

    class Meta:
        db_table = 'subject'

    def __str__(self):
        return f"{self.subject_id} - {self.subject_name}"

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True, primary_key=True)
    class_name = models.ForeignKey(UniversityClass, on_delete=models.CASCADE, related_name='students')
    student_name = models.CharField(max_length=255)
    student_gmail = models.EmailField()
    passed_credit = models.IntegerField()
    score_10 = models.FloatField()
    score_4 = models.FloatField()
    score_char = models.CharField(max_length=3)
    is_graduated = models.BooleanField(default=False)
    subjects = models.ManyToManyField(Subject, through='Subject_student', related_name='students')
    rank = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = 'student'

    def __str__(self):
        return f"{self.student_id} - {self.student_name}"

class Subject_class(models.Model):
    class_name = models.ForeignKey(UniversityClass, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    semester_id = models.IntegerField()

    class Meta:
        db_table = 'subject_class'
        unique_together = ('class_name', 'subject')

    def __str__(self):
        return f"{self.class_name} - {self.subject}"

class Subject_student(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    score_10 = models.FloatField()

    class Meta:
        db_table = 'subject_student'
        unique_together = ('student', 'subject')

    def __str__(self):
        return f"{self.student} - {self.subject} - {self.score_10}"

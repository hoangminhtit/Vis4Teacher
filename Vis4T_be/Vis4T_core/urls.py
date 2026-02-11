from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from . import views

urlpatterns = [
    # Health check
    path('api/health/', views.health_check, name="health_check"),
    
    # Authentication endpoints
    path('api/auth/register/', views.RegisterView.as_view(), name='register'),
    path('api/auth/login/', views.LoginView.as_view(), name='login'),
    path('api/auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/auth/refresh/', views.RefreshTokenView.as_view(), name='refresh_token'),
    
    # User profile
    path('api/user/profile/', views.UserProfileView.as_view(), name='user_profile'),
    
    # Class management
    path('api/classes/', views.ClassListCreateView.as_view(), name='class_list_create'),
    path('api/classes/<str:class_name>/', views.ClassDetailView.as_view(), name='class_detail'),
    path('api/classes/<str:class_name>/students/', views.ClassStudentsView.as_view(), name='class_students'),
    path('api/classes/<str:class_name>/upload-students/', views.UploadStudentsView.as_view(), name='upload_students'),
    path('api/classes/<str:class_name>/dashboard/', views.ClassDashboardView.as_view(), name='class_dashboard'),
    
    # JWT simple views (backup)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

 
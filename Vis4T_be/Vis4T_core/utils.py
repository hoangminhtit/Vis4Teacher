from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

def get_tokens_for_user(user):
    """
    Generate access and refresh tokens for a user
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def create_user_response(user, include_tokens=True):
    """
    Create a standardized user response with optional tokens
    """
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'phone': user.phone,
        'date_joined': user.date_joined.isoformat()
    }
    
    if include_tokens:
        tokens = get_tokens_for_user(user)
        return {
            'user': user_data,
            'tokens': tokens
        }
    
    return {'user': user_data}
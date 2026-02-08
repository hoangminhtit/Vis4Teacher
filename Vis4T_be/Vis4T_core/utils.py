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

##
from unidecode import unidecode
import pandas as pd
import re

class DataProcessor:
    def __init__(self, filename: str) -> None:
        if filename.endswith('xlsx'):
            self.df = pd.read_excel(filename, skiprows=9, skipfooter=2)
        elif filename.endswith('csv'):
            self.df = pd.read_csv(filename, skiprows=9, skipfooter=2)

        get_raw_cols = list(self.df.columns)
        if 'Unnamed: 0' in get_raw_cols:
            self.df.drop(columns='Unnamed: 0', inplace=True)
        if 'Điểm' in get_raw_cols:
            self.df.drop(columns='Điểm', inplace=True)
        if 'Xếp loại.1' in get_raw_cols:
            self.df.drop(columns='Xếp loại.1', inplace=True)

    
    def get_all_student_detail(self):
        col_names = ['student_id', 'passed_credit', 'score_10', 'score_4', 'score_char', 'rank', 'student_name', 'student_gmail']

        df = self.df.copy()
        df = df.drop(columns=df.columns[3:-5])
        rename_map = {
            'Unnamed: 1': 'student_id',
            'Unnamed: 2': 'first_name',
            'Unnamed: 3': 'last_name'
        }

        df.rename(columns=rename_map, inplace=True)
        
        # normalize student_id
        df['student_id'] = df['student_id'].astype('int')
        
        df['student_name'] = df['first_name'] + ' ' + df['last_name']
        df['student_gmail'] = df.apply(lambda x: f"{unidecode(str(x['last_name']).lower())}.{x['student_id']}@iuh.edu.vn", axis=1)
        
        df.drop(columns=['first_name', 'last_name'], inplace=True)
        
        df.columns = col_names
        return df
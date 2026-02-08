import json
from Vis4T_be.wsgi import *
from Vis4T_core.models import *
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

t1, created = Teacher.objects.get_or_create(
    teacher_id = "test",
    defaults={
        'email': "test@gmail.com",
        'password': make_password("test"),
        'teacher_fullname': "Võ Văn A",
        'year_of_birth': 1979,
        'academic_title': "Thạc sĩ",
        'major': "Khoa học máy tính",
        'gender': "M",
        'phone_number': "12345678"
    }
)

t2, created = Teacher.objects.get_or_create(
    teacher_id = "test2",
    defaults={
        'email': 'test2@gmail.com',
        'password': make_password('test2'),
        'teacher_fullname': 'Nguyễn Hữu Tình',
        'year_of_birth': 1970,
        'academic_title': 'Thạc sĩ',
        'major': 'Công nghệ thông tin',
        'gender': 'M',
        'phone_number': "234567891",
    }
)

khdl16a, created = UniversityClass.objects.get_or_create(
    class_name = 'KHDL16A',
    defaults={
        'teacher': t1,
        'class_major': 'Khoa Học Dữ Liệu',
        'total_semester': 9,
        'total_credit': 156
    }
)

khdl15a, created = UniversityClass.objects.get_or_create(
    class_name = 'KHDL15A',
    defaults={
        'teacher': t2,
        'class_major': 'Khoa Học Dữ Liệu', 
        'total_semester': 8,
        'total_credit': 146
    }
)

khmt13a, created = UniversityClass.objects.get_or_create(
    class_name = 'KHMT13A',
    defaults={
        'teacher': t2,
        'class_major': 'Khoa Học Máy Tính',
        'total_semester': 8,
        'total_credit': 148
    }
)

khmt14a, created = UniversityClass.objects.get_or_create(
    class_name = 'KHMT14A',
    defaults={
        'teacher': t1,
        'number_of_student': 72,
        'class_major': 'Khoa Học Máy Tính',
        'total_semester': 8,
        'total_credit': 128,
        'is_active': False
    }
)

with open('./data/KHMT14A.json', 'r', encoding='utf-8') as f:
    student_data = json.load(f)
    for i in student_data:
        s, created = Student.objects.get_or_create(
            student_id = i['student_id'],
            defaults={
                'class_name': khmt14a,
                'student_name': i['student_name'],
                'student_gmail': i['student_gmail'],
                'passed_credit': i['passed_credit'],
                'score_10': i['score_10'],
                'score_4': i['score_4'],
                'score_char': i['score_char'],
                'rank': i['rank']
            }
        )
    
        

with open('./data/KHDL16A.json', 'r', encoding='utf-8') as f:
    student_data = json.load(f)
    for i in student_data:
        s, created = Student.objects.get_or_create(
            student_id = i['student_id'],
            defaults={
                'class_name': khdl16a,
                'student_name': i['student_name'],
                'student_gmail': i['student_gmail'],
                'passed_credit': i['passed_credit'],
                'score_10': i['score_10'],
                'score_4': i['score_4'],
                'score_char': i['score_char'],
                'rank': i['rank']
            }
        )
    khdl16a.number_of_student = len(student_data)
    khdl16a.save()

with open('./data/KHMT13A.json', 'r', encoding='utf-8') as f:
    student_data = json.load(f)
    for i in student_data:
        s, created = Student.objects.get_or_create(
            student_id = i['student_id'],
            defaults={
                'class_name': khmt13a,
                'student_name': i['student_name'],
                'student_gmail': i['student_gmail'],
                'passed_credit': i['passed_credit'],
                'score_10': i['score_10'],
                'score_4': i['score_4'],
                'score_char': i['score_char'],
                'rank': i['rank']
            }
        )
    khmt13a.number_of_student = len(student_data)
    khmt13a.save()



with open('./data/KHDL15A.json', 'r', encoding='utf-8') as f:
    student_data = json.load(f)
    for i in student_data:
        s, created = Student.objects.get_or_create(
            student_id = i['student_id'],
            defaults={
                'class_name': khdl15a,
                'student_name': i['student_name'],
                'student_gmail': i['student_gmail'],
                'passed_credit': i['passed_credit'],
                'score_10': i['score_10'],
                'score_4': i['score_4'],
                'score_char': i['score_char'],
                'rank': i['rank']
            }
        )
    khdl15a.number_of_student = len(student_data)
    khdl15a.save()
        
with open("./data/subjects.json", 'r', encoding='utf-8') as f:
    subjects_data = json.load(f)
subjects = []
for k in subjects_data:
    r, created = Subject.objects.get_or_create(
        subject_id = k['name_code'],
        defaults={
            'subject_name': k['name'].strip(),
            'credit': k['credit'],
        }
    )
    subjects.append(r)
    if created:
        print(f"Created subject: {r.subject_name}")
    
with open("./data/subjects_class.json", 'r', encoding='utf-8') as f:
    subject_class_data = json.load(f)
for k in subject_class_data:
    class_ = UniversityClass.objects.get(class_name=k)
    for i in subject_class_data[k]:
        subject = Subject.objects.get(subject_id=i['name_code'])
        subject_class, created = Subject_class.objects.get_or_create(
            class_name = class_, 
            subject = subject,
            defaults={
                'semester_id': i['semester_id']
            }
        )
        if created:
            print(f"Created subject_class: {class_} - {subject}")
        
class_name = ['KHMT13A', 'KHDL16A', 'KHDL15A']
for i in class_name:
    uc = UniversityClass.objects.get(class_name=i)
    with open(f"./data/{i}_score.json", encoding='utf-8') as f:
        data = json.load(f)
        for i in data:
            s = Student.objects.get(student_id=i)
            for j in data[i]:
                if j['score_10'] < 0:
                    continue
                subject_class = Subject_class.objects.filter(class_name=uc, subject__subject_name=j['subject_name'].strip()).first()
                if subject_class is None:
                    try:
                        subject = Subject.objects.filter(subject_name__icontains=j['subject_name'].strip()).first()
                        if subject is None:
                            print(f"Subject not found for: {j['subject_name']}")
                            continue
                    except:
                        print(uc, j)
                        continue
                else:
                    subject = subject_class.subject          
                
                # Kiểm tra subject có tồn tại không
                if subject is None:
                    print(f"Subject is None for: {j['subject_name']}")
                    continue
                    
                subject_student, created = Subject_student.objects.get_or_create(
                    student = s,
                    subject = subject,
                    defaults={
                        'score_10': float(j['score_10'])
                    }
                )
                if created:
                    s.subjects.add(subject)
 
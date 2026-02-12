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

# Giữ teacher test2 để sau này có thể dùng cho các lớp khác
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

# Chỉ tạo lớp KHDL16A để test và vẽ dashboard
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
    try:
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
    except UniversityClass.DoesNotExist:
        print(f"Class {k} not found, skipping subjects for this class...")
        continue
        
class_names = ['KHMT13A', 'KHDL16A', 'KHDL15A']
# class_names = ['KHDL16A']

for class_name in class_names:
    print(f"Processing class: {class_name}")
    
    # Fetch class object once
    try:
        uc = UniversityClass.objects.get(class_name=class_name)
    except UniversityClass.DoesNotExist:
        print(f"Class {class_name} not found, skipping...")
        continue
    
    # Load score data
    try:
        with open(f"./data/{class_name}_score.json", encoding='utf-8') as f:
            score_data = json.load(f)
    except FileNotFoundError:
        print(f"Score file for {class_name} not found, skipping...")
        continue
    except json.JSONDecodeError:
        print(f"Invalid JSON in score file for {class_name}, skipping...")
        continue
    
    # Cache subjects for this class to avoid repeated database queries
    subject_classes = {
        sc.subject.subject_name.strip().lower(): sc.subject 
        for sc in Subject_class.objects.filter(class_name=uc).select_related('subject')
    }
    
    # Cache all subjects for fallback search
    all_subjects = {
        s.subject_name.strip().lower(): s 
        for s in Subject.objects.all()
    }
    
    # Cache students for this class
    students = {
        s.student_id: s 
        for s in Student.objects.filter(class_name=uc).prefetch_related('subjects')
    }
    
    # Batch data for bulk operations
    subject_students_to_create = []
    student_subject_relationships = []
    
    for student_id, subjects_data in score_data.items():
        if student_id not in students:
            print(f"Student {student_id} not found in class {class_name}, skipping...")
            continue
            
        student = students[student_id]
        
        for subject_data in subjects_data:
            score = subject_data.get('score_10', -1)
            if score < 0:
                continue
                
            subject_name = subject_data['subject_name'].strip()
            subject_name_lower = subject_name.lower()
            
            # Try to find subject in class subjects first
            subject = subject_classes.get(subject_name_lower)
            
            # If not found, search in all subjects
            if subject is None:
                subject = all_subjects.get(subject_name_lower)
                
            # If still not found, try partial match
            if subject is None:
                for name, sbj in all_subjects.items():
                    if subject_name_lower in name or name in subject_name_lower:
                        subject = sbj
                        break
            
            if subject is None:
                print(f"Subject not found for: {subject_name}")
                continue
            
            # Check if this student-subject relationship already exists
            if not Subject_student.objects.filter(student=student, subject=subject).exists():
                subject_students_to_create.append(
                    Subject_student(
                        student=student,
                        subject=subject,
                        score_10=float(score)
                    )
                )
                student_subject_relationships.append((student, subject))
    
    # Bulk create Subject_student objects
    if subject_students_to_create:
        try:
            Subject_student.objects.bulk_create(subject_students_to_create, ignore_conflicts=True)
            print(f"Created {len(subject_students_to_create)} Subject_student records for {class_name}")
            
            # Add many-to-many relationships
            for student, subject in student_subject_relationships:
                student.subjects.add(subject)
                
        except Exception as e:
            print(f"Error during bulk creation for {class_name}: {e}")
    
    print(f"Completed processing {class_name}\n")


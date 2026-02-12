# Vis4Teacher - Visualization for Teacher

Hệ thống trực quan hóa điểm số sinh viên thông minh dành cho giảng viên.

## 🏗️ Kiến trúc hệ thống

- **Frontend**: React.js + Vite + TailwindCSS
- **Backend**: Django + Django REST Framework + JWT Authentication
- **Database**: PostgreSQL (Supabase)
- **Visualization**: Metabase (Embedded Dashboard)

## 📂 Cấu trúc dự án

```
Vis4Teacher/
├── vis-core-fe/          # React Frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   │   ├── LeftSidebar.jsx
│   │   │   ├── navBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── UpdateClass.jsx
│   │   │   ├── AddClass.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   ├── UploadStudents.jsx
│   │   │   ├── TeacherProfile.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Homepage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── services/
│   │       └── api.js
│   └── package.json
└── Vis4T_be/             # Django Backend
    ├── Vis4T_core/       # Main App
    │   ├── models.py     # User, Teacher, Class, Student models
    │   ├── views.py      # API Views + Metabase integration
    │   ├── serializers.py
    │   ├── urls.py
    │   └── utils.py      # DataProcessor utility
    ├── data/             # Sample data files
    └── manage.py
```

## 🚀 Các tính năng đã hoàn thành

### Authentication & User Management
- ✅ Đăng ký tài khoản giảng viên
- ✅ Đăng nhập/đăng xuất với JWT
- ✅ Custom User model với profile mở rộng
- ✅ Auto token refresh
- ✅ Protected routes

### Class Management
- ✅ Xem danh sách lớp chủ nhiệm
- ✅ Thêm lớp mới
- ✅ Cập nhật thông tin lớp
- ✅ Upload file điểm (Excel/CSV)

### Student Management
- ✅ Xem danh sách sinh viên theo lớp
- ✅ Thêm/sửa/xóa sinh viên
- ✅ Upload danh sách sinh viên từ file

### Dashboard & Visualization
- ✅ Tích hợp Metabase embedded dashboard
- ✅ Biểu đồ phân bố điểm theo lớp
- ✅ Tự động filter theo class_name

### Frontend Components
- ✅ Responsive navigation bar
- ✅ Left sidebar menu với expand/collapse
- ✅ Login/Register pages
- ✅ Homepage với dashboard layout
- ✅ AuthContext cho state management

## 🛠️ Cài đặt và chạy

### Backend (Django)
```bash
cd Vis4T_be
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React)
```bash
cd vis-core-fe
npm install
npm run dev
```

### Metabase (Docker)
```bash
docker run -d -p 3000:3000 --name metabase metabase/metabase
```

## ⚙️ Environment Variables

### Backend (.env)
```
METABASE_URL=http://localhost:3000
METABASE_DASHBOARD_ID=1
METABASE_SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...
```

## 🎯 Mục tiêu dự án

Tạo một hệ thống giúp giảng viên:
1. **Quản lý lớp học** và danh sách sinh viên
2. **Trực quan hóa điểm số** qua Metabase dashboard
3. **Phân tích xu hướng** học tập của sinh viên
4. **Tạo báo cáo** chi tiết về kết quả học tập

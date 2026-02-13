# Vis4Teacher - Visualization for Teacher

<p align="center">
  <img src="vis-core-fe/src/assets/logo-iuh.jpg" width="80" alt="IUH Logo">
</p>

<p align="center">
  <strong>Hệ thống trực quan hóa điểm số sinh viên thông minh dành cho giảng viên</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Django-5.0-green?logo=django" alt="Django">
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Metabase-Dashboard-purple" alt="Metabase">
  <img src="https://img.shields.io/badge/Docker-Ready-blue?logo=docker" alt="Docker">
</p>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [Tính năng](#-tính-năng)
- [Cài đặt](#️-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [API Documentation](#-api-documentation)
- [Đội ngũ phát triển](#-đội-ngũ-phát-triển)

---

## 🎯 Giới thiệu

**Vis4Teacher** là hệ thống quản lý lớp học và trực quan hóa điểm số sinh viên, được thiết kế dành cho giảng viên chủ nhiệm tại Đại học Công nghiệp TP. Hồ Chí Minh (IUH).

### Mục tiêu:
- 📊 **Trực quan hóa điểm số** qua Metabase dashboard
- 📚 **Quản lý lớp học** và danh sách sinh viên
- 📈 **Phân tích xu hướng** học tập của sinh viên
- 📝 **Tạo báo cáo** chi tiết về kết quả học tập

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶│    Database     │
│  React + Vite   │     │     Django      │     │    Supabase     │
│   Port: 5173    │     │   Port: 8000    │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │    Metabase     │
                        │  Visualization  │
                        │   Port: 3000    │
                        └─────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + Vite 7 + TailwindCSS 4 |
| **Backend** | Django 5.0 + Django REST Framework |
| **Authentication** | JWT (Simple JWT) |
| **Database** | PostgreSQL (Supabase) |
| **Visualization** | Metabase (Embedded Dashboard) |
| **Container** | Docker + Docker Compose |

---

## 📂 Cấu trúc dự án

```
Vis4Teacher/
├── docker-compose.yml        # Docker orchestration
├── README.md
│
├── vis-core-fe/              # 🎨 React Frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/       # UI Components
│       │   ├── LeftSidebar.jsx
│       │   ├── navBar.jsx
│       │   ├── AddClass.jsx
│       │   ├── UpdateClass.jsx
│       │   ├── DeleteClass.jsx
│       │   ├── StudentDashboard.jsx
│       │   ├── TeacherProfile.jsx
│       │   ├── AboutUs.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Homepage.jsx
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── services/
│           └── api.js
│
└── Vis4T_be/                 # 🐍 Django Backend
    ├── Dockerfile
    ├── requirements.txt
    ├── manage.py
    ├── Vis4T_be/             # Django Settings
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    └── Vis4T_core/           # Main App
        ├── models.py         # User, Teacher, Class, Student
        ├── views.py          # API Views + Metabase
        ├── serializers.py
        ├── urls.py
        └── utils.py          # DataProcessor
```

---

## ✨ Tính năng

### 🔐 Authentication
- [x] Đăng ký / Đăng nhập với JWT
- [x] Token refresh tự động
- [x] Protected routes
- [x] Logout với token blacklist

### 📚 Quản lý Lớp học
- [x] CRUD lớp học
- [x] Gán giảng viên chủ nhiệm
- [x] Upload file điểm (Excel/CSV)
- [x] Thống kê số sinh viên

### 👥 Quản lý Sinh viên
- [x] Danh sách sinh viên theo lớp
- [x] Tìm kiếm sinh viên (MSSV/Tên)
- [x] Xem chi tiết điểm số

### 📊 Dashboard & Visualization
- [x] Embed Metabase dashboard
- [x] Dashboard theo lớp
- [x] Dashboard theo sinh viên
- [x] Biểu đồ phân bố điểm

### 👤 Profile Giảng viên
- [x] Xem/Cập nhật thông tin cá nhân
- [x] Avatar tự động từ tên

---

## 🛠️ Cài đặt

### Yêu cầu
- Docker & Docker Compose
- Node.js 20+ (nếu chạy không dùng Docker)
- Python 3.11+ (nếu chạy không dùng Docker)

### 🐳 Chạy với Docker (Khuyến nghị)

```bash
# Clone repository
git clone https://github.com/your-repo/Vis4Teacher.git
cd Vis4Teacher

# Copy file cấu hình
cp Vis4T_be/.env.example Vis4T_be/.env
cp vis-core-fe/.env.example vis-core-fe/.env

# Cập nhật .env với thông tin database và Metabase secret key

# Chạy Metabase riêng (chạy trên host, không trong docker-compose)
docker run -d -p 3000:3000 --name metabase metabase/metabase

# Cập nhật Vis4T_be/.env:
# METABASE_URL=http://host.docker.internal:3000  (cho Docker container truy cập host)

# Build và chạy Frontend + Backend
docker-compose up --build

# Truy cập:
# - Frontend: http://localhost:5173
# - Backend:  http://localhost:8000
# - Metabase: http://localhost:3000
```

> **Lưu ý**: Metabase chạy riêng trên host để giữ nguyên dashboard và cấu hình đã setup. 
> Backend trong Docker sử dụng `host.docker.internal:3000` để truy cập Metabase.

### 💻 Chạy thủ công (Development)

#### Backend
```bash
cd Vis4T_be

# Tạo virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Cài đặt dependencies
pip install -r requirements.txt

# Migrate database
python manage.py migrate

# Chạy server
python manage.py runserver
```

#### Frontend
```bash
cd vis-core-fe

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

#### Metabase
```bash
# Chạy Metabase bằng Docker
docker run -d -p 3000:3000 --name metabase metabase/metabase

# Truy cập http://localhost:3000 để setup:
# 1. Tạo tài khoản admin
# 2. Connect tới PostgreSQL (Supabase)
# 3. Tạo dashboard
# 4. Vào Admin > Embedding > Enable > Copy Secret Key
# 5. Cập nhật METABASE_SECRET_KEY trong .env backend
```

---

## ⚙️ Cấu hình

### Backend (.env)

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Supabase)
database=your_database_name
user=your_database_user
password=your_database_password
host=your_database_host
port=5432

# Metabase
METABASE_URL=http://localhost:3000
METABASE_SECRET_KEY=your_metabase_secret_key
METABASE_DASHBOARD_ID=2
METABASE_STUDENT_DASHBOARD_ID=3
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

---

## 📖 API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Đăng ký tài khoản |
| POST | `/api/auth/login/` | Đăng nhập |
| POST | `/api/auth/logout/` | Đăng xuất |
| POST | `/api/auth/refresh/` | Refresh token |
| GET | `/api/user/profile/` | Lấy thông tin user |

### Class Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes/` | Danh sách lớp |
| POST | `/api/classes/` | Tạo lớp mới |
| GET | `/api/classes/{class_name}/` | Chi tiết lớp |
| PUT | `/api/classes/{class_name}/` | Cập nhật lớp |
| DELETE | `/api/classes/{class_name}/` | Xóa lớp |
| GET | `/api/classes/{class_name}/students/` | Sinh viên trong lớp |
| POST | `/api/classes/{class_name}/upload-students/` | Upload file sinh viên |
| GET | `/api/classes/{class_name}/dashboard/` | Dashboard URL |

### Student

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/{student_id}/dashboard/` | Student dashboard URL |

---

## 🔒 Bảo mật

- Không commit file `.env` lên GitHub
- Sử dụng JWT với token expiration
- CORS được cấu hình cho các origin cụ thể
- Password được hash với Django's PBKDF2

---

## 👨‍💻 Đội ngũ phát triển

Dự án được phát triển bởi sinh viên khoa **Khoa học Dữ liệu**, Đại học Công nghiệp TP.HCM.

| Thành viên | Vai trò |
|------------|---------|
| Developer 1 | Frontend + UI/UX |
| Developer 2 | Backend + API |
| Developer 3 | Database + Metabase |

---

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<p align="center">
  <sub>© 2026 Vis4Teacher - Đại học Công nghiệp TP.HCM</sub>
</p>


# Vis4Teacher - Visualization for Teacher

Hệ thống trực quan hóa điểm số sinh viên thông minh dành cho giảng viên.

## 🏗️ Kiến trúc hệ thống

- **Frontend**: React.js + Vite + TailwindCSS
- **Backend**: Django + Django REST Framework + JWT Authentication
- **Database**: SQLite (development)

## 📂 Cấu trúc dự án

```
Vis4Teacher/
├── vis-core-fe/          # React Frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Pages
│   │   ├── context/      # React Context
│   │   ├── services/     # API Services
│   │   └── routes/       # Routing
│   └── package.json
└── Vis4T_be/            # Django Backend
    ├── Vis4T_core/      # Main App
    │   ├── models.py    # User & Teacher models
    │   ├── views.py     # API Views
    │   ├── serializers.py
    │   └── urls.py
    └── manage.py
```

## 🚀 Các tính năng đã hoàn thành

### Authentication & User Management
- ✅ Đăng ký tài khoản giảng viên
- ✅ Đăng nhập/đăng xuất với JWT
- ✅ Custom User model với profile mở rộng
- ✅ Auto token refresh

### Frontend Components
- ✅ Responsive navigation bar
- ✅ Left sidebar menu
- ✅ Login/Register pages
- ✅ Homepage với dashboard layout
- ✅ AuthContext cho state management

### Backend APIs
- ✅ User registration/login endpoints
- ✅ JWT authentication setup
- ✅ CORS configuration
- ✅ Custom User model with full_name, phone
- ✅ Teacher profile model

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

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Đăng ký tài khoản |
| POST | `/api/auth/login/` | Đăng nhập |
| POST | `/api/auth/logout/` | Đăng xuất |
| POST | `/api/auth/refresh/` | Refresh token |
| GET/PUT | `/api/user/profile/` | User profile |
| GET | `/api/health/` | Health check |

## 📋 Kế hoạch phát triển

### Phase 2 (Upcoming)
- [ ] Class management system
- [ ] Student grade visualization
- [ ] Chart components (Chart.js/D3.js)
- [ ] Export/import grade data
- [ ] Advanced analytics dashboard

### Phase 3 (Future)
- [ ] Real-time notifications
- [ ] Multi-semester support
- [ ] Advanced reporting
- [ ] Mobile responsive optimization

## 🎯 Mục tiêu dự án

Tạo một hệ thống giúp giảng viên:
1. **Quản lý lớp học** và danh sách sinh viên
2. **Trực quan hóa điểm số** qua charts và graphs
3. **Phân tích xu hướng** học tập của sinh viên
4. **Tạo báo cáo** chi tiết về kết quả học tập

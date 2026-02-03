import React from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Vis4Teacher Dashboard
            </h1>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chào mừng, {user?.full_name || user?.username}!
          </h2>
          <p className="text-gray-600 mb-6">
            Đây là trang chủ của hệ thống Vis4Teacher. Bạn đã đăng nhập thành công.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-emerald-800 mb-2">Quản lý lớp học</h3>
              <p className="text-emerald-600">Tạo và quản lý các lớp học của bạn</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Trực quan hóa điểm</h3>
              <p className="text-blue-600">Xem biểu đồ và phân tích điểm số sinh viên</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 mb-2">Báo cáo</h3>
              <p className="text-purple-600">Tạo và xuất báo cáo kết quả học tập</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
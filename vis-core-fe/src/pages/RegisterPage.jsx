import React, { useState } from 'react'
import { UserPlus, User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import logoIUH from "../assets/logo-iuh.jpg"
import logoVis from "../assets/logo-vis.jpg"

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    password: '',
    password_confirm: ''
  })

  const { register, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.password_confirm) {
      return
    }

    try {
      await register(formData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT SIDE - Welcome Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 to-teal-100 p-12">
        <div className="flex items-center gap-8 mb-12 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white p-3 rounded-lg shadow-lg">
                <img 
                  src={logoIUH} 
                  alt="IUH Logo" 
                  className="h-16 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
            </div>
            <div className="bg-white p-3 rounded-lg shadow-lg">
                <img 
                  src={logoVis} 
                  alt="Vis Logo" 
                  className="h-14 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
            </div>
        </div>

        <div className="text-center space-y-4 max-w-lg">
            <h1 className="text-5xl font-bold text-emerald-700 mb-6">
                Tham Gia Vis4Teacher
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
                Tạo tài khoản để trải nghiệm hệ thống trực quan hóa điểm số 
                thông minh dành cho giảng viên.
            </p>
        </div>
      </div>

      {/* RIGHT SIDE - Register Form */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          
            {/* Header */}
            <div className="text-center">
                <div className="bg-emerald-100 p-4 rounded-full mb-4 mx-auto w-fit">
                    <UserPlus className="text-emerald-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h2>
                <p className="text-gray-600">Tạo tài khoản mới</p>
            </div>

          {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Lỗi đăng ký</h3>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                )}
                
                {/* Username Input */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                    text-black font-medium placeholder-gray-400 transition-colors"
                            placeholder="Nhập tên đăng nhập"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                    text-black font-medium placeholder-gray-400 transition-colors"
                            placeholder="Nhập địa chỉ email"
                        />
                    </div>
                </div>

                {/* Full Name Input */}
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                    </label>
                    <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-white
                                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                text-black font-medium placeholder-gray-400 transition-colors"
                        placeholder="Nhập họ và tên"
                    />
                </div>

                {/* Phone Input */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                    text-black font-medium placeholder-gray-400 transition-colors"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                    text-black font-medium placeholder-gray-400 transition-colors"
                            placeholder="Nhập mật khẩu"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff size={20} className="text-gray-600" />
                            ) : (
                                <Eye size={20} className="text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                    <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password_confirm"
                            name="password_confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={formData.password_confirm}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                    text-black font-medium placeholder-gray-400 transition-colors"
                            placeholder="Nhập lại mật khẩu"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={20} className="text-gray-600" />
                            ) : (
                                <Eye size={20} className="text-gray-600" />
                            )}
                        </button>
                    </div>
                    {formData.password_confirm && formData.password !== formData.password_confirm && (
                        <p className="text-red-600 text-sm mt-1">Mật khẩu xác nhận không khớp</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !formData.username || !formData.email || !formData.password || formData.password !== formData.password_confirm}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                            text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                            transform hover:scale-[1.02] active:scale-[0.98]"
                >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang tạo tài khoản...
                    </div>
                ) : (
                    'Đăng ký'
                )}
                </button>
            </form>

            {/* Login Link */}
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>

            {/* Footer */}
            <div className="text-center">
                <p className="text-xs text-gray-400">
                    © 2026 VisForTeacher. Phát triển bởi Đại học Công nghiệp TP.HCM
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
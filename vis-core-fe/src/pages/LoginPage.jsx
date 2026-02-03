import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react"
import logoIUH from "../assets/logo-iuh.jpg"
import logoVis from "../assets/logo-vis.jpg"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, useLocation, Link } from "react-router-dom"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  })
  
  const { login, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get return URL from location state
  const from = location.state?.from?.pathname || '/dashboard'

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      return
    }

    try {
      await login({
        username: formData.username,
        password: formData.password
      })
      
      // Navigate to return URL or home page
      navigate(from, { replace: true })
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT SIDE - Welcome Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 to-teal-100 p-12">
        <div className="flex items-center gap-8 mb-12 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white p-3 rounded-lg shadow-lg">
                <img src={logoIUH} alt="IUH Logo" className="h-16 w-auto" />
            </div>
            <div className="bg-white p-3 rounded-lg shadow-lg">
                <img src={logoVis} alt="Vis Logo" className="h-14 w-auto" />
            </div>
        </div>

        <div className="text-center space-y-4 max-w-lg">
            <h1 className="text-5xl font-bold text-emerald-700 mb-6">
                Vis For Teacher
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
                Hệ thống trực quan hóa điểm số sinh viên thông minh, 
                giúp giảng viên quản lý và phân tích kết quả học tập một cách hiệu quả.
            </p>
            <div className="flex justify-center space-x-4 mt-8">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          
            {/* Header */}
            <div className="text-center">
                <div className="bg-emerald-100 p-4 rounded-full mb-4 mx-auto w-fit">
                    <Lock className="text-emerald-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                <p className="text-gray-600">Chào mừng quay trở lại!</p>
            </div>

          {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Lỗi đăng nhập</h3>
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
                        className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none group"
                    >
                        <div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                            {showPassword ? (
                                <EyeOff size={20} className="text-gray-600 group-hover:text-gray-800" />
                            ) : (
                                <Eye size={20} className="text-gray-600 group-hover:text-gray-800" />
                            )}
                        </div>
                    </button>
                </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            name="remember"
                            type="checkbox"
                            checked={formData.remember}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 block text-sm text-gray-900">
                            Ghi nhớ đăng nhập
                        </span>
                    </label>
                    <div className="text-sm">
                        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                            Quên mật khẩu?
                        </a>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !formData.username || !formData.password}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                            text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                            transform hover:scale-[1.02] active:scale-[0.98]"
                >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang đăng nhập...
                    </div>
                ) : (
                    'Đăng nhập'
                )}
                </button>
            </form>

            {/* Register Link */}
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                        Đăng ký ngay
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

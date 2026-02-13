import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, getUserData } from '../services/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Check for existing token on mount and validate with backend
  useEffect(() => {
    const validateAuth = async () => {
      const userData = getUserData()
      const hasToken = authAPI.isAuthenticated()
      
      if (hasToken && userData) {
        try {
          // Validate token bằng cách gọi API profile
          const profileData = await authAPI.getProfile()
          // Token hợp lệ, cập nhật user data với thông tin mới nhất từ server
          setUser(profileData)
          setIsAuthenticated(true)
        } catch {
          // Token không hợp lệ hoặc hết hạn, xóa dữ liệu cũ
          console.log('Token validation failed, clearing auth data')
          authAPI.logout()
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      
      setIsInitializing(false) // Finished checking authentication
    }
    
    validateAuth()
  }, [])

  const login = async (credentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(credentials)
      
      if (response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
      }

      return response
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi đăng nhập'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authAPI.register(userData)
      
      // Sau khi đăng ký thành công, có thể tự động login hoặc redirect
      if (response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
      }

      return response
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi đăng ký'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
      // Redirect to login page after logout
      window.location.href = '/login'
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    error,
    login,
    register,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
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

  // Check for existing token on mount
  useEffect(() => {
    const userData = getUserData()
    const isAuth = authAPI.isAuthenticated()
    
    if (isAuth && userData) {
      setUser(userData)
      setIsAuthenticated(true)
    }
    
    setIsInitializing(false) // Finished checking authentication
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
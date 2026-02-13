// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('access_token')
const getRefreshToken = () => localStorage.getItem('refresh_token')

// Helper function to set tokens in localStorage
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
}

// Helper function to remove tokens from localStorage
const removeTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_data')
}

// Helper function to set user data
const setUserData = (userData) => {
  localStorage.setItem('user_data', JSON.stringify(userData))
}

// Helper function to get user data
const getUserData = () => {
  const userData = localStorage.getItem('user_data')
  return userData ? JSON.parse(userData) : null
}

// Generic API request function with auto token refresh
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getToken()
  
  const defaultHeaders = {}
  
  // Only set Content-Type if not multipart/form-data (for file uploads)
  if (!options.body || !(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json'
  }
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }
  
  try {
    let response = await fetch(url, config)
    
    // If token expired, try to refresh
    if (response.status === 401 && token) {
      const refreshed = await refreshAuthToken()
      if (refreshed) {
        // Retry the original request with new token
        config.headers['Authorization'] = `Bearer ${getToken()}`
        response = await fetch(url, config)
      } else {
        // Refresh failed, redirect to login
        removeTokens()
        window.location.href = '/login'
        throw new Error('Authentication failed')
      }
    }
    
    if (!response.ok) {
      let errorData = {}
      let errorMessage = `HTTP error! status: ${response.status}`
      
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json()
        } else {
          // If not JSON (like HTML error page), create a simple error
          errorMessage = `Server error ${response.status}: ${response.statusText}`
        }
      } catch (jsonError) {
        console.error('Failed to parse error response:', jsonError)
        errorMessage = `Server error ${response.status}: ${response.statusText}`
      }
      
      // Chi tiết error message cho debugging
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
        url: url
      })
      
      // Tạo error message từ response
      if (errorData.detail) {
        errorMessage = errorData.detail
      } else if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.non_field_errors) {
        errorMessage = errorData.non_field_errors.join(', ')
      } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
        // Nếu có validation errors từ Django serializer
        const errors = Object.entries(errorData).map(([field, messages]) => {
          const messageArray = Array.isArray(messages) ? messages : [messages]
          return `${field}: ${messageArray.join(', ')}`
        })
        if (errors.length > 0) {
          errorMessage = errors.join('; ')
        }
      }
      
      throw new Error(errorMessage)
    }
    
    // Handle 204 No Content (e.g., DELETE requests)
    if (response.status === 204) {
      return { success: true }
    }
    
    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return { success: true }
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

// Authentication API functions
export const authAPI = {
  // Login user
  async login(credentials) {
    try {
      const response = await apiRequest('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      
      if (response.tokens) {
        setTokens(response.tokens.access, response.tokens.refresh)
        setUserData(response.user)
      }
      
      return response
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  },

  // Register new user
  async register(userData) {
    try {
      // Clean data - chỉ gửi fields cần thiết, loại bỏ password_confirm
      const cleanData = {
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        password: userData.password,
        password_confirm: userData.password_confirm
      }
      
      const response = await apiRequest('/api/auth/register/', {
        method: 'POST',
        body: JSON.stringify(cleanData),
      })
      
      if (response.tokens) {
        setTokens(response.tokens.access, response.tokens.refresh)
        setUserData(response.user)
      }
      
      return response
    } catch (error) {
      console.error('Registration API error:', error)
      throw new Error(error.message || 'Registration failed')
    }
  },

  // Logout user
  async logout() {
    try {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        await apiRequest('/api/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeTokens()
    }
  },

  // Get current user profile
  async getProfile() {
    return await apiRequest('/api/user/profile/')
  },

  // Update user profile
  async updateProfile(profileData) {
    return await apiRequest('/api/user/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!getToken()
  },

  // Get current user data from localStorage
  getCurrentUser() {
    return getUserData()
  },
}

// Refresh token function
async function refreshAuthToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })
    
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('access_token', data.access)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Token refresh failed:', error)
    return false
  }
}

// Export utility functions for direct use
export { getToken, getRefreshToken, getUserData, removeTokens, setUserData }

// Health check
export async function healthCheck() {
  return await apiRequest('/api/health/')
}

// Class API functions
export const classAPI = {
  // Get all classes for current teacher
  async getClasses() {
    return await apiRequest('/api/classes/')
  },

  // Create new class
  async createClass(classData) {
    return await apiRequest('/api/classes/', {
      method: 'POST',
      body: JSON.stringify({
        class_name: classData.class_name,
        number_of_student: parseInt(classData.number_of_student),
        class_major: classData.class_major,
        teacher_note: classData.teacher_note,
        total_credit: parseInt(classData.total_credit),
        total_semester: parseInt(classData.total_semester)
      }),
    })
  },

  // Get class details
  async getClassDetail(classId) {
    return await apiRequest(`/api/classes/${classId}/`)
  },

  // Update class
  async updateClass(classId, classData) {
    return await apiRequest(`/api/classes/${classId}/`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    })
  },

  // Delete class
  async deleteClass(classId) {
    return await apiRequest(`/api/classes/${classId}/`, {
      method: 'DELETE',
    })
  },

  // Get students in a class
  async getClassStudents(classId) {
    return await apiRequest(`/api/classes/${classId}/students/`)
  },

  // Upload students from Excel file
  async uploadStudents(className, file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('class_name', className)
    
    return await apiRequest(`/api/classes/${className}/upload-students/`, {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type to let browser set it for multipart/form-data
    })
  },

  // Get Metabase dashboard URL for a class
  async getClassDashboard(classId) {
    return await apiRequest(`/api/classes/${classId}/dashboard/`)
  },

  // Get Metabase dashboard URL for a student
  async getStudentDashboard(studentId) {
    return await apiRequest(`/api/students/${studentId}/dashboard/`)
  },

  // Search students across all classes (for teacher)
  async searchStudents(query) {
    // Lấy tất cả classes của teacher
    const classes = await this.getClasses()
    
    // Lấy students từ tất cả classes
    const studentsPromises = classes.map(cls => 
      this.getClassStudents(cls.class_name).catch(() => [])
    )
    const studentsArrays = await Promise.all(studentsPromises)
    
    // Flatten và thêm thông tin class
    const allStudents = studentsArrays.flatMap((students, index) => 
      (students || []).map(student => ({
        ...student,
        class_name: classes[index].class_name
      }))
    )
    
    // Filter theo query (tìm theo ID hoặc tên)
    const queryLower = query.toLowerCase().trim()
    return allStudents.filter(student => 
      student.student_id?.toLowerCase().includes(queryLower) ||
      student.student_name?.toLowerCase().includes(queryLower)
    ).slice(0, 10) // Giới hạn 10 kết quả
  }
}
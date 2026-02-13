import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import logo_iuh from "../assets/logo-iuh.jpg"
import { classAPI } from "../services/api"

export default function Navbar({ userName }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Debounce search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await classAPI.searchStudents(searchQuery)
        setSearchResults(results)
        setShowDropdown(true)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300) // Debounce 300ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStudentClick = (student) => {
    setShowDropdown(false)
    setSearchQuery('')
    navigate(`/student/${student.student_id}`)
  }

  return (
    <nav className="w-full h-16 bg-white border-b shadow-sm px-6 flex items-center">
      
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo_iuh}
          alt="IUH Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* CENTER: Search */}
      <div className="flex-1 max-w-md mx-6 relative" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
          ) : (
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          placeholder="Tìm kiếm sinh viên theo MSSV hoặc tên..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                  text-black font-medium placeholder-gray-400"  
        />

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((student) => (
                <button
                  key={student.student_id}
                  onClick={() => handleStudentClick(student)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold flex-shrink-0">
                    {student.student_name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {student.student_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      MSSV: {student.student_id} - Lớp: {student.class_name}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">Không tìm thấy sinh viên.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: User */}
      <div className="flex items-center gap-1">
        <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="text-gray-700 text-sm">
          Xin chào, <span className="font-medium">{userName || 'User'}</span>
        </span>
      </div>

    </nav>
  )
}

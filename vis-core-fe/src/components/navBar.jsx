import logo_iuh from "../assets/logo-iuh.jpg"

export default function Navbar({ userName }) {
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
      <div className="flex-1 max-w-md mx-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                  text-black font-medium placeholder-gray-400"  
        />
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

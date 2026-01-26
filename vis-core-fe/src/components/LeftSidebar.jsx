import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LeftSidebar({ activeItem, setActiveItem }) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa thông tin xác thực từ localStorage/sessionStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userInfo');
        
        // Điều hướng về trang login
        navigate('/login');
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        handleLogout();
    };

    const menuItems = [
    {
        id: 'classes',
        label: 'Các lớp chủ nhiệm',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
    {
        id: 'updateClass',
        label: 'Cập nhật lớp',
        icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
            />
        </svg>
        )
    },
    {
        id: 'addClass',
        label: 'Thêm lớp mới',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        )
    },
    {
        id: 'profile',
        label: 'Thông tin GV',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )
    },
    {
        id: 'about',
        label: 'Về chúng tôi',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: 'logout',
        label: 'Đăng xuất',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        )
    }
    ];

    const handleItemClick = (itemId) => {
        if (itemId === 'logout') {
        setShowLogoutModal(true);
        } else {
        setActiveItem(itemId);
        }
    };

    return (
    <>
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Menu chính</h2>
            
            <nav className="space-y-2">
                {menuItems.map((item) => (
                <div key={item.id}>
                    <button
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        activeItem === item.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                    >
                        <span className={activeItem === item.id ? 'text-blue-700' : 'text-gray-400'}>
                        {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                    </button>

                </div>
                ))}
          </nav>
        </div>
    </div>

      {/* Modal xác nhận đăng xuất */}
    {showLogoutModal && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận đăng xuất</h3>
                <p className="text-sm text-gray-600">Bạn có chắc chắn muốn đăng xuất?</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
                <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                    Hủy
                </button>
                <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                    Đăng xuất
                </button>
            </div>
          </div>
        </div>
    )}
    </>
  );
}
export default function TeacherProfile() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Thông tin giảng viên</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và CV giảng viên</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                NT
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nguyễn Hữu Tình</h3>
                <p className="text-gray-600 mb-4">Giảng viên chủ nhiệm</p>
                <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><span className="font-medium">Email:</span> tinh.nh@iuh.edu.vn</p>
                    <p className="text-gray-600"><span className="font-medium">SĐT:</span> 0123 456 789</p>
                    <p className="text-gray-600"><span className="font-medium">Khoa:</span> Khoa Học Dữ Liệu</p>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Chỉnh sửa ảnh
                </button>
            </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input
                        type="text"
                        defaultValue="Nguyễn Văn Nam"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảng viên</label>
                    <input
                        type="text"
                        defaultValue="GV001"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md bg-gray-50"
                        disabled
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                        type="email"
                        defaultValue="nam@iuh.edu.vn"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                        type="tel"
                        defaultValue="0123 456 789"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khoa</label>
                  <select className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="khdl" selected>Khoa Học Dữ Liệu</option>
                    <option value="cntt">Công Nghệ Thông Tin</option>
                    <option value="kt">Kinh Tế</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                  <input
                    type="text"
                    defaultValue="Giảng viên chủ nhiệm"
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin học vấn</h4>
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bằng cấp cao nhất</label>
                    <input
                        type="text"
                        defaultValue="Tiến sĩ Khoa học máy tính"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                    <input
                        type="text"
                        defaultValue="Khoa học dữ liệu và trí tuệ nhân tạo"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm giảng dạy</label>
                    <input
                        type="text"
                        defaultValue="10 năm"
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Lưu thay đổi
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
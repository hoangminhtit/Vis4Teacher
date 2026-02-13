export default function AboutUs() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Về chúng tôi</h1>
        </div>
      </div>

      <div className="space-y-8">
        {/* System Info */}
        <div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                    Vis4Teacher là hệ thống quản lý lớp học hiện đại, được thiết kế đặc biệt cho các giảng viên 
                    chủ nhiệm tại Đại học Công nghiệp TP. Hồ Chí Minh (IUH). Hệ thống giúp quản lý thông tin 
                    lớp học, sinh viên và các hoạt động giảng dạy một cách hiệu quả.
                </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
                    📚
                    </div>
                    <h4 className="font-semibold text-gray-800">Quản lý lớp học</h4>
                    <p className="text-sm text-gray-500 mt-1">Dễ dàng quản lý thông tin các lớp chủ nhiệm</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
                    📊
                    </div>
                    <h4 className="font-semibold text-gray-800">Theo dõi tiến độ</h4>
                    <p className="text-sm text-gray-500 mt-1">Xem báo cáo và thống kê chi tiết</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">
                    👥
                    </div>
                    <h4 className="font-semibold text-gray-800">Kết nối</h4>
                    <p className="text-sm text-gray-500 mt-1">Tương tác hiệu quả với sinh viên</p>
                </div>
            </div>
          </div>
        </div>

        {/* University Info */}
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Đại học Công nghiệp TP.HCM</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Thông tin liên hệ</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Địa chỉ:</span> 12 Nguyễn Văn Bảo, P.4, Q.Gò Vấp, TP.HCM</p>
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Điện thoại:</span> (028) 3894 0390</p>
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Email:</span> info@iuh.edu.vn</p>
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Website:</span> www.iuh.edu.vn</p>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Về IUH</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                    Đại học Công nghiệp TP.HCM là một trong những trường đại học hàng đầu tại Việt Nam 
                    trong lĩnh vực đào tạo kỹ thuật và công nghệ. Trường cam kết mang lại chất lượng 
                    giáo dục cao và môi trường học tập hiện đại cho sinh viên.
                    </p>
                </div>
            </div>
        </div>

        {/* Development Team */}
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Đội ngũ phát triển</h3>
            <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                Hệ thống được phát triển bởi đội ngũ sinh viên và giảng viên khoa Khoa học Dữ liệu, 
                Đại học Công nghiệp TP.HCM với mục tiêu nâng cao hiệu quả quản lý giáo dục.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-medium text-gray-700">Phiên bản:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">v1.0.0</span>
                <span className="font-medium text-gray-700">Cập nhật:</span>
                <span className="text-gray-600">Tháng 2, 2026</span>
                </div>
            </div>
        </div>

        {/* Support */}
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Hỗ trợ kỹ thuật</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                Nếu bạn gặp vấn đề hoặc cần hỗ trợ kỹ thuật, vui lòng liên hệ:
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600"><span className="font-medium text-gray-700">Email hỗ trợ:</span> support.vis4teacher@iuh.edu.vn</p>
                  <p className="text-gray-600"><span className="font-medium text-gray-700">Hotline:</span> (028) 3894 0391</p>
                  <p className="text-gray-600"><span className="font-medium text-gray-700">Thời gian:</span> Thứ 2 - Thứ 6, 8:00 - 17:00</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
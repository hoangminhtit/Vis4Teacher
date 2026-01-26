export default function ClassManagement() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            </div>
            <div>
            <h1 className="text-2xl font-bold text-gray-800">Các lớp chủ nhiệm</h1>
            <p className="text-gray-600">Quản lý danh sách các lớp bạn đang chủ nhiệm</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Class Card Example */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-800">KHDL15A</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Đang học</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Chuyên ngành:</span> Khoa học Dữ liệu</p>
                <p><span className="font-medium">Sĩ số:</span> 60 sinh viên</p>
            </div>
            <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors">
                Xem chi tiết
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Sửa
                </button>
            </div>
            </div>

        {/* Add more class cards */}
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-800">KHDL15B</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Đang học</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Chuyên ngành:</span> Khoa học Dữ liệu</p>
                <p><span className="font-medium">Sĩ số:</span> 55 sinh viên</p>
            </div>
            <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors">
                Xem chi tiết
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Sửa
                </button>
            </div>
        </div>

        {/* Add new class button */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">Thêm lớp mới</span>
        </div>
      </div>
    </div>
  );
}
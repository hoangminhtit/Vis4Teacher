export default function AddClass() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thêm lớp mới</h1>
          <p className="text-gray-600">Tạo lớp học mới trong hệ thống</p>
        </div>
      </div>

      <form className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mã lớp */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã lớp <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: KHDL15A"
                />
            </div>

            {/* Tên lớp */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên lớp <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Khoa học Dữ liệu 15A"
                />
            </div>

            {/* Khoa */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoa <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Chọn khoa</option>
                    <option value="information_technology">Công Nghệ Thông Tin</option>
                    <option value="economics">Kinh Tế</option>
                </select>
            </div>

            {/* Sĩ số tối đa */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Sĩ số tối đa <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 60"
                    min="1"
                />
            </div>

            {/* Năm học */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Năm học <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Chọn năm học</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2026-2027">2026-2027</option>
                </select>
            </div>
        </div>

        {/* Ghi chú */}
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
            </label>
            <textarea
                rows="4"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập ghi chú về lớp học..."
            ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Tạo lớp mới
            </button>
            <button
                type="button"
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Hủy bỏ
            </button>
        </div>
      </form>
    </div>
  );
}
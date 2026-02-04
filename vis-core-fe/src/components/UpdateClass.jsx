export default function UpdateClass() {
  const classes = [
    { id: 'KHDL15A', name: 'Khoa học Dữ liệu 15A', faculty: 'Khoa Học Dữ Liệu', students: 60, status: 'Đang học' },
    { id: 'DHKHMT18B', name: 'Khoa học máy tính 18B', faculty: 'Công Nghệ Thông Tin', students: 55, status: 'Đang học' },
    { id: 'DHKTPM19A', name: 'Kỹ thuật phần mềm 19A', faculty: 'Công Nghệ Thông Tin', students: 48, status: 'Đang học' },
    { id: 'DHCNTT20B', name: 'Công nghệ thông tin 20B', faculty: 'Công Nghệ Thông Tin', students: 52, status: 'Đang học' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            </div>
            <div>
            <h1 className="text-2xl font-bold text-gray-800">Cập nhật lớp</h1>
            <p className="text-gray-600">Chỉnh sửa thông tin các lớp học hiện tại</p>
            </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Tìm kiếm lớp..."
                    className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <select className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Tất cả khoa</option>
                <option>Khoa Học Dữ Liệu</option>
                <option>Công Nghệ Thông Tin</option>
                <option>Kinh Tế</option>
            </select>
        </div>

        {/* Classes Table */}
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left text-center text-sm font-medium text-gray-700">Mã lớp</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-center text-sm font-medium text-gray-700">Tên lớp</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-center text-sm font-medium text-gray-700">Chuyên ngành</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-center text-sm font-medium text-gray-700">Sĩ số</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-center text-sm font-medium text-gray-700">Trạng thái</th>
                <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-sm text-center text-gray-700">{cls.id}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-center font-medium text-gray-700">{cls.name}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-center text-gray-700">{cls.faculty}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-center text-gray-700">{cls.students}</td>
                        <td className="border border-gray-200 px-4 py-3">
                            <span className="bg-green-100 text-green-800 text-xs text-center px-2 py-1 rounded-full">{cls.status}</span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                                Sửa
                            </button>
                            <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                                Xóa
                            </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </div>
  );
}
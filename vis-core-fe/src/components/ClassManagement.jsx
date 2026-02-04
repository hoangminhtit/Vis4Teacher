import { useState, useEffect } from 'react';
import { classAPI } from '../services/api';

export default function ClassManagement({ onClassSelect }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await classAPI.getClasses();
            setClasses(response);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setError('Không thể tải danh sách lớp học');
            // Fallback to mock data if API fails
            setClasses([
                { id: 1, class_code: 'DHKHDL17A', class_name: 'Khoa học dữ liệu 17A', faculty: 'Khoa học Dữ liệu', current_students: 60, max_students: 65, status_display: 'Đang học' },
                { id: 2, class_code: 'DHKHMT18B', class_name: 'Khoa học máy tính 18B', faculty: 'Công nghệ thông tin', current_students: 55, max_students: 60, status_display: 'Đang học' },
                { id: 3, class_code: 'DHKTPM19A', class_name: 'Kỹ thuật phần mềm 19A', faculty: 'Công nghệ thông tin', current_students: 48, max_students: 55, status_display: 'Đang học' },
                { id: 4, class_code: 'DHCNTT20B', class_name: 'Công nghệ thông tin 20B', faculty: 'Công nghệ thông tin', current_students: 52, max_students: 60, status_display: 'Đang học' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = (classItem) => {
        if (onClassSelect) {
            onClassSelect(classItem);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Đang tải danh sách lớp học...</span>
                </div>
            </div>
        );
    }

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
            {error && (
                <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={fetchClasses}
                        className="mt-2 text-red-600 hover:text-red-800 underline"
                    >
                        Thử lại
                    </button>
                </div>
            )}
            
            {/* Render all classes */}
            {classes.map((cls, index) => (
                <div key={cls.class_name || `class-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => handleClassClick(cls)}>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-gray-800">{cls.class_name}</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {cls.status_display || cls.status || 'Đang học'}
                        </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Chuyên ngành:</span> {cls.class_major}</p>
                        <p><span className="font-medium">Số sinh viên:</span> {cls.number_of_student || 0} sinh viên</p>
                        <p><span className="font-medium">Tổng tín chỉ:</span> {cls.total_credit || 'N/A'}</p>
                        <p><span className="font-medium">Số học kỳ:</span> {cls.total_semester || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button 
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClassClick(cls);
                            }}
                        >
                            Xem chi tiết
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            Sửa
                        </button>
                    </div>
                </div>
            ))}

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
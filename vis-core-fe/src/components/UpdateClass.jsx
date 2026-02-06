import { useState, useEffect } from 'react';
import { classAPI } from '../services/api';
import UploadStudents from './UploadStudents';

export default function UpdateClass() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
        { class_name: 'KHDL16A', class_major: 'Khoa học Dữ liệu', total_credit: 120, total_semester: 8 },
        { class_name: 'KHMT15BIT', class_major: 'Khoa Học Máy Tính', total_credit: 130, total_semester: 9 },
        { class_name: 'KTPM19A', class_major: 'Kỹ thuật phần mềm', total_credit: 125, total_semester: 8 },
        { class_name: 'CNTT20B', class_major: 'Công nghệ thông tin', total_credit: 120, total_semester: 8 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = classes.filter(classItem =>
        classItem.class_name.toLowerCase().includes(value.toLowerCase()) ||
        classItem.class_major.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setSearchTerm(classItem.class_name);
    setShowSuggestions(false);
  };

  const handleUploadSuccess = () => {
    // Refresh or show success message
    alert('Upload thành công! Điểm số đã được cập nhật.');
    // Could also refresh class list or student data here
  };

  const handleBackToSearch = () => {
    setSelectedClass(null);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <span className="ml-2 text-gray-600">Đang tải danh sách lớp...</span>
        </div>
      </div>
    );
  }

  // If a class is selected, show upload interface
  if (selectedClass) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBackToSearch}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cập nhật điểm số</h1>
            <p className="text-gray-600">Upload file điểm cho lớp: <span className="font-medium text-orange-600">{selectedClass.class_name}</span></p>
          </div>
        </div>

        {/* Class info */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-orange-800 mb-2">Thông tin lớp học</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Mã lớp:</span>
              <p className="font-medium">{selectedClass.class_name}</p>
            </div>
            <div>
              <span className="text-gray-600">Chuyên ngành:</span>
              <p className="font-medium">{selectedClass.class_major}</p>
            </div>
            <div>
              <span className="text-gray-600">Tổng tín chỉ:</span>
              <p className="font-medium">{selectedClass.total_credit}</p>
            </div>
            <div>
              <span className="text-gray-600">Số học kì:</span>
              <p className="font-medium">{selectedClass.total_semester}</p>
            </div>
          </div>
        </div>

        {/* Upload Interface */}
        <UploadStudents 
          className={selectedClass.class_name} 
          onUploadSuccess={handleUploadSuccess} 
        />
      </div>
    );
  }

  // Show class list for selection
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
          <h1 className="text-2xl font-bold text-gray-800">Cập nhật lớp học</h1>
          <p className="text-gray-600">Chọn lớp để upload file điểm số</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem.class_name}
            onClick={() => handleClassSelect(classItem)}
            className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
          >
            {/* Upload Icon Background */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <div className="pr-12">
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                {classItem.class_name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{classItem.class_major}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {classItem.total_credit} tín chỉ
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {classItem.total_semester} học kì
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-orange-600 text-sm font-medium">
                    📁 Click để upload điểm
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-pink-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {classes.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lớp học</h3>
          <p className="text-gray-500">Bạn chưa có lớp học nào để cập nhật.</p>
        </div>
      )}
    </div>
  );
}
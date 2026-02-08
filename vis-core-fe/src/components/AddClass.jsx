import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classAPI } from '../services/api';

export default function AddClass({ onClassAdded }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    class_name: '',
    class_major: '',
    total_credit: '',
    total_semester: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error and success when user types
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Kiểm tra dữ liệu bắt buộc
      if (!formData.class_name || !formData.class_major || !formData.total_credit || !formData.total_semester) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
        setIsSubmitting(false);
        return;
      }

      // Kiểm tra authentication trước khi gọi API
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/login'), 2000);
        setIsSubmitting(false);
        return;
      }

      // Gọi API để tạo lớp mới
      const newClass = await classAPI.createClass({
        ...formData,
        number_of_student: 50 // Default value
      });

      setSuccess('Tạo lớp mới thành công! Đang chuyển đến lớp...');

      // Thêm lớp mới vào sidebar (safely)
      try {
        if (window.addNewClassToSidebar) {
          window.addNewClassToSidebar(formData.class_name);
        }
      } catch (sidebarError) {
        console.warn('Failed to update sidebar:', sidebarError);
      }

      // Gọi callback nếu có (safely)
      try {
        if (onClassAdded) {
          onClassAdded(newClass);
        }
      } catch (callbackError) {
        console.warn('Callback error:', callbackError);
      }

      // Reset form
      setFormData({
        class_name: '',
        class_major: '',
        total_credit: '',
        total_semester: ''
      });
      
      // Auto redirect to class management after 2 seconds
      setTimeout(() => {
        navigate(`/home/${newClass.class_name}`);
      }, 2000);
      } catch (error) {
        console.error('Error creating class:', error);
        if (error.message.includes('401')) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.message.includes('500')) {
          setError('Lỗi server. Vui lòng kiểm tra kết nối backend và thử lại.');
        } else {
          setError(error.message || 'Có lỗi xảy ra khi tạo lớp mới!');
        }
      } finally {
        setIsSubmitting(false);
      }
  };

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

      <form className="max-w-2xl" onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
                        <div className="mt-2 text-sm text-red-700">{error}</div>
                        {error.includes('backend') && (
                            <div className="mt-2 text-sm text-red-600">
                                💡 Kiểm tra xem Django server đã được khởi động chưa (python manage.py runserver)
                            </div>
                        )}
                        {error.includes('đăng nhập') && (
                            <div className="mt-2">
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="text-sm text-red-700 underline hover:text-red-800"
                                >
                                    Đăng nhập lại
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        
        {/* Success Message */}
        {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                        <p className="text-green-800 font-medium">{success}</p>
                        {success.includes('Đang chuyển') && (
                            <div className="mt-2 flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                <span className="text-green-600 text-sm">Đang chuyển hướng...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên lớp */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên lớp <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                name="class_name"
                value={formData.class_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: DHKHDL17A"
                required
                />
            </div>

            {/* Số sinh viên */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Số sinh viên <span className="text-red-500">*</span>
                </label>
                <input
                type="number"
                name="number_of_student"
                value={formData.number_of_student}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 60"
                min="1"
                required
                />
            </div>

            {/* Chuyên ngành */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên ngành <span className="text-red-500">*</span>
                </label>
                <select 
                    name="class_major"
                    value={formData.class_major}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">Chọn chuyên ngành</option>
                    <option value="Khoa học Dữ liệu">Khoa học Dữ liệu</option>
                    <option value="Công nghệ thông tin">Công Nghệ Thông Tin</option>
                    <option value="Kinh tế">Kinh Tế</option>
                    <option value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</option>
                </select>
            </div>

            {/* Tổng số tín chỉ */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Tổng số tín chỉ <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    name="total_credit"
                    value={formData.total_credit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 120"
                    min="1"
                    required
                />
            </div>

            {/* Tổng số học kỳ */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Tổng số học kỳ <span className="text-red-500">*</span>
                </label>
                <select 
                    name="total_semester"
                    value={formData.total_semester}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="">Chọn số học kỳ</option>
                    <option value="8">8 học kỳ</option>
                    <option value="9">9 học kỳ</option>
                    <option value="10">10 học kỳ</option>
                </select>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
            <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isSubmitting 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
                {isSubmitting ? 'Đang tạo...' : 'Thêm +'}
            </button>
            
            <button
                type="button"
                disabled={isSubmitting}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                onClick={() => {
                    setFormData({
                        class_name: '',
                        class_major: '',
                        total_credit: '',
                        total_semester: ''
                    });
                    setError(null);
                    setSuccess(null);
                }}
            >
                Hủy
            </button>
        </div>
      </form>
    </div>
  );
}
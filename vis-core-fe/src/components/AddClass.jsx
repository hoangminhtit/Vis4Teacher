import { useState } from 'react';
import { classAPI } from '../services/api';

export default function AddClass({ onClassAdded }) {
  const [formData, setFormData] = useState({
    class_name: '',
    number_of_student: '',
    class_major: '',
    teacher_note: '',
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

    try {
      // Kiểm tra dữ liệu bắt buộc (teacher_note không bắt buộc)
      if (!formData.class_name || !formData.number_of_student || !formData.class_major || 
          !formData.total_credit || !formData.total_semester) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
        setIsSubmitting(false);
        return;
      }

      // Gọi API để tạo lớp mới
      const newClass = await classAPI.createClass(formData);

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
        number_of_student: '',
        class_major: '',
        teacher_note: '',
        total_credit: '',
        total_semester: ''
      });

      // Show success message
      setSuccess('Tạo lớp mới thành công!');
      
      // Auto clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error creating class:', error);
      setError(error.message || 'Có lỗi xảy ra khi tạo lớp mới!');
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
                <p className="text-red-600">{error}</p>
            </div>
        )}
        
        {/* Success Message */}
        {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600">{success}</p>
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

        {/* Ghi chú giảng viên */}
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú giảng viên
            </label>
            <textarea
                name="teacher_note"
                value={formData.teacher_note}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập ghi chú về lớp học (không bắt buộc)..."
            ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
            <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg transition-colors ${
                    isSubmitting 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {isSubmitting ? 'Đang tạo...' : 'Tạo lớp mới'}
            </button>
            <button
                type="button"
                disabled={isSubmitting}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={() => setFormData({
                    class_name: '',
                    number_of_student: '',
                    class_major: '',
                    teacher_note: '',
                    total_credit: '',
                    total_semester: ''
                })}
            >
                Hủy bỏ
            </button>
        </div>
      </form>
    </div>
  );
}
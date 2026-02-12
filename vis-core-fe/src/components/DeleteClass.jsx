import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classAPI } from '../services/api';

export default function DeleteClass() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getClasses();
      setClasses(response || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    if (!selectedClass) {
      setError('Vui lòng chọn lớp cần xóa');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      setError(null);
      await classAPI.deleteClass(selectedClass);
      
      // Refresh danh sách và reset selection
      await fetchClasses();
      setSelectedClass('');
      setShowConfirmModal(false);
      
      // Hiển thị thông báo thành công
      alert('Xóa lớp thành công!');
      
      // Navigate về trang chủ
      navigate('/home');
    } catch (error) {
      console.error('Error deleting class:', error);
      setError('Không thể xóa lớp. Vui lòng thử lại sau.');
      setShowConfirmModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const selectedClassData = classes.find(c => c.class_name === selectedClass);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Xóa lớp học</h1>
            <p className="text-gray-600">Chọn lớp cần xóa khỏi hệ thống</p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-yellow-800 font-medium">Cảnh báo</p>
              <p className="text-yellow-700 text-sm">
                Việc xóa lớp sẽ xóa tất cả dữ liệu sinh viên và điểm số liên quan. 
                Hành động này không thể hoàn tác!
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Class Selection Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn lớp học cần xóa
          </label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setError(null);
            }}
            disabled={loading}
            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-800"
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((classItem) => (
              <option key={classItem.class_name} value={classItem.class_name}>
                {classItem.class_name} - {classItem.class_major}
              </option>
            ))}
          </select>
          {loading && <p className="text-sm text-gray-500 mt-2">Đang tải...</p>}
        </div>

        {/* Selected Class Info */}
        {selectedClass && selectedClassData && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Thông tin lớp sẽ bị xóa:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Tên lớp:</span>
                <span className="ml-2 font-medium">{selectedClassData.class_name}</span>
              </div>
              <div>
                <span className="text-gray-500">Chuyên ngành:</span>
                <span className="ml-2 font-medium">{selectedClassData.class_major}</span>
              </div>
              <div>
                <span className="text-gray-500">Khóa học:</span>
                <span className="ml-2 font-medium">{selectedClassData.class_year}</span>
              </div>
              <div>
                <span className="text-gray-500">Số sinh viên:</span>
                <span className="ml-2 font-medium">{selectedClassData.total_students || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delete Button */}
        <div className="flex gap-3">
          <button
            onClick={handleDeleteClick}
            disabled={!selectedClass || deleting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedClass && !deleting
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xóa...
              </span>
            ) : (
              'Xóa lớp'
            )}
          </button>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Hủy
          </button>
        </div>

        {/* Empty state */}
        {!loading && classes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Không có lớp nào để xóa</p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa lớp</h3>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn xóa lớp <strong>{selectedClassData?.class_name}</strong>?
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Tất cả dữ liệu sinh viên và điểm số của lớp này sẽ bị xóa vĩnh viễn.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xóa...
                  </>
                ) : (
                  'Xóa lớp'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

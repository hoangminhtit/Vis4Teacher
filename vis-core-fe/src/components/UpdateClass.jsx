import { useState, useEffect } from 'react';
import { classAPI } from '../services/api';
import UploadStudents from './UploadStudents';

export default function UpdateClass() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleUploadSuccess = () => {
    alert('Upload thành công! Điểm số đã được cập nhật.');
  };

  const selectedClassData = classes.find(c => c.class_name === selectedClass);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cập nhật điểm số</h1>
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
          Chọn lớp học
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          disabled={loading}
          className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-800"
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

      {/* Upload Area - Only show when class is selected */}
      {selectedClass && selectedClassData && (
        <div className="border-t pt-6">
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800">
              Đang upload cho lớp: <span className="font-bold">{selectedClassData.class_name}</span> - {selectedClassData.class_major}
            </p>
          </div>
          
          <UploadStudents 
            className={selectedClass} 
            onUploadSuccess={handleUploadSuccess} 
          />
        </div>
      )}

      {/* Empty state */}
      {!selectedClass && !loading && classes.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Vui lòng chọn lớp để upload điểm</p>
        </div>
      )}
    </div>
  );
}
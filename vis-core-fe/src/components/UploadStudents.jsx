import { useState, useRef } from 'react';
import { classAPI } from '../services/api';

export default function UploadStudents({ className, onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      setError('Chỉ hỗ trợ file Excel (.xlsx) hoặc CSV (.csv)');
      return;
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 10MB');
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await classAPI.uploadStudents(className, file);
      setUploadResult(result);
      
      // Gọi callback khi upload thành công
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Có lỗi xảy ra khi upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upload danh sách sinh viên</h1>
          <p className="text-gray-600">Lớp: <span className="font-medium">{className}</span></p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="max-w-2xl">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {isUploading ? 'Đang xử lý...' : 'Kéo thả file hoặc nhấn để chọn'}
              </h3>
              <p className="text-gray-500">
                Hỗ trợ file Excel (.xlsx) và CSV (.csv) - Tối đa 10MB
              </p>
            </div>
            
            <button
              type="button"
              onClick={openFileDialog}
              disabled={isUploading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${
                isUploading
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Chọn file
            </button>
          </div>
        </div>

        {/* Loading indicator */}
        {isUploading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang xử lý file...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi upload</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadResult && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Upload thành công!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>📊 Tổng số sinh viên: <span className="font-medium">{uploadResult.total}</span></p>
                  <p>➕ Sinh viên mới: <span className="font-medium">{uploadResult.created}</span></p>
                  <p>🔄 Sinh viên được cập nhật: <span className="font-medium">{uploadResult.updated}</span></p>
                  
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="text-yellow-600 font-medium">⚠️ Có một số lỗi:</p>
                      <ul className="mt-1 list-disc list-inside text-yellow-600">
                        {uploadResult.errors.map((error, index) => (
                          <li key={index} className="text-xs">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* File format info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Định dạng file yêu cầu:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>- File Excel (.xlsx) hoặc CSV (.csv)</li>
            <li>- Dữ liệu bắt đầu từ dòng 10 (bỏ qua 9 dòng đầu)</li>
            <li>- Bỏ qua 2 dòng cuối file</li>
            <li>- Các cột yêu cầu: Mã SV, Tên, Điểm hệ 10, Điểm hệ 4, Xếp loại...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
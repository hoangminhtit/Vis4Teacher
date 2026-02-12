import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { classAPI } from '../services/api';

export default function StudentDashboard() {
    const [studentDashboardUrl, setStudentDashboardUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [studentInfo, setStudentInfo] = useState(null);
    const { studentId: paramStudentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Fallback to get studentId from URL if useParams fails
    const studentId = paramStudentId || (location.pathname.includes('/student/') ? 
        location.pathname.split('/student/')[1] : null);

    const fetchStudentDashboard = useCallback(async () => {
        if (!studentId) {
            setError('Không tìm thấy Student ID từ URL');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await classAPI.getStudentDashboard(studentId);
            setStudentDashboardUrl(response.dashboard_url);
            
            if (response.student_info) {
                setStudentInfo(response.student_info);
            }
        } catch (err) {
            console.error('Error fetching student dashboard:', err);
            setError(`Lỗi: ${err.response?.data?.error || err.message || 'Không thể tải dashboard sinh viên'}`);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchStudentDashboard();
    }, [fetchStudentDashboard]);

    const handleGoBack = () => {
        // Quay lại trang trước hoặc về home
        navigate(-1);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header với nút quay lại */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Quay lại</span>
                    </button>
                    <div>
                        <h4 className="text-sm text-gray-600">
                            Sinh viên: {studentInfo?.student_name ? `${studentInfo.student_name} - ${studentId}` : `ID: ${studentId}`}
                        </h4>
                    </div>
                </div>
                
                {/* Nút refresh */}
                <button
                    onClick={fetchStudentDashboard}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Làm mới</span>
                </button>
            </div>

            {/* Dashboard content */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="border border-gray-200 rounded-lg" style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-500">Đang tải dashboard sinh viên...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <p className="text-red-500 font-medium mb-4">{error}</p>
                                <button 
                                    onClick={fetchStudentDashboard}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    ) : studentDashboardUrl ? (
                        <iframe
                            src={studentDashboardUrl}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            title={`Dashboard ${studentInfo?.student_name || studentId}`}
                            className="rounded-lg"
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <p className="text-gray-500">Không có dữ liệu dashboard cho sinh viên này</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
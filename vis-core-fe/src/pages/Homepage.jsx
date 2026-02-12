import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext"
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../components/navBar.jsx";
import Footer from "../components/Footer.jsx";
import LeftSidebar from "../components/LeftSidebar.jsx";
import UpdateClass from "../components/UpdateClass.jsx";
import AddClass from "../components/AddClass.jsx";
import DeleteClass from "../components/DeleteClass.jsx";
import TeacherProfile from "../components/TeacherProfile.jsx";
import AboutUs from "../components/AboutUs.jsx";
import StudentManagement from "../components/StudentManagement.jsx";
import StudentDashboard from "../components/StudentDashboard.jsx";
import { classAPI } from '../services/api';

export default function Homepage() {
    const [activeItem, setActiveItem] = useState('classes');
    const [newClassAdded, setNewClassAdded] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [dashboardUrl, setDashboardUrl] = useState('');
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardError, setDashboardError] = useState('');
    const { user } = useAuth();
    const { classCode, studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchClassDetails = async (classCodeParam) => {
        try {
            const classes = await classAPI.getClasses();
            const classData = classes.find(cls => 
                cls.class_name === classCodeParam || cls.class_code === classCodeParam
            );
            if (classData) {
                setSelectedClass(classData);
            } else {
                // Nếu không tìm thấy lớp, redirect về home
                navigate('/home');
            }
        } catch (error) {
            console.error('Error fetching class details:', error);
        }
    };

    // Không tự động load lớp đầu tiên nữa - chỉ hiển thị trang chủ

    const fetchDashboard = async (classData) => {
        if (!classData?.class_name) return;
        
        setDashboardLoading(true);
        setDashboardError('');
        
        try {
            const response = await classAPI.getClassDashboard(classData.class_name);
            setDashboardUrl(response.dashboard_url);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            setDashboardError('Không thể tải dashboard. Vui lòng thử lại sau.');
        } finally {
            setDashboardLoading(false);
        }
    };
    
    // Effect để xử lý khi URL thay đổi
    useEffect(() => {
        const pathname = location.pathname;
        
        if (studentId) {
            // Route cho individual student dashboard
            setActiveItem(`student-${studentId}`);
            setSelectedClass(null);
            setDashboardUrl('');
        } else if (classCode) {
            // Reset dashboard khi chuyển lớp
            setDashboardUrl('');
            setDashboardError('');
            
            // Nếu có classCode trong URL, fetch thông tin lớp
            fetchClassDetails(classCode);
            if (pathname.startsWith('/students/')) {
                setActiveItem(`students-${classCode}`);
            } else {
                setActiveItem(`classes-${classCode}`);
            }
        } else if (pathname === '/home') {
            // Hiển thị trang chủ mặc định
            setActiveItem('home');
            setSelectedClass(null);
            setDashboardUrl('');
        } else if (pathname === '/updateClass') {
            setActiveItem('updateClass');
            setSelectedClass(null);
        } else if (pathname === '/addClass') {
            setActiveItem('addClass');
            setSelectedClass(null);
        } else if (pathname === '/deleteClass') {
            setActiveItem('deleteClass');
            setSelectedClass(null);
        } else if (pathname === '/profile') {
            setActiveItem('profile');
            setSelectedClass(null);
        } else if (pathname === '/about') {
            setActiveItem('about');
            setSelectedClass(null);
        } else {
            setActiveItem('classes');
            setSelectedClass(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classCode, studentId, location.pathname]);

    // Effect để tự động fetch dashboard khi selectedClass thay đổi  
    useEffect(() => {
        if (selectedClass && activeItem.startsWith('classes-')) {
            fetchDashboard(selectedClass);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClass?.class_name, activeItem]);

    // PostMessage listener để nhận navigation từ Metabase iframe
    useEffect(() => {
        const handleIframeMessage = (event) => {
            // Kiểm tra origin để đảm bảo an toàn
            if (event.origin !== 'http://localhost:3000' && 
                !event.origin.includes('metabase') &&
                !event.origin.includes('localhost')) {
                return;
            }

            // Xử lý navigation message từ custom postMessage
            if (event.data.type === 'NAVIGATE_TO_STUDENT') {
                const studentId = event.data.studentId;
                if (studentId) {
                    navigate(`/student/${studentId}`);
                }
            }
            
            // Xử lý click từ Metabase iframe (metabase.location format)
            if (event.data.metabase && event.data.metabase.type === 'location') {
                const locationData = event.data.metabase.location;
                if (locationData && locationData.href) {
                    // Parse student_id từ URL
                    // Format: http://localhost:3000/dashboard/3?student_id=20011661
                    const url = new URL(locationData.href);
                    const studentId = url.searchParams.get('student_id');
                    
                    if (studentId) {
                        navigate(`/student/${studentId}`);
                    }
                }
            }
        };

        window.addEventListener('message', handleIframeMessage);
        return () => {
            window.removeEventListener('message', handleIframeMessage);
        };
    }, [navigate]);

    const handleClassAdded = (classData) => {
        // Callback khi có lớp mới được tạo
        setNewClassAdded(classData.class_code || classData.classCode);
        
        // Reset sau 1 giây để tránh re-render liên tục
        setTimeout(() => setNewClassAdded(null), 1000);
    };

    const handleClassSelect = (classItem, parentId) => {
        // Xử lý khi chọn lớp từ sidebar
        setSelectedClass(classItem);
        setActiveItem(`${parentId}-${classItem.class_code}`);
    };

    const renderMainContent = () => {
        // Nếu có studentId trong URL, hiển thị dashboard của student đó
        if (studentId) {
            return <StudentDashboard />;
        }
        
        // Nếu có classCode trong URL, hiển thị dashboard của lớp đó
        if (classCode && selectedClass) {
            return (
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Metabase Dashboard */}
                    <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ phân bố điểm - {selectedClass?.class_name}</h3>
                            <div className="border border-gray-200 rounded-lg" style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}>
                                {dashboardLoading ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                            <p className="text-gray-500">Đang tải dashboard...</p>
                                        </div>
                                    </div>
                                ) : dashboardError ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <p className="text-red-500 font-medium">{dashboardError}</p>
                                            <button 
                                                onClick={() => fetchDashboard(selectedClass)}
                                                className="mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Thử lại
                                            </button>
                                        </div>
                                    </div>
                                ) : dashboardUrl ? (
                                    <iframe
                                        id="metabase-iframe"
                                        src={dashboardUrl}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                        title={`Dashboard ${selectedClass?.class_name}`}
                                        className="rounded-lg"
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <p className="text-gray-500">Chọn một lớp để xem dashboard</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                </div>
            );
        }

        // Hiển thị component dựa trên URL pathname
        const pathname = location.pathname;
        
        if (pathname.startsWith('/students/')) {
            return <StudentManagement className={classCode} />;
        }
        
        // Trang chủ mặc định - hiển thị welcome page
        if (pathname === '/home') {
            return (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center py-12">
                        <svg className="w-20 h-20 mx-auto mb-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chào mừng đến với Vis4Teacher</h2>
                        <p className="text-gray-600 mb-6">Hệ thống quản lý và phân tích điểm sinh viên</p>
                        <div className="bg-orange-50 rounded-lg p-6 max-w-md mx-auto">
                            <p className="text-gray-700">
                                👈 Vui lòng chọn <strong>"Các lớp chủ nhiệm"</strong> ở menu bên trái và chọn lớp để xem thống kê điểm.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        
        switch (pathname) {
            case '/updateClass':
                return <UpdateClass />;
            case '/addClass':
                return <AddClass onClassAdded={handleClassAdded} />;
            case '/deleteClass':
                return <DeleteClass />;
            case '/profile':
                return <TeacherProfile />;
            case '/about':
                return <AboutUs />;
            default:
                // Redirect to home nếu route không hợp lệ
                return null;
        }
    };

    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Navbar userName={user?.full_name || user?.username} />
            <div className="flex flex-grow">
                <LeftSidebar 
                    activeItem={activeItem} 
                    setActiveItem={setActiveItem} 
                    newClassAdded={newClassAdded}
                    onAddClass={() => {}}
                    onClassSelect={handleClassSelect}
                />
                <main className="flex-1 p-6 bg-gray-50">
                    {renderMainContent()}
                </main>
            </div>
            <Footer />
        </div>
        </>
    );
}
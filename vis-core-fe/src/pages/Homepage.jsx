import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext"
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../components/navBar.jsx";
import Footer from "../components/Footer.jsx";
import LeftSidebar from "../components/LeftSidebar.jsx";
import ClassManagement from "../components/ClassManagement.jsx";
import UpdateClass from "../components/UpdateClass.jsx";
import AddClass from "../components/AddClass.jsx";
import TeacherProfile from "../components/TeacherProfile.jsx";
import AboutUs from "../components/AboutUs.jsx";
import StudentManagement from "../components/StudentManagement.jsx";
import { classAPI } from '../services/api';

export default function Homepage() {
    const [activeItem, setActiveItem] = useState('classes');
    const [newClassAdded, setNewClassAdded] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const { user } = useAuth();
    const { classCode } = useParams();
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

    const loadFirstClass = async () => {
        try {
            const classes = await classAPI.getClasses();
            if (classes && classes.length > 0) {
                // Tự động chuyển đến lớp đầu tiên
                const firstClass = classes[0];
                navigate(`/home/${firstClass.class_name}`);
            }
        } catch (error) {
            console.error('Error loading first class:', error);
            // Fallback - vẫn ở trang danh sách lớp nếu có lỗi
            setActiveItem('classes');
            setSelectedClass(null);
        }
    };
    
    // Effect để xử lý khi URL thay đổi
    useEffect(() => {
        const pathname = location.pathname;
        
        if (classCode) {
            // Nếu có classCode trong URL, fetch thông tin lớp
            fetchClassDetails(classCode);
            if (pathname.startsWith('/students/')) {
                setActiveItem(`students-${classCode}`);
            } else {
                setActiveItem(`classes-${classCode}`);
            }
        } else if (pathname === '/home') {
            // Tự động load lớp đầu tiên thay vì hiển thị danh sách
            loadFirstClass();
        } else if (pathname === '/updateClass') {
            setActiveItem('updateClass');
            setSelectedClass(null);
        } else if (pathname === '/addClass') {
            setActiveItem('addClass');
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
    }, [classCode, location.pathname, navigate]);

    const handleClassAdded = (classData) => {
        // Callback khi có lớp mới được tạo
        console.log('New class added:', classData);
        setNewClassAdded(classData.class_code || classData.classCode);
        
        // Reset sau 1 giây để tránh re-render liên tục
        setTimeout(() => setNewClassAdded(null), 1000);
    };

    const handleClassSelect = (classItem, parentId) => {
        // Xử lý khi chọn lớp từ sidebar
        setSelectedClass(classItem);
        setActiveItem(`${parentId}-${classItem.class_code}`);
        console.log('Class selected:', classItem);
    };

    const handleClassSelectFromManagement = (classItem) => {
        // Xử lý khi click vào lớp từ ClassManagement
        navigate(`/home/${classItem.class_code}`);
    };

    const renderMainContent = () => {
        // Nếu có classCode trong URL, hiển thị dashboard của lớp đó
        if (classCode && selectedClass) {
            return (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard Điểm - {selectedClass.class_code}</h1>
                            <p className="text-gray-600">Thống kê và trực quan hóa điểm số cho lớp {selectedClass.class_name}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-800">Tổng sinh viên</h3>
                                <p className="text-2xl font-bold text-blue-900">{selectedClass.current_students || 60}</p>
                                <p className="text-sm text-blue-600">/{selectedClass.max_students || 65} sinh viên</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-800">Điểm TB lớp</h3>
                                <p className="text-2xl font-bold text-green-900">7.2</p>
                                <p className="text-sm text-green-600">điểm</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-yellow-800">Đạt yêu cầu</h3>
                                <p className="text-2xl font-bold text-yellow-900">85%</p>
                                <p className="text-sm text-yellow-600">sinh viên</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-800">Bài kiểm tra</h3>
                                <p className="text-2xl font-bold text-purple-900">8</p>
                                <p className="text-sm text-purple-600">đã hoàn thành</p>
                            </div>
                        </div>

                        {/* Chart placeholder */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ phân bố điểm</h3>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                <div className="text-center">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="text-gray-500">Biểu đồ điểm số sẽ được hiển thị tại đây</p>
                                    <p className="text-sm text-gray-400 mt-1">Chart.js/D3.js integration đang phát triển</p>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => navigate(`/students/${selectedClass.class_name}`)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                                Quản lý sinh viên
                            </button>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Nhập điểm mới
                            </button>
                            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Xuất báo cáo
                            </button>
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
        
        // Nếu ở trang home nhưng chưa có classCode, hiển thị loading
        if (pathname === '/home') {
            return (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải dashboard...</span>
                    </div>
                </div>
            );
        }
        
        switch (pathname) {
            case '/updateClass':
                return <UpdateClass />;
            case '/addClass':
                return <AddClass onClassAdded={handleClassAdded} />;
            case '/profile':
                return <TeacherProfile />;
            case '/about':
                return <AboutUs />;
            default:
                return <ClassManagement onClassSelect={handleClassSelectFromManagement} />;
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
                    onAddClass={(className) => console.log(`Class added from sidebar: ${className}`)}
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
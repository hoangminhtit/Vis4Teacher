import { useState } from 'react';
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/navBar.jsx";
import Footer from "../components/Footer.jsx";
import LeftSidebar from "../components/LeftSidebar.jsx";
import ClassManagement from "../components/ClassManagement.jsx";
import UpdateClass from "../components/UpdateClass.jsx";
import AddClass from "../components/AddClass.jsx";
import TeacherProfile from "../components/TeacherProfile.jsx";
import AboutUs from "../components/AboutUs.jsx";

export default function Homepage() {
    const [activeItem, setActiveItem] = useState('classes');
    const { user, logout } = useAuth()

    const renderMainContent = () => {
        switch (activeItem) {
            case 'classes':
                return <ClassManagement />;
            case 'updateClass':
                return <UpdateClass />;
            case 'addClass':
                return <AddClass />;
            case 'profile':
                return <TeacherProfile />;
            case 'about':
                return <AboutUs />;
            default:
                return <ClassManagement />;
        }
    };

    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Navbar userName={user?.full_name || user?.username} />
            <div className="flex flex-grow">
                <LeftSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
                <main className="flex-1 p-6 bg-gray-50">
                    {renderMainContent()}
                </main>
            </div>
            <Footer />
        </div>
        </>
    );
}
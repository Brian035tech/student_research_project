import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function StudentLayout({ children }) {

    const navigate = useNavigate();


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };


    const menuItems = [

        {
            label: "Dashboard",
            path: "/student",
            icon: "🏠"
        },

        {
            label: "Submit Topics",
            path: "/student/topics",
            icon: "📝"
        },

        {
            label: "My Topics",
            path: "/student/mytopics",
            icon: "📚"
        },

        {
            label: "Assigned Supervisor",
            path: "/student/supervisor",
            icon: "👨‍🏫"
        },

        {
            label: "Feedback",
            path: "/student/feedback",
            icon: "💬"
        },

        {
            label: "Final Submission",
            path: "/student/final",
            icon: "📄"
        },

        {
            label: "My Profile",
            path: "/student/profile",
            icon: "👤"
        }

    ];


    return (

        <div className="d-flex">

            <Sidebar
                title="Student Portal"
                menuItems={menuItems}
                onLogout={logout}
            />


            <div className="flex-grow-1 bg-light">

                <nav className="navbar navbar-light bg-white shadow-sm px-4">

                    <h5 className="mb-0">
                        Student Research Management System
                    </h5>

                </nav>


                <main className="p-4">

                    {children}

                </main>

            </div>

        </div>

    );

}

export default StudentLayout;
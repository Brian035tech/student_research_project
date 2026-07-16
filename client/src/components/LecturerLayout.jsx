import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function LecturerLayout({ children }) {

    const navigate = useNavigate();


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };


    const menuItems = [

        {
            label: "Dashboard",
            path: "/lecturer",
            icon: "🏠"
        },

        {
            label: "Manage Topics",
            path: "/lecturer/topics",
            icon: "📚"
        },

        {
            label: "Assign Supervisors",
            path: "/lecturer/assign",
            icon: "👨‍🏫"
        },

        {
            label: "My Profile",
            path: "/lecturer/profile",
            icon: "👤"
        }

    ];


    return (

        <div className="d-flex">

            <Sidebar
                title="Lecturer Portal"
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

export default LecturerLayout;
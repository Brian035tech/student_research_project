import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminLayout({ children }) {

    const navigate = useNavigate();


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };


    const menuItems = [

        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: "🏠"
        },

        {
            label: "Manage Users",
            path: "/admin/users",
            icon: "👥"
        },

        {
            label: "Research Topics",
            path: "/admin/topics",
            icon: "📚"
        },

        {
            label: "Final Submissions",
            path: "/admin/submissions",
            icon: "📄"
        },

        {
            label: "My Profile",
            path: "/admin/profile",
            icon: "👤"
        }

    ];


    return (

        <div className="d-flex">

            <Sidebar
                title="Administrator"
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

export default AdminLayout;
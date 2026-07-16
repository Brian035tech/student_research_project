import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function SupervisorLayout({ children }) {

    const navigate = useNavigate();


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };


    const menuItems = [

        {
            label: "Dashboard",
            path: "/supervisor",
            icon: "🏠"
        },

        {
            label: "Assigned Topics",
            path: "/supervisor/topics",
            icon: "📚"
        },

        {
            label: "Give Feedback",
            path: "/supervisor/feedback",
            icon: "💬"
        },

        {
            label: "My Profile",
            path: "/supervisor/profile",
            icon: "👤"
        }

    ];


    return (

        <div className="d-flex">

            <Sidebar
                title="Supervisor Portal"
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

export default SupervisorLayout;
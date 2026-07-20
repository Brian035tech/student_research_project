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
            icon: "🏠",
        },
        {
            label: "Manage Users",
            path: "/admin/users",
            icon: "👥",
        },
        {
            label: "Research Topics",
            path: "/admin/topics",
            icon: "📚",
        },
        {
            label: "Final Submissions",
            path: "/admin/submissions",
            icon: "📄",
        },
        {
            label: "My Profile",
            path: "/admin/profile",
            icon: "👤",
        },
    ];

    return (
        <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
            <Sidebar
                title="Administrator"
                menuItems={menuItems}
                onLogout={logout}
            />

            <div className="flex-grow-1">

                <nav
                    className="navbar shadow-sm px-4"
                    style={{
                        background: "#ffffff",
                        height: "75px",
                        borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    <div>
                        <h4
                            className="mb-0"
                            style={{
                                fontWeight: "700",
                                color: "#1f2937",
                            }}
                        >
                            🎓 Student Research Management System
                        </h4>

                        <small className="text-muted">
                            Administrator Portal
                        </small>
                    </div>
                </nav>

                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
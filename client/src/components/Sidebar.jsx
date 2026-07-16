import { NavLink } from "react-router-dom";

function Sidebar({ title, menuItems, onLogout }) {

    return (
        <div
            className="bg-primary text-white d-flex flex-column"
            style={{
                width: "260px",
                minHeight: "100vh"
            }}
        >

            {/* Logo */}
            <div className="p-4 border-bottom">

                <h3 className="fw-bold">
                    SRMS
                </h3>

                <small>
                    {title}
                </small>

            </div>


            {/* Menu */}
            <div className="p-3 flex-grow-1">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `d-flex align-items-center p-3 mb-2 rounded text-decoration-none ${
                                isActive
                                    ? "bg-white text-primary fw-bold"
                                    : "text-white"
                            }`
                        }
                    >

                        <span className="me-3">
                            {item.icon}
                        </span>

                        {item.label}

                    </NavLink>

                ))}

            </div>


            {/* Logout */}
            <div className="p-3 border-top">

                <button
                    className="btn btn-light w-100"
                    onClick={onLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Sidebar;
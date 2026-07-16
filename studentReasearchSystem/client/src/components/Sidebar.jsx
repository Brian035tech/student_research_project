import { Link } from "react-router-dom";
import { logout } from "../utils/auth";

function Sidebar() {

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    return (

        <div
            style={{
                width: "250px",
                background: "#1e3a8a",
                color: "white",
                minHeight: "100vh",
                padding: "20px",
            }}
        >

            <h2>SRMS</h2>

            <hr />

            <p>
                <Link to="/student" style={linkStyle}>
                    Dashboard
                </Link>
            </p>

            <p>
                <Link to="/student/topics" style={linkStyle}>
                    Submit Topics
                </Link>
            </p>

            <p>
                <Link to="/student/mytopics" style={linkStyle}>
                    My Topics
                </Link>
            </p>

            <p>
                <Link to="/student/supervisor" style={linkStyle}>
                    Assigned Supervisor
                </Link>
            </p>

            <p>
                <Link to="/student/feedback" style={linkStyle}>
                    Feedback
                </Link>
            </p>

            <p>
                <Link to="/student/final" style={linkStyle}>
                    Final Submission
                </Link>
            </p>

            <p>
                <Link to="/student/profile" style={linkStyle}>
                    My Profile
                </Link>
            </p>

            <button
                onClick={handleLogout}
                style={{
                    width: "100%",
                    marginTop: "30px",
                    padding: "10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>

        </div>
    );
}

const linkStyle = {
    color: "white",
    textDecoration: "none",
};

export default Sidebar;
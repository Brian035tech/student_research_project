import { Link } from "react-router-dom";

function LecturerSidebar() {
    return (
        <div className="sidebar">

            <h2>SRMS</h2>

            <ul>

                <li>
                    <Link to="/lecturer">
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/lecturer/topics">
                        Manage Topics
                    </Link>
                </li>

                <li>
                    <Link to="/lecturer/assign">
                        Assign Supervisors
                    </Link>
                </li>

                <li>
                    <Link to="/lecturer/profile">
                        My Profile
                    </Link>
                </li>

                <li>
                    <Link to="/">
                        Logout
                    </Link>
                </li>

            </ul>

        </div>
    );
}

export default LecturerSidebar;
import { Link } from "react-router-dom";

function SupervisorSidebar() {

    return (

        <div className="sidebar">

            <h2>SRMS</h2>

            <ul>

                <li>
                    <Link to="/supervisor">
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/supervisor/topics">
                        Assigned Topics
                    </Link>
                </li>

                <li>
                    <Link to="/supervisor/feedback">
                        Feedback
                    </Link>
                </li>

                <li>
                    <Link to="/supervisor/profile">
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

export default SupervisorSidebar;
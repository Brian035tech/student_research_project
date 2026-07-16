import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/student/Dashboard";
import LecturerDashboard from "./pages/lecturer/Dashboard";
import SupervisorDashboard from "./pages/supervisor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

import SubmitTopics from "./pages/student/SubmitTopics";
import MyTopics from "./pages/student/MyTopics";
import Supervisor from "./pages/student/Supervisor";
import Feedback from "./pages/student/Feedback";
import FinalSubmission from "./pages/student/FinalSubmission";
import Profile from "./pages/student/Profile";
import ManageTopics from "./pages/lecturer/ManageTopics";
import AssignSupervisors from "./pages/lecturer/AssignSupervisors";
import AssignedTopics from "./pages/supervisor/AssignedTopics";
import SupervisorFeedback from "./pages/supervisor/Feedback";
import SupervisorProfile from "./pages/supervisor/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/topics" element={<SubmitTopics />} />
        <Route path="/student/mytopics" element={<MyTopics />} />
        <Route path="/student/supervisor" element={<Supervisor />} />
        <Route path="/student/feedback" element={<Feedback />} />
        <Route path="/student/final" element={<FinalSubmission />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/supervisor/topics" element={<AssignedTopics />} />
<Route path="/supervisor/feedback" element={<SupervisorFeedback />} />
<Route path="/supervisor/profile" element={<SupervisorProfile />} />

        {/* Lecturer */}
        <Route path="/lecturer" element={<LecturerDashboard />} />
        <Route
    path="/lecturer/topics"
    element={<ManageTopics />}
/>

        {/* Supervisor */}
        <Route path="/supervisor" element={<SupervisorDashboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
    path="/lecturer/assign"
    element={<AssignSupervisors />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
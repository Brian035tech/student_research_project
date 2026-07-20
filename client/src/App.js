import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import Topics from "./pages/admin/Topics";
import Submissions from "./pages/admin/Submissions";
import AdminProfile from "./pages/admin/Profile";
import ManageUsers from "./pages/admin/ManageUsers";

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

        {/* Supervisor */}
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/supervisor/topics" element={<AssignedTopics />} />
        <Route path="/supervisor/feedback" element={<SupervisorFeedback />} />
        <Route path="/supervisor/profile" element={<SupervisorProfile />} />

        {/* Lecturer */}
        <Route path="/lecturer" element={<LecturerDashboard />} />
        <Route path="/lecturer/profile" element={<Profile />} />
        <Route path="/lecturer/topics" element={<ManageTopics />} />
        <Route path="/lecturer/assign" element={<AssignSupervisors />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/topics" element={<Topics />} />
        <Route path="/admin/submissions" element={<Submissions />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/users" element={<ManageUsers />} />

      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import StudentLayout from "../../components/StudentLayout";
import DashboardCard from "../../components/DashboardCard";

function Dashboard() {
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({});

  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const response = await api.get("/student/dashboard");
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Research progress from backend
let progress = stats.progress || 20;
  return (
    <StudentLayout>
      {/* Welcome */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="fw-bold">
  Welcome, {user?.full_name} 👋
</h2>

          <p className="text-muted mb-1">
            Student Research Management System
          </p>

          <small className="text-secondary">
            {new Date().toDateString()}
          </small>
        </div>
      </div>

      {/* Student Information */}

<div className="card shadow-sm border-0 mb-4">

  <div className="card-header bg-primary text-white">
    Student Information
  </div>

  <div className="card-body">

    <div className="row">

      <div className="col-md-6 mb-3">
        <strong>Name:</strong>
        <p>{stats.student_name}</p>
      </div>


      <div className="col-md-6 mb-3">
        <strong>Student ID:</strong>
        <p>{stats.student_id}</p>
      </div>


      <div className="col-md-6 mb-3">
        <strong>School:</strong>
        <p>{stats.school}</p>
      </div>


      <div className="col-md-6 mb-3">
        <strong>Department:</strong>
        <p>{stats.department}</p>
      </div>


      <div className="col-md-12">
        <strong>Course:</strong>
        <p>{stats.course}</p>
      </div>


    </div>

  </div>

</div>

      {/* Dashboard Cards */}

      <div className="row">

       <DashboardCard
  title="Topics Submitted"
  value={stats.topics || 0}
  icon="📝"
  color="#0d6efd"
  onClick={() => navigate("/student/mytopics")}
/>

<DashboardCard
  title="Supervisor"
  value={stats.supervisor || "Not Assigned"}
  icon="👨‍🏫"
  color="#198754"
  onClick={() => navigate("/student/supervisor")}
/>

<DashboardCard
  title="Final Submission"
  value={stats.submissions || 0}
  icon="📄"
  color="#fd7e14"
  onClick={() => navigate("/student/final")}
/>

      </div>

      {/* Progress */}

      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">

          <div className="d-flex justify-content-between">
            <h5 className="fw-bold">
              Research Progress
            </h5>

            <span className="badge bg-primary">
              {progress}%
            </span>

          </div>

          <div className="progress mt-3" style={{ height: "12px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="mt-3">

            <small className="text-muted">

              {progress === 20 &&
                "Start by submitting your research topic."}

              {progress === 40 &&
                "Awaiting supervisor assignment."}

              {progress < 100 &&
"Continue working with your supervisor and submit the next research draft."}

{progress === 100 &&
"Congratulations! Your research has been fully approved."}
            </small>

          </div>

        </div>
      </div>

      {/* Quick Information */}

      <div className="row mt-4">

        <div className="col-md-6">

          <div className="card shadow-sm h-100">

            <div className="card-header bg-primary text-white">
              Research Status
            </div>

            <div className="card-body">

              <p>
                <strong>Supervisor:</strong>{" "}
                {stats.supervisor || "Not Assigned"}
              </p>

              <p>
                <strong>Topics Submitted:</strong>{" "}
                {stats.topics || 0}
              </p>

              <p>
                <strong>Final Submission:</strong>{" "}
                {stats.submissions > 0 ? (
                  <span className="badge bg-success">
                    Submitted
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark">
                    Pending
                  </span>
                )}
              </p>

            </div>

          </div>

        </div>

        <div className="col-md-6">

          <div className="card shadow-sm h-100">

            <div className="card-header bg-success text-white">
              Student Tips
            </div>

            <div className="card-body">

              <ul className="mb-0">

                <li>Submit unique research topics.</li>

                <li>Check lecturer feedback regularly.</li>

                <li>Communicate with your supervisor.</li>

                <li>Submit your final document before the deadline.</li>

              </ul>

            </div>

          </div>

        </div>

      </div>

    </StudentLayout>
  );
}

export default Dashboard;
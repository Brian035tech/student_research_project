import { useEffect, useState } from "react";
import api from "../../services/api";
import StudentLayout from "../../components/StudentLayout";
import DashboardCard from "../../components/DashboardCard";

function Dashboard() {
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

  // Calculate progress
  let progress = 20;

  if (stats.topics > 0) progress = 40;
  if (stats.supervisor && stats.supervisor !== "Not Assigned") progress = 70;
  if (stats.submissions > 0) progress = 100;

  return (
    <StudentLayout>
      {/* Welcome */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="fw-bold">
            Welcome 👋
          </h2>

          <p className="text-muted mb-1">
            Student Research Management System
          </p>

          <small className="text-secondary">
            {new Date().toDateString()}
          </small>
        </div>
      </div>

      {/* Dashboard Cards */}

      <div className="row">

        <DashboardCard
          title="Topics Submitted"
          value={stats.topics || 0}
          icon="📝"
          color="#0d6efd"
        />

        <DashboardCard
          title="Supervisor"
          value={stats.supervisor || "Not Assigned"}
          icon="👨‍🏫"
          color="#198754"
        />

        <DashboardCard
          title="Final Submission"
          value={stats.submissions || 0}
          icon="📄"
          color="#fd7e14"
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

              {progress === 70 &&
                "Work with your supervisor and upload your final research."}

              {progress === 100 &&
                "Congratulations! Your research has been submitted."}

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
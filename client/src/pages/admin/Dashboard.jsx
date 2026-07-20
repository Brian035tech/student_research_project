import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import DashboardCard from "../../components/DashboardCard";

import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [stats, setStats] = useState({});
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchActivities();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get("/admin/dashboard");
            setStats(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await api.get("/admin/recent-activity");
            setActivities(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const downloadReport = async () => {
        try {
            const response = await api.get("/admin/report", {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "SRMS_System_Report.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Failed to download the report.");
        }
    };

    const topicData = {
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [
            {
                data: [
                    stats.approved || 0,
                    stats.pending || 0,
                    stats.rejected || 0,
                ],
                backgroundColor: [
                    "#198754",
                    "#ffc107",
                    "#dc3545",
                ],
            },
        ],
    };

    const userData = {
        labels: ["Students", "Lecturers", "Supervisors"],
        datasets: [
            {
                label: "Users",
                data: [
                    stats.students || 0,
                    stats.lecturers || 0,
                    stats.supervisors || 0,
                ],
                backgroundColor: [
                    "#0d6efd",
                    "#198754",
                    "#6f42c1",
                ],
            },
        ],
    };

    return (
        <AdminLayout>
            <h2 className="mb-4">Admin Dashboard</h2>

            <div className="row">
                <DashboardCard
                    title="Students"
                    value={stats.students || 0}
                    icon="👨‍🎓"
                    color="#0d6efd"
                />

                <DashboardCard
                    title="Lecturers"
                    value={stats.lecturers || 0}
                    icon="👨‍🏫"
                    color="#198754"
                />

                <DashboardCard
                    title="Supervisors"
                    value={stats.supervisors || 0}
                    icon="🧑‍💼"
                    color="#6f42c1"
                />

                <DashboardCard
                    title="Total Topics"
                    value={stats.topics || 0}
                    icon="📚"
                    color="#fd7e14"
                />

                <DashboardCard
                    title="Approved Topics"
                    value={stats.approved || 0}
                    icon="✅"
                    color="#198754"
                />

                <DashboardCard
                    title="Pending Topics"
                    value={stats.pending || 0}
                    icon="⏳"
                    color="#ffc107"
                />

                <DashboardCard
                    title="Rejected Topics"
                    value={stats.rejected || 0}
                    icon="❌"
                    color="#dc3545"
                />

                <DashboardCard
                    title="Final Submissions"
                    value={stats.submissions || 0}
                    icon="📄"
                    color="#20c997"
                />
            </div>

            <div className="row mt-5">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-success text-white">
                            Topic Status Distribution
                        </div>

                        <div className="card-body">
                            <Pie data={topicData} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-primary text-white">
                            User Distribution
                        </div>

                        <div className="card-body">
                            <Bar
                                data={userData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0 mt-4">
                <div className="card-header bg-dark text-white">
                    Recent Activity
                </div>

                <div className="card-body">
                    {activities.length === 0 ? (
                        <p>No recent activity.</p>
                    ) : (
                        <ul className="list-group">
                            {activities.map((item, index) => (
                                <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{item.full_name}</strong>
                                        <br />
                                        <small>{item.title}</small>
                                    </div>

                                    <span
                                        className={`badge ${
                                            item.status === "Approved"
                                                ? "bg-success"
                                                : item.status === "Rejected"
                                                ? "bg-danger"
                                                : "bg-warning text-dark"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="text-center mt-5">
                <button
                    className="btn btn-success btn-lg"
                    onClick={downloadReport}
                >
                    📥 Download System Report
                </button>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;
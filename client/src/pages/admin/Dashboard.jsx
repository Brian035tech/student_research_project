import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import DashboardCard from "../../components/DashboardCard";

function Dashboard() {

    const [stats, setStats] = useState({});


    useEffect(() => {

        fetchStats();

    }, []);



    const fetchStats = async () => {

        try {

            const response = await api.get("/admin/dashboard");

            setStats(response.data);

        } catch (error) {

            console.log(error);

        }

    };



    return (

        <AdminLayout>

            <h2 className="mb-4">
                Admin Dashboard
            </h2>


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


        </AdminLayout>

    );

}


export default Dashboard;
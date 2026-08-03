import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../../services/api";

import LecturerLayout from "../../components/LecturerLayout";
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

            const response = await api.get("/lecturer/dashboard");

            setStats(response.data);

        } catch (error) {

            console.log(error);

        }

    };



    return (

        <LecturerLayout>


           <h2>
Welcome, {user?.full_name} 👋
</h2>


            <div className="row">


                <DashboardCard
  title="Pending Topics"
  value={stats.pending || 0}
  icon="⏳"
  color="#ffc107"
  onClick={() => navigate("/lecturer/topics?status=Pending")}
/>

<DashboardCard
  title="Approved Topics"
  value={stats.approved || 0}
  icon="✅"
  color="#198754"
  onClick={() => navigate("/lecturer/topics?status=Approved")}
/>

<DashboardCard
  title="Rejected Topics"
  value={stats.rejected || 0}
  icon="❌"
  color="#dc3545"
  onClick={() => navigate("/lecturer/topics?status=Rejected")}
/>

<DashboardCard
  title="Available Supervisors"
  value={stats.supervisors || 0}
  icon="👨‍🏫"
  color="#6f42c1"
  onClick={() => navigate("/lecturer/assign")}
/>

<DashboardCard
  title="Final Drafts"
  value={stats.finalDrafts || 0}
  icon="📄"
  color="#0d6efd"
  onClick={() => navigate("/lecturer/final-drafts")}
/>

            </div>


        </LecturerLayout>

    );

}


export default Dashboard;
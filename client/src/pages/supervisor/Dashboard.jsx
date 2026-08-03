import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../../services/api";

import SupervisorLayout from "../../components/SupervisorLayout";
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

            const response = await api.get("/supervisor/dashboard");

            setStats(response.data);

        } catch (error) {

            console.log(error);

        }

    };



    return (

        <SupervisorLayout>


           <h2>
Welcome, {user?.full_name} 👋
</h2>


            <div className="row">


                <DashboardCard
  title="Assigned Topics"
  value={stats.topics || 0}
  icon="📚"
  color="#0d6efd"
  onClick={() => navigate("/supervisor/topics")}
/>


                <DashboardCard
  title="Concept Papers"
  value={stats.conceptPapers || 0}
  icon="📑"
  color="#6f42c1"
  onClick={() => navigate("/supervisor/concept-papers")}
/>

<DashboardCard
  title="Proposal Submissions"
  value={stats.proposals || 0}
  icon="📝"
  color="#fd7e14"
  onClick={() => navigate("/supervisor/proposals")}
/>

<DashboardCard
  title="Final Drafts"
  value={stats.finalDrafts || 0}
  icon="📄"
  color="#198754"
  onClick={() => navigate("/supervisor/final-drafts")}
/>

<DashboardCard
  title="Feedback"
  value={stats.feedback || 0}
  icon="💬"
  color="#dc3545"
  onClick={() => navigate("/supervisor/feedback")}
/>
            </div>


        </SupervisorLayout>

    );

}


export default Dashboard;
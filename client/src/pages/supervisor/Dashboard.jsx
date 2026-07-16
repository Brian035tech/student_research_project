import { useEffect, useState } from "react";

import api from "../../services/api";

import SupervisorLayout from "../../components/SupervisorLayout";
import DashboardCard from "../../components/DashboardCard";


function Dashboard() {

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


            <h2 className="mb-4">
                Supervisor Dashboard
            </h2>


            <div className="row">


                <DashboardCard
                    title="Assigned Topics"
                    value={stats.topics || 0}
                    icon="📚"
                    color="#0d6efd"
                />


                <DashboardCard
                    title="Assigned Students"
                    value={stats.students || 0}
                    icon="👨‍🎓"
                    color="#198754"
                />


                <DashboardCard
                    title="Feedback Given"
                    value={stats.feedback || 0}
                    icon="💬"
                    color="#fd7e14"
                />


            </div>


        </SupervisorLayout>

    );

}


export default Dashboard;
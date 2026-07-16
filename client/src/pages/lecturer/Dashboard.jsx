import { useEffect, useState } from "react";

import api from "../../services/api";

import LecturerLayout from "../../components/LecturerLayout";
import DashboardCard from "../../components/DashboardCard";


function Dashboard() {


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


            <h2 className="mb-4">
                Lecturer Dashboard
            </h2>


            <div className="row">


                <DashboardCard
                    title="Students"
                    value={stats.students || 0}
                    icon="👨‍🎓"
                    color="#0d6efd"
                />


                <DashboardCard
                    title="Research Topics"
                    value={stats.topics || 0}
                    icon="📚"
                    color="#6610f2"
                />


                <DashboardCard
                    title="Pending Topics"
                    value={stats.pending || 0}
                    icon="⏳"
                    color="#ffc107"
                />


                <DashboardCard
                    title="Approved Topics"
                    value={stats.approved || 0}
                    icon="✅"
                    color="#198754"
                />


                <DashboardCard
                    title="Rejected Topics"
                    value={stats.rejected || 0}
                    icon="❌"
                    color="#dc3545"
                />


            </div>


        </LecturerLayout>

    );

}


export default Dashboard;
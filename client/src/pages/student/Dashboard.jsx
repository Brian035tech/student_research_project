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



    return (

        <StudentLayout>


            <h2 className="mb-4">
                Student Dashboard
            </h2>



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

                    title="Final Submissions"

                    value={stats.submissions || 0}

                    icon="📄"

                    color="#fd7e14"

                />


            </div>



        </StudentLayout>

    );

}


export default Dashboard;
import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";

function Supervisor() {
    const [supervisor, setSupervisor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSupervisor();
    }, []);

    const fetchSupervisor = async () => {
        try {
            const res = await api.get("/topics/supervisor");
            setSupervisor(res.data);
        } catch (err) {
            console.error(err);
            setSupervisor(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StudentLayout>
            <h1>Assigned Supervisor</h1>

            {loading ? (
                <p>Loading...</p>
            ) : supervisor ? (
                <div className="card">
                    <h3>{supervisor.supervisor_name}</h3>

                    <p>
                        <strong>Email:</strong> {supervisor.supervisor_email}
                    </p>

                    <p>
                        <strong>Approved Topic:</strong> {supervisor.title}
                    </p>

                    <p>
                        <strong>Status:</strong> {supervisor.status}
                    </p>
                </div>
            ) : (
                <p>No supervisor assigned yet.</p>
            )}
        </StudentLayout>
    );
}

export default Supervisor;
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

            console.log(err);

            setSupervisor(null);

        } finally {

            setLoading(false);

        }

    };

    const statusBadge = (status) => {

        let color = "#6c757d";

        if (status === "Approved") color = "#198754";
        else if (status === "Pending") color = "#ffc107";
        else if (status === "Rejected") color = "#dc3545";

        return (

            <span
                style={{
                    background: color,
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "13px"
                }}
            >
                {status}
            </span>

        );

    };

    return (

        <StudentLayout>

            <h1>Assigned Supervisor</h1>

            {loading ? (

                <div
                    style={{
                        background: "#fff",
                        padding: "30px",
                        borderRadius: "10px",
                        marginTop: "20px"
                    }}
                >
                    Loading supervisor details...
                </div>

            ) : supervisor ? (

                <div
                    style={{
                        background: "#fff",
                        marginTop: "20px",
                        padding: "30px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        maxWidth: "700px"
                    }}
                >

                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "25px"
                        }}
                    >

                        <div
                            style={{
                                width: "90px",
                                height: "90px",
                                borderRadius: "50%",
                                background: "#1e3a8a",
                                color: "#fff",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "auto",
                                fontSize: "34px",
                                fontWeight: "bold"
                            }}
                        >
                            {supervisor.supervisor_name.charAt(0).toUpperCase()}
                        </div>

                        <h2 style={{ marginTop: "15px" }}>
                            {supervisor.supervisor_name}
                        </h2>

                    </div>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <tbody>

                            <tr>
                                <td style={label}>Supervisor</td>
                                <td style={value}>{supervisor.supervisor_name}</td>
                            </tr>

                            <tr>
                                <td style={label}>Email</td>
                                <td style={value}>{supervisor.supervisor_email}</td>
                            </tr>

                            <tr>
                                <td style={label}>Approved Topic</td>
                                <td style={value}>{supervisor.title}</td>
                            </tr>

                            <tr>
                                <td style={label}>Status</td>
                                <td style={value}>
                                    {statusBadge(supervisor.status)}
                                </td>
                            </tr>

                        </tbody>

                    </table>

                </div>

            ) : (

                <div
                    style={{
                        background: "#fff",
                        padding: "30px",
                        borderRadius: "10px",
                        marginTop: "20px",
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                >
                    <h3>No Supervisor Assigned</h3>

                    <p>
                        Your research topic has not yet been assigned to a supervisor.
                        Please wait for your lecturer to complete the assignment.
                    </p>
                </div>

            )}

        </StudentLayout>

    );

}

const label = {
    padding: "12px",
    fontWeight: "bold",
    width: "180px",
    borderBottom: "1px solid #ddd"
};

const value = {
    padding: "12px",
    borderBottom: "1px solid #ddd"
};

export default Supervisor;
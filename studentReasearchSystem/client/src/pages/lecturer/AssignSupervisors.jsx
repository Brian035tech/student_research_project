import { useEffect, useState } from "react";
import LecturerLayout from "../../components/LecturerLayout";
import api from "../../services/api";

function AssignSupervisors() {

    const [topics, setTopics] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState({});

    useEffect(() => {
        fetchApprovedTopics();
        fetchSupervisors();
    }, []);

    // Fetch approved topics
    const fetchApprovedTopics = async () => {

        try {

            const response = await api.get("/topics");

            const approved = response.data.filter(
                (topic) => topic.status === "Approved"
            );

            setTopics(approved);

        } catch (error) {

            console.log(error);

        }

    };

    // Fetch supervisors
   const fetchSupervisors = async () => {

    try {

        const response = await api.get("/users/supervisors");

        console.log("Supervisors received:", response.data);

        setSupervisors(response.data);

    } catch (error) {

        console.log("Supervisor fetch error:", error.response);

    }

};

    // Assign supervisor
    const assignSupervisor = async (topicId) => {

        try {

            const supervisorId = selectedSupervisor[topicId];

            if (!supervisorId) {

                alert("Please select a supervisor.");

                return;

            }

            console.log("Topic:", topicId);
            console.log("Supervisor:", supervisorId);

            const response = await api.put(
                `/topics/${topicId}/assign-supervisor`,
                {
                    supervisor_id: supervisorId
                }
            );

            console.log(response.data);

            alert("Supervisor assigned successfully.");

            fetchApprovedTopics();

        } catch (error) {

            console.log(error.response || error);

            alert("Failed to assign supervisor.");

        }

    };

    return (

        <LecturerLayout>

            <h1>Assign Supervisors</h1>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                    background: "#fff"
                }}
            >

                <thead>

                    <tr style={{ background: "#1e3a8a", color: "#fff" }}>

                        <th style={th}>Student</th>
                        <th style={th}>Email</th>
                        <th style={th}>Topic</th>
                        <th style={th}>Current Supervisor</th>
                        <th style={th}>Select Supervisor</th>
                        <th style={th}>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {topics.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                style={{
                                    padding: "20px",
                                    textAlign: "center"
                                }}
                            >
                                No approved topics found.
                            </td>

                        </tr>

                    ) : (

                        topics.map((topic) => (

                            <tr key={topic.id}>

                                <td style={td}>
                                    {topic.full_name}
                                </td>

                                <td style={td}>
                                    {topic.email}
                                </td>

                                <td style={td}>
                                    {topic.title}
                                </td>

                                <td style={td}>
                                    {topic.supervisor_name || "Not Assigned"}
                                </td>

                                <td style={td}>

    {topic.supervisor_name ? (

        <span
            style={{
                color: "green",
                fontWeight: "bold"
            }}
        >
            {topic.supervisor_name}
        </span>

    ) : (

        <select
            value={selectedSupervisor[topic.id] || ""}
            onChange={(e) =>
                setSelectedSupervisor({
                    ...selectedSupervisor,
                    [topic.id]: e.target.value
                })
            }
        >

            <option value="">
                Select Supervisor
            </option>

            {supervisors.map((supervisor) => (

                <option
                    key={supervisor.id}
                    value={supervisor.id}
                >
                    {supervisor.full_name}
                </option>

            ))}

        </select>

    )}

</td>

                                <td style={td}>

                                    <button
                                        onClick={() => assignSupervisor(topic.id)}
                                        style={{
                                            background: "#1e3a8a",
                                            color: "#fff",
                                            border: "none",
                                            padding: "8px 15px",
                                            cursor: "pointer",
                                            borderRadius: "5px"
                                        }}
                                    >
                                        Assign
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </LecturerLayout>

    );

}

const th = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left"
};

const td = {
    padding: "12px",
    border: "1px solid #ddd"
};

export default AssignSupervisors;
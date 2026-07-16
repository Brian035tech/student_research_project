import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";

function MyTopics() {

    const [topics, setTopics] = useState([]);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {

        try {

            const response = await api.get("/topics");

            setTopics(response.data);

        } catch (error) {

            console.log(error);

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
                    fontSize: "13px",
                    fontWeight: "bold"
                }}
            >
                {status}
            </span>

        );

    };

    return (

        <StudentLayout>

            <h1>My Research Topics</h1>

            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginTop: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr
                            style={{
                                background: "#1f2937",
                                color: "#fff"
                            }}
                        >

                            <th style={th}>Topic</th>
                            <th style={th}>Description</th>
                            <th style={th}>Status</th>
                            <th style={th}>Lecturer Comment</th>
                            <th style={th}>Supervisor Feedback</th>
                            <th style={th}>Date Submitted</th>

                        </tr>

                    </thead>

                    <tbody>

                        {topics.length > 0 ? (

                            topics.map((topic) => (

                                <tr key={topic.id}>

                                    <td style={td}>
                                        {topic.title}
                                    </td>

                                    <td style={td}>
                                        {topic.description}
                                    </td>

                                    <td style={td}>
                                        {statusBadge(topic.status)}
                                    </td>

                                    <td style={td}>
                                        {topic.lecturer_comment || (
                                            <span style={{ color: "#999" }}>
                                                No comment
                                            </span>
                                        )}
                                    </td>

                                    <td style={td}>
                                        {topic.supervisor_feedback || (
                                            <span style={{ color: "#999" }}>
                                                No feedback
                                            </span>
                                        )}
                                    </td>

                                    <td style={td}>
                                        {new Date(topic.created_at).toLocaleDateString()}
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    style={{
                                        padding: "30px",
                                        textAlign: "center"
                                    }}
                                >
                                    No research topics submitted.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </StudentLayout>

    );

}

const th = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd"
};

const td = {
    padding: "12px",
    borderBottom: "1px solid #ddd"
};

export default MyTopics;
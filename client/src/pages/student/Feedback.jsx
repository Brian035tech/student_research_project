import { useEffect, useState } from "react";
import api from "../../services/api";
import StudentLayout from "../../components/StudentLayout";

function Feedback() {

    const [topics, setTopics] = useState([]);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {

        try {

            const res = await api.get("/topics");

            setTopics(res.data);

        } catch (err) {

            console.log(err);

            alert("Failed to load feedback.");

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

            <h1>Research Feedback</h1>

            {topics.length === 0 ? (

                <div
                    style={{
                        background: "#fff",
                        padding: "30px",
                        marginTop: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                >
                    No research topics submitted.
                </div>

            ) : (

                topics.map((topic) => (

                    <div
                        key={topic.id}
                        style={{
                            background: "#fff",
                            padding: "25px",
                            marginTop: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                    >

                        <h2>{topic.title}</h2>

                        <p>
                            <strong>Status:</strong>{" "}
                            {statusBadge(topic.status)}
                        </p>

                        <hr />

                        <h3>Lecturer Comment</h3>

                        <div
                            style={{
                                background: "#f8f9fa",
                                padding: "15px",
                                borderLeft: "5px solid #1e3a8a",
                                borderRadius: "5px"
                            }}
                        >
                            {topic.lecturer_comment || "No lecturer comment available."}
                        </div>

                        <br />

                        <h3>Supervisor Feedback</h3>

                        <div
                            style={{
                                background: "#f8f9fa",
                                padding: "15px",
                                borderLeft: "5px solid #198754",
                                borderRadius: "5px"
                            }}
                        >
                            {topic.supervisor_feedback || "No supervisor feedback available."}
                        </div>

                    </div>

                ))

            )}

        </StudentLayout>

    );

}

export default Feedback;
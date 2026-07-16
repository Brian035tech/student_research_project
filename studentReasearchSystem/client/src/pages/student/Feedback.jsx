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
            console.error(err);
            alert("Failed to load feedback.");
        }
    };

    return (
        <StudentLayout>
            <h2>Supervisor Feedback</h2>

            {topics.length === 0 ? (
                <p>No topics submitted.</p>
            ) : (
                topics.map((topic) => (
                    <div
                        key={topic.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                        }}
                    >
                        <h3>{topic.title}</h3>

                        <p>
                            <strong>Status:</strong> {topic.status}
                        </p>

                        <p>
                            <strong>Lecturer Comment:</strong>{" "}
                            {topic.lecturer_comment || "No comment"}
                        </p>

                        <p>
                            <strong>Supervisor Feedback:</strong>{" "}
                            {topic.supervisor_feedback || "No feedback yet"}
                        </p>
                    </div>
                ))
            )}
        </StudentLayout>
    );
}

export default Feedback;
import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/SupervisorLayout";
import api from "../../services/api";

function Feedback() {
    const [topics, setTopics] = useState([]);
    const [feedback, setFeedback] = useState({});
    const [message, setMessage] = useState("");

    const loadTopics = async () => {
        try {
            const res = await api.get("/topics/assigned");
            setTopics(res.data);

            // Pre-fill existing feedback
            const initialFeedback = {};
            res.data.forEach((topic) => {
                initialFeedback[topic.id] = topic.supervisor_feedback || "";
            });
            setFeedback(initialFeedback);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadTopics();
    }, []);

    const handleSubmit = async (id) => {
        try {
            await api.put(`/topics/${id}/feedback`, {
                supervisor_feedback: feedback[id]
            });

            setMessage("Feedback saved successfully.");
            loadTopics();

        } catch (err) {
            console.error(err);

            setMessage(
                err.response?.data?.message || "Failed to save feedback."
            );
        }
    };

    return (
        <SupervisorLayout>

            <h2>Supervisor Feedback</h2>

            {message && (
                <p style={{ color: "green" }}>
                    {message}
                </p>
            )}

            {topics.length === 0 ? (
                <p>No assigned research topics.</p>
            ) : (
                topics.map((topic) => (

                    <div
                        key={topic.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "20px",
                            marginBottom: "20px",
                            borderRadius: "8px"
                        }}
                    >
                        <h3>{topic.title}</h3>

                        <p>
                            <strong>Student:</strong> {topic.full_name}
                        </p>

                        <p>{topic.description}</p>

                        <textarea
                            rows="5"
                            style={{
                                width: "100%",
                                marginTop: "10px"
                            }}
                            value={feedback[topic.id] || ""}
                            onChange={(e) =>
                                setFeedback({
                                    ...feedback,
                                    [topic.id]: e.target.value
                                })
                            }
                        />

                        <br />
                        <br />

                        <button
                            onClick={() => handleSubmit(topic.id)}
                        >
                            Save Feedback
                        </button>

                    </div>

                ))
            )}

        </SupervisorLayout>
    );
}

export default Feedback;
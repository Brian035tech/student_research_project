import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/SupervisorLayout";
import api from "../../services/api";

function Feedback() {

    const [topics, setTopics] = useState([]);
    const [feedback, setFeedback] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {

        try {

            const res = await api.get("/topics/assigned");

            setTopics(res.data);

            const initialFeedback = {};

            res.data.forEach((topic) => {
                initialFeedback[topic.id] =
                    topic.supervisor_feedback || "";
            });

            setFeedback(initialFeedback);

        } catch (err) {

            console.log(err);

        }

    };

    const handleSubmit = async (id) => {

        try {

            await api.put(`/topics/${id}/feedback`, {

                supervisor_feedback: feedback[id]

            });

            setMessage("Feedback saved successfully.");

            loadTopics();

            setTimeout(() => {

                setMessage("");

            }, 3000);

        } catch (err) {

            console.log(err);

            setMessage(

                err.response?.data?.message ||

                "Failed to save feedback."

            );

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

        <SupervisorLayout>

            <h1>Supervisor Feedback</h1>

            {message && (

                <div
                    style={{
                        background: "#d1fae5",
                        color: "#065f46",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "6px"
                    }}
                >
                    {message}
                </div>

            )}

            {topics.length === 0 ? (

                <div
                    style={{
                        background: "#fff",
                        padding: "30px",
                        borderRadius: "8px",
                        textAlign: "center"
                    }}
                >
                    No assigned research topics.
                </div>

            ) : (

                topics.map((topic) => (

                    <div
                        key={topic.id}
                        style={{
                            background: "#fff",
                            borderRadius: "10px",
                            padding: "25px",
                            marginBottom: "25px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >

                            <h2>{topic.title}</h2>

                            {statusBadge(topic.status)}

                        </div>

                        <hr />

                        <p>

                            <strong>Student:</strong>

                            {" "}

                            {topic.full_name}

                        </p>

                        <p>

                            <strong>Email:</strong>

                            {" "}

                            {topic.email}

                        </p>

                        <p>

                            <strong>Description:</strong>

                        </p>

                        <p>{topic.description}</p>

                        <textarea

                            rows="5"

                            value={feedback[topic.id] || ""}

                            onChange={(e) =>

                                setFeedback({

                                    ...feedback,

                                    [topic.id]: e.target.value

                                })

                            }

                            placeholder="Enter supervisor feedback..."

                            style={{

                                width: "100%",

                                padding: "12px",

                                marginTop: "15px",

                                borderRadius: "6px",

                                border: "1px solid #ccc",

                                resize: "vertical"

                            }}

                        />

                        <br />

                        <button

                            onClick={() => handleSubmit(topic.id)}

                            style={{

                                marginTop: "15px",

                                background: "#198754",

                                color: "#fff",

                                border: "none",

                                padding: "10px 22px",

                                borderRadius: "6px",

                                cursor: "pointer",

                                fontSize: "15px"

                            }}

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
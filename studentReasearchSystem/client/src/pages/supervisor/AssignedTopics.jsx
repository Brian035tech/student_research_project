import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/SupervisorLayout";
import api from "../../services/api";

function AssignedTopics() {

    const [topics, setTopics] = useState([]);
    const [feedback, setFeedback] = useState({});

    useEffect(() => {
        fetchAssignedTopics();
    }, []);

    const fetchAssignedTopics = async () => {

        try {

            const response = await api.get("/topics/assigned");

            setTopics(response.data);

        } catch (error) {

            console.log(error);

        }

    };
    const submitFeedback = async (topicId) => {

    try {

        if (!feedback[topicId]) {
            alert("Please enter feedback.");
            return;
        }

        await api.put(`/topics/${topicId}/feedback`, {
            supervisor_feedback: feedback[topicId]
        });

        alert("Feedback submitted successfully.");

        fetchAssignedTopics();

    } 
catch (error) {

    console.log(error.response);
    console.log(error.response?.data);

    alert(error.response?.data?.message || "Failed to submit feedback.");

}
};

    return (

        <SupervisorLayout>

            <h1>Assigned Research Topics</h1>
<th style={th}>Feedback</th>
<th style={th}>Action</th>
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
                        <th style={th}>Description</th>
                        <th style={th}>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {topics.length === 0 ? (

                        <tr>

                            <td colSpan="5" style={td}>
                                No assigned topics found.
                            </td>

                        </tr>

                    ) : (

                        topics.map((topic) => (

                            <tr key={topic.id}>

                                <td style={td}>{topic.full_name}</td>

                                <td style={td}>{topic.email}</td>

                                <td style={td}>{topic.title}</td>

                                <td style={td}>{topic.description}</td>

                                <td style={td}>{topic.status}</td>
                                <td style={td}>

    <textarea
        rows="3"
        style={{
            width: "100%"
        }}
        placeholder="Enter feedback..."
        value={feedback[topic.id] || ""}
        onChange={(e) =>
            setFeedback({
                ...feedback,
                [topic.id]: e.target.value
            })
        }
    />

</td>

<td style={td}>

    <button
        onClick={() => submitFeedback(topic.id)}
        style={{
            background: "green",
            color: "white",
            border: "none",
            padding: "8px 15px",
            cursor: "pointer",
            borderRadius: "5px"
        }}
    >
        Save Feedback
    </button>

</td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </SupervisorLayout>

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

export default AssignedTopics;
import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";

function FinalSubmission() {
    const [topics, setTopics] = useState([]);
    const [topicId, setTopicId] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {
        try {
            const res = await api.get("/topics");

            const approvedTopics = res.data.filter(
                (topic) => topic.status === "Approved"
            );

            setTopics(approvedTopics);

            if (approvedTopics.length > 0) {
                setTopicId(approvedTopics[0].id);
            }

        } catch (err) {
    console.error("Upload Error:", err);

    if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);

        alert(JSON.stringify(err.response.data));
    } else {
        alert(err.message);
    }
}
    };

    const submitProject = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please choose a file.");
            return;
        }

        const formData = new FormData();
        formData.append("topic_id", topicId);
        formData.append("document", file);

        try {
            const res = await api.post(
                "/submissions",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setMessage(res.data.message);

        } catch (err) {

            console.error("Upload Error:", err);

            if (err.response) {
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);

                alert(err.response.data.message || err.response.data.error);
            } else {
                alert("Upload failed.");
            }
        }
    };

    return (
        <StudentLayout>

            <h1>Final Project Submission</h1>

            {topics.length === 0 ? (
                <p>No approved topic available.</p>
            ) : (
                <form onSubmit={submitProject}>

                    <div>
                        <label>Approved Topic</label>

                        <select
                            value={topicId}
                            onChange={(e) => setTopicId(e.target.value)}
                        >
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <br />

                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    <br />
                    <br />

                    <button type="submit">
                        Upload Final Project
                    </button>

                </form>
            )}

            <br />

            {message && <p>{message}</p>}

        </StudentLayout>
    );
}

export default FinalSubmission;
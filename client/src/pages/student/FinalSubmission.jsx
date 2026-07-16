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

            console.log(err);

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

            setFile(null);

            document.getElementById("fileInput").value = "";

        } catch (err) {

            console.log(err);

            setMessage(
                err.response?.data?.message || "Upload failed."
            );

        }

    };

    return (

        <StudentLayout>

            <h1>Final Project Submission</h1>

            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    marginTop: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    maxWidth: "700px"
                }}
            >

                {topics.length === 0 ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "20px"
                        }}
                    >
                        <h3>No Approved Topic</h3>

                        <p>
                            Your topic must be approved before you can upload
                            your final project.
                        </p>
                    </div>

                ) : (

                    <form onSubmit={submitProject}>

                        <label
                            style={{ fontWeight: "bold" }}
                        >
                            Approved Topic
                        </label>

                        <select
                            value={topicId}
                            onChange={(e) => setTopicId(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "10px",
                                marginBottom: "20px"
                            }}
                        >
                            {topics.map((topic) => (

                                <option
                                    key={topic.id}
                                    value={topic.id}
                                >
                                    {topic.title}
                                </option>

                            ))}
                        </select>

                        <label
                            style={{ fontWeight: "bold" }}
                        >
                            Upload Final Research Document
                        </label>

                        <input
                            id="fileInput"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                                setFile(e.target.files[0])
                            }
                            style={{
                                width: "100%",
                                marginTop: "10px"
                            }}
                        />

                        {file && (

                            <p
                                style={{
                                    color: "#198754",
                                    marginTop: "10px"
                                }}
                            >
                                Selected File: <strong>{file.name}</strong>
                            </p>

                        )}

                        <br />

                        <button
                            type="submit"
                            style={{
                                background: "#1e3a8a",
                                color: "#fff",
                                padding: "12px 30px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
                        >
                            Upload Final Project
                        </button>

                    </form>

                )}

                {message && (

                    <div
                        style={{
                            marginTop: "25px",
                            padding: "15px",
                            background: "#e8f5e9",
                            color: "#2e7d32",
                            borderRadius: "5px"
                        }}
                    >
                        {message}
                    </div>

                )}

            </div>

        </StudentLayout>

    );

}

export default FinalSubmission;
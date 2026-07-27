import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";

function FinalSubmission() {

    const [topics, setTopics] = useState([]);
    const [topicId, setTopicId] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [submission, setSubmission] = useState(null);

    useEffect(() => {
        loadTopics();
        loadSubmission();
    }, []);

    // Load approved topics
    const loadTopics = async () => {

        try {

            const res = await api.get("/topics");

            const approved = res.data.filter(
                topic => topic.status === "Approved"
            );

            setTopics(approved);

            if (approved.length > 0) {
                setTopicId(approved[0].id);
            }

        } catch (err) {
            console.log(err);
        }

    };

    // Load student's submission
    const loadSubmission = async () => {

        try {

            const res = await api.get("/submissions");

            if (res.data.length > 0) {
                setSubmission(res.data[0]);
            }

        } catch (err) {
            console.log(err);
        }

    };

    // Upload project
    const submitProject = async (e) => {

        e.preventDefault();

        if (!file) {

            setMessage("❌ Please select a file first.");
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

            setMessage("✅ " + res.data.message);

            loadSubmission();

            setFile(null);

            document.getElementById("fileInput").value = "";

        } catch (err) {

            console.log(err);

            setMessage(
                "❌ " +
                (
                    err.response?.data?.message ||
                    "Upload failed."
                )
            );

        }

    };

    return (

        <StudentLayout>

            <div className="container-fluid">

                <div
                    className="card border-0 shadow-sm p-4"
                    style={{
                        borderRadius: "22px",
                        maxWidth: "800px"
                    }}
                >

                    <h2 className="fw-bold">
                        📄 Final Project Submission
                    </h2>

                    <p className="text-muted">
                        Upload your approved research project document.
                    </p>

                    {submission ? (

                        <div className="text-center py-5">

                            <h2 className="text-success">
                                ✔ Final Research Submitted
                            </h2>

                            <p className="text-muted mt-3">
                                Your final research has already been submitted successfully.
                            </p>

                            <div className="card mt-4 p-4 bg-light">

                                <p>
                                    <strong>📄 File:</strong><br />
                                    {submission.file_name}
                                </p>

                                <p>
                                    <strong>📅 Submission Date:</strong><br />
                                    {new Date(submission.submitted_at).toLocaleString()}
                                </p>

                                <span className="badge bg-success fs-6">
                                    Submitted
                                </span>

                            </div>

                        </div>

                    ) : topics.length === 0 ? (

                        <div className="text-center py-5">

                            <h3>
                                ⚠️ No Approved Topic
                            </h3>

                            <p className="text-muted">
                                Your research topic must be approved before you can submit your final project.
                            </p>

                        </div>

                    ) : (

                        <form onSubmit={submitProject}>

                            <div className="mb-4">

                                <label className="fw-semibold">
                                    Approved Research Topic
                                </label>

                                <select
                                    className="form-select mt-2"
                                    style={{
                                        padding: "12px",
                                        borderRadius: "12px"
                                    }}
                                    value={topicId}
                                    onChange={(e) => setTopicId(e.target.value)}
                                >

                                    {topics.map(topic => (

                                        <option
                                            key={topic.id}
                                            value={topic.id}
                                        >
                                            {topic.title}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="mb-4">

                                <label className="fw-semibold">
                                    Upload Document
                                </label>

                                <div
                                    className="border rounded p-3 mt-2"
                                    style={{
                                        background: "#f8fafc"
                                    }}
                                >

                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="form-control"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />

                                    {file && (

                                        <div className="mt-3 text-success">

                                            📎 Selected File:
                                            <strong> {file.name}</strong>

                                        </div>

                                    )}

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary px-4 py-2"
                                style={{
                                    borderRadius: "12px",
                                    fontWeight: "600"
                                }}
                            >
                                ⬆ Upload Final Project
                            </button>

                        </form>

                    )}

                    {message && (

                        <div
                            className="alert mt-4"
                            style={{
                                borderRadius: "15px",
                                background: message.includes("❌")
                                    ? "#fee2e2"
                                    : "#dcfce7"
                            }}
                        >
                            {message}
                        </div>

                    )}

                </div>

            </div>

        </StudentLayout>

    );

}

export default FinalSubmission;
import { useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";

function SubmitTopics() {

    const [formData, setFormData] = useState({
        topic_title: "",
        description: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/topics", formData);

            setMessage(response.data.message);

            setFormData({
                topic_title: "",
                description: ""
            });

            setTimeout(() => {
                setMessage("");
            }, 3000);

        } catch (error) {

            if (error.response) {

                setMessage(error.response.data.message);

            } else {

                setMessage("Server Error");

            }

        }

    };

    return (

        <StudentLayout>

            <h1>Submit Research Topic</h1>

            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    marginTop: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    maxWidth: "800px"
                }}
            >

                <p
                    style={{
                        color: "#555",
                        marginBottom: "25px"
                    }}
                >
                    Submit your proposed research topic for lecturer review.
                    You may submit up to three research topics.
                </p>

                {message && (

                    <div
                        style={{
                            background: "#d1fae5",
                            color: "#065f46",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "20px"
                        }}
                    >
                        {message}
                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    <label
                        style={{
                            fontWeight: "bold"
                        }}
                    >
                        Research Topic
                    </label>

                    <input
                        type="text"
                        name="topic_title"
                        value={formData.topic_title}
                        onChange={handleChange}
                        placeholder="Enter research topic"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            marginBottom: "20px",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    />

                    <label
                        style={{
                            fontWeight: "bold"
                        }}
                    >
                        Description
                    </label>

                    <textarea
                        name="description"
                        rows="6"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your research topic..."
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            resize: "vertical"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            marginTop: "25px",
                            background: "#1e3a8a",
                            color: "#fff",
                            border: "none",
                            padding: "12px 30px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                    >
                        Submit Research Topic
                    </button>

                </form>

            </div>

        </StudentLayout>

    );

}

export default SubmitTopics;
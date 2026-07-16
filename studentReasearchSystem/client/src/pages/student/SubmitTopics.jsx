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

            {message && (
                <p
                    style={{
                        color: "green",
                        fontWeight: "bold"
                    }}
                >
                    {message}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    marginTop: "30px",
                    width: "700px"
                }}
            >

                <label>Research Topic</label>

                <input
                    type="text"
                    name="topic_title"
                    value={formData.topic_title}
                    onChange={handleChange}
                    placeholder="Enter Research Topic"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        marginBottom: "20px"
                    }}
                />

                <label>Description</label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe your research topic..."
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px"
                    }}
                />

                <br /><br />

                <button
                    type="submit"
                    style={{
                        background: "#1e3a8a",
                        color: "white",
                        padding: "12px 30px",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px"
                    }}
                >
                    Submit Topic
                </button>

            </form>

        </StudentLayout>

    );

}

export default SubmitTopics;
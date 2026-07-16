import { useEffect, useState } from "react";
import LecturerLayout from "../../components/LecturerLayout";
import api from "../../services/api";

function ManageTopics() {

    const [topics, setTopics] = useState([]);
const [comments, setComments] = useState({});
    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {

        try {

            const response = await api.get("/topics");

console.log(response.data);

setTopics(response.data);

        } catch (error) {
            console.log(error);
        }

    };
    const reviewTopic = async (id, status) => {

    try {
         console.log({
            status,
            lecturer_comment: comments[id] || "",
            supervisor_id: null
        });
console.log("Sending:", {
    status,
    lecturer_comment: comments[id] || "",
    supervisor_id: null
});
        await api.put(`/topics/${id}`, {
            status,
            lecturer_comment: comments[id] || "",
            supervisor_id: null
        });

        alert(`Topic ${status} successfully.`);

        fetchTopics();

    } catch (error) {

        console.log(error);

        alert("Failed to update topic.");

    }

};

    return (

        <LecturerLayout>

            <h1>Manage Research Topics</h1>

            <table
                style={{
                    width: "100%",
                    marginTop: "20px",
                    borderCollapse: "collapse",
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
                        <th style={th}>Comment</th>
                        <th style={th}>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {topics.length === 0 ? (

                        <tr>
                            <td colSpan="7" style={td}>
                                No research topics found.
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
        rows="2"
        style={{
            width: "100%",
            padding: "5px"
        }}
        value={comments[topic.id] || ""}
        onChange={(e) =>
            setComments({
                ...comments,
                [topic.id]: e.target.value
            })
        }
        placeholder="Enter lecturer comment..."
    />
</td>

<td style={td}>
    <button
        onClick={() => reviewTopic(topic.id, "Approved")}
        style={{
            background: "green",
            color: "white",
            border: "none",
            padding: "8px 12px",
            marginRight: "8px",
            cursor: "pointer"
        }}
    >
        Approve
    </button>

    <button
        onClick={() => reviewTopic(topic.id, "Rejected")}
        style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer"
        }}
    >
        Reject
    </button>
</td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </LecturerLayout>

    );

}

const th = {
    padding: "12px",
    border: "1px solid #ddd"
};

const td = {
    padding: "12px",
    border: "1px solid #ddd"
};

export default ManageTopics;
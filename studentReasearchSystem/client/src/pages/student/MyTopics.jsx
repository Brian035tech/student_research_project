import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";

function MyTopics() {

    const [topics, setTopics] = useState([]);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {

        try {

            const response = await api.get("/topics");

            setTopics(response.data);

        } catch (error) {
            console.log(error);
        }

    };

    return (

        <StudentLayout>

            <h1>My Research Topics</h1>

            <table
                style={{
                    width: "100%",
                    marginTop: "30px",
                    borderCollapse: "collapse",
                    background: "#fff"
                }}
            >

                <thead>

                    <tr style={{ background: "#1e3a8a", color: "#fff" }}>

                        <th style={th}>Topic</th>
                        <th style={th}>Description</th>
                        <th style={th}>Status</th>
                       <th style={th}>Lecturer Comment</th>
<th style={th}>Supervisor Feedback</th>
<th style={th}>Date Submitted</th>

                    </tr>

                </thead>

                <tbody>

                    {topics.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                style={{
                                    textAlign: "center",
                                    padding: "20px"
                                }}
                            >
                                No topics submitted.
                            </td>

                        </tr>

                    ) : (

                        topics.map((topic) => (

                            <tr key={topic.id}>

                                <td style={td}>{topic.title}</td>

                                <td style={td}>{topic.description}</td>

                                <td style={td}>{topic.status}</td>

                               <td style={td}>
    {topic.lecturer_comment || "-"}
</td>

<td style={td}>
    {topic.supervisor_feedback || "-"}
</td>

<td style={td}>
    {new Date(topic.created_at).toLocaleDateString()}
</td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </StudentLayout>

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

export default MyTopics;
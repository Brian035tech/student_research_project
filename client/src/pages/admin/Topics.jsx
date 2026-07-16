import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

console.log("NEW TOPICS FILE LOADED");

function Topics() {

    const [topics, setTopics] = useState([]);


    useEffect(() => {

        fetchTopics();

    }, []);



    const fetchTopics = async () => {

        try {

            const res = await api.get("/admin/topics");

            setTopics(res.data);

        } catch (err) {

            console.log(err);

        }

    };



    const statusBadge = (status) => {


        let background = "#6c757d";


        if (status === "Approved") {
            background = "#198754";
        }

        else if (status === "Pending") {
            background = "#ffc107";
        }

        else if (status === "Rejected") {
            background = "#dc3545";
        }



        return (

            <span
                style={{
                    background,
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "14px"
                }}
            >
                {status}
            </span>

        );

    };



    return (

        <AdminLayout>


            <h2>
                Research Topics
            </h2>



            <table

                width="100%"

                style={{

                    borderCollapse: "collapse",
                    marginTop: "20px",
                    background: "white",
                    borderRadius: "10px",
                    overflow: "hidden"

                }}

            >


                <thead>


                    <tr style={{background:"#1f2937", color:"white"}}>

                        <th style={thStyle}>
                            ID
                        </th>


                        <th style={thStyle}>
                            Topic Title
                        </th>


                        <th style={thStyle}>
                            Student
                        </th>


                        <th style={thStyle}>
                            Status
                        </th>


                    </tr>


                </thead>



                <tbody>


                {topics.length > 0 ? (

                    topics.map((topic)=>(


                        <tr key={topic.id}>


                            <td style={tdStyle}>
                                {topic.id}
                            </td>


                            <td style={tdStyle}>
                                {topic.title}
                            </td>


                            <td style={tdStyle}>
                                {topic.student}
                            </td>

<td style={tdStyle}>
    {statusBadge(topic.status)}
</td>

                        </tr>


                    ))


                ) : (


                    <tr>

                        <td
                            colSpan="4"
                            style={{
                                textAlign:"center",
                                padding:"20px"
                            }}
                        >
                            No research topics found.
                        </td>


                    </tr>


                )}


                </tbody>


            </table>


        </AdminLayout>

    );

}



const thStyle = {

    padding:"12px",
    textAlign:"left"

};


const tdStyle = {

    padding:"12px",
    borderBottom:"1px solid #ddd"

};


export default Topics;
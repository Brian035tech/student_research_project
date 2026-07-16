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

            setTopics(response.data);

        } catch (error) {

            console.log(error);

        }

    };



    const reviewTopic = async (id, status) => {


        try {


            await api.put(`/topics/${id}`, {

                status,

                lecturer_comment: comments[id] || "",

                supervisor_id: null

            });



            alert(`Topic ${status} successfully.`);


            fetchTopics();



        } catch(error) {


            console.log(error);

            alert("Failed to update topic.");

        }


    };



    const statusBadge = (status) => {


        let color = "#6c757d";


        if(status === "Approved"){

            color="#198754";

        }

        else if(status === "Pending"){

            color="#ffc107";

        }

        else if(status === "Rejected"){

            color="#dc3545";

        }



        return (

            <span

            style={{

                background:color,

                color:"white",

                padding:"6px 12px",

                borderRadius:"20px",

                fontSize:"13px",

                fontWeight:"bold"

            }}

            >

                {status}

            </span>

        );


    };



    return (


        <LecturerLayout>


            <h1>
                Manage Research Topics
            </h1>



            <table

            style={{

                width:"100%",

                marginTop:"20px",

                borderCollapse:"collapse",

                background:"white"

            }}

            >


                <thead>


                <tr

                style={{

                    background:"#1f2937",

                    color:"white"

                }}

                >


                    <th style={th}>
                        Student
                    </th>


                    <th style={th}>
                        Email
                    </th>


                    <th style={th}>
                        Topic
                    </th>


                    <th style={th}>
                        Description
                    </th>


                    <th style={th}>
                        Status
                    </th>


                    <th style={th}>
                        Comment
                    </th>


                    <th style={th}>
                        Action
                    </th>


                </tr>


                </thead>



                <tbody>


                {topics.length > 0 ? (


                    topics.map((topic)=>(


                        <tr key={topic.id}>


                            <td style={td}>
                                {topic.full_name}
                            </td>


                            <td style={td}>
                                {topic.email}
                            </td>


                            <td style={td}>
                                {topic.title}
                            </td>


                            <td style={td}>
                                {topic.description}
                            </td>


                            <td style={td}>
                                {statusBadge(topic.status)}
                            </td>



                            <td style={td}>


                                <textarea

                                rows="3"

                                value={comments[topic.id] || ""}

                                placeholder="Lecturer comment..."

                                onChange={(e)=>

                                    setComments({

                                        ...comments,

                                        [topic.id]:e.target.value

                                    })

                                }

                                style={{

                                    width:"100%",

                                    padding:"8px",

                                    borderRadius:"5px"

                                }}

                                />


                            </td>



                            <td style={td}>


                                <button

                                onClick={() =>
                                    reviewTopic(topic.id,"Approved")
                                }

                                style={approveBtn}

                                >

                                    Approve

                                </button>



                                <button

                                onClick={() =>
                                    reviewTopic(topic.id,"Rejected")
                                }

                                style={rejectBtn}

                                >

                                    Reject

                                </button>


                            </td>


                        </tr>


                    ))


                ) : (


                    <tr>

                        <td colSpan="7" style={td}>

                            No research topics found.

                        </td>

                    </tr>


                )}



                </tbody>


            </table>



        </LecturerLayout>


    );


}



const th={

    padding:"12px",

    border:"1px solid #ddd",

    textAlign:"left"

};



const td={

    padding:"12px",

    border:"1px solid #ddd"

};



const approveBtn={

    background:"#198754",

    color:"white",

    border:"none",

    padding:"8px 12px",

    marginRight:"8px",

    borderRadius:"5px",

    cursor:"pointer"

};



const rejectBtn={

    background:"#dc3545",

    color:"white",

    border:"none",

    padding:"8px 12px",

    borderRadius:"5px",

    cursor:"pointer"

};



export default ManageTopics;
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


        } catch(error) {


            console.log(error);


        }


    };



    const submitFeedback = async(topicId)=>{


        if(!feedback[topicId]){

            alert("Please enter feedback.");

            return;

        }



        try {


            await api.put(

                `/topics/${topicId}/feedback`,

                {
                    supervisor_feedback: feedback[topicId]
                }

            );


            alert("Feedback submitted successfully.");


            fetchAssignedTopics();



        }catch(error){


            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to submit feedback."
            );


        }


    };



    const statusBadge=(status)=>{


        let color="#6c757d";


        if(status==="Approved"){

            color="#198754";

        }

        else if(status==="Pending"){

            color="#ffc107";

        }

        else if(status==="Rejected"){

            color="#dc3545";

        }



        return (

            <span

            style={{

                background:color,

                color:"white",

                padding:"6px 12px",

                borderRadius:"20px",

                fontSize:"13px"

            }}

            >

                {status}

            </span>

        );


    };



    return (


        <SupervisorLayout>


            <h1>
                Assigned Research Topics
            </h1>



            <table

            style={{

                width:"100%",

                borderCollapse:"collapse",

                marginTop:"20px",

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
                    Feedback
                </th>


                <th style={th}>
                    Action
                </th>


            </tr>


            </thead>



            <tbody>


            {topics.length > 0 ? (


                topics.map(topic=>(


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

                            placeholder="Enter feedback..."

                            value={
                                feedback[topic.id] || ""
                            }

                            onChange={(e)=>

                                setFeedback({

                                    ...feedback,

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
                                submitFeedback(topic.id)
                            }

                            style={buttonStyle}

                            >

                                Save Feedback

                            </button>


                        </td>


                    </tr>


                ))


            ):(


                <tr>

                    <td

                    colSpan="7"

                    style={{

                        textAlign:"center",

                        padding:"20px"

                    }}

                    >

                        No assigned topics found.

                    </td>

                </tr>


            )}



            </tbody>


            </table>



        </SupervisorLayout>


    );

}



const th={

    padding:"12px",

    textAlign:"left",

    borderBottom:"1px solid #ddd"

};


const td={

    padding:"12px",

    borderBottom:"1px solid #ddd"

};


const buttonStyle={

    background:"#198754",

    color:"white",

    border:"none",

    padding:"8px 15px",

    borderRadius:"5px",

    cursor:"pointer"

};



export default AssignedTopics;
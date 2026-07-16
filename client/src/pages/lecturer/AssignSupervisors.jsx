import { useEffect, useState } from "react";
import LecturerLayout from "../../components/LecturerLayout";
import api from "../../services/api";


function AssignSupervisors() {


    const [topics, setTopics] = useState([]);

    const [supervisors, setSupervisors] = useState([]);

    const [selectedSupervisor, setSelectedSupervisor] = useState({});



    useEffect(() => {

        fetchApprovedTopics();

        fetchSupervisors();

    }, []);



    const fetchApprovedTopics = async () => {

        try {

            const response = await api.get("/topics");

            const approved = response.data.filter(
                topic => topic.status === "Approved"
            );

            setTopics(approved);


        } catch(error) {

            console.log(error);

        }

    };



    const fetchSupervisors = async () => {

        try {

            const response = await api.get("/users/supervisors");

            setSupervisors(response.data);


        } catch(error) {

            console.log(error);

        }

    };



    const assignSupervisor = async(topicId)=>{


        const supervisorId = selectedSupervisor[topicId];


        if(!supervisorId){

            alert("Please select a supervisor.");

            return;

        }



        try {


            await api.put(

                `/topics/${topicId}/assign-supervisor`,

                {
                    supervisor_id: supervisorId
                }

            );


            alert("Supervisor assigned successfully.");

            fetchApprovedTopics();



        }catch(error){


            console.log(error);

            alert("Failed to assign supervisor.");

        }


    };



    return (

        <LecturerLayout>


            <h1>
                Assign Supervisors
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
                        Supervisor
                    </th>

                    <th style={th}>
                        Select
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


                        {topic.supervisor_name ? (

                            <span

                            style={{
                                background:"#198754",
                                color:"white",
                                padding:"6px 12px",
                                borderRadius:"20px",
                                fontSize:"13px"
                            }}

                            >

                                {topic.supervisor_name}

                            </span>


                        ):(

                            <span style={{color:"gray"}}>
                                Not Assigned
                            </span>

                        )}


                        </td>



                        <td style={td}>


                        {topic.supervisor_name ? (

                            "Assigned"


                        ):(


                            <select

                            value={
                                selectedSupervisor[topic.id] || ""
                            }

                            onChange={(e)=>

                                setSelectedSupervisor({

                                    ...selectedSupervisor,

                                    [topic.id]:e.target.value

                                })

                            }

                            style={{

                                padding:"8px",

                                borderRadius:"5px"

                            }}

                            >


                                <option value="">
                                    Select Supervisor
                                </option>


                                {supervisors.map(supervisor=>(


                                    <option

                                    key={supervisor.id}

                                    value={supervisor.id}

                                    >

                                        {supervisor.full_name}

                                    </option>


                                ))}


                            </select>


                        )}


                        </td>



                        <td style={td}>


                        {!topic.supervisor_name && (


                            <button

                            onClick={() =>
                                assignSupervisor(topic.id)
                            }

                            style={buttonStyle}

                            >

                                Assign

                            </button>


                        )}


                        </td>


                    </tr>


                ))


            ):(


                <tr>

                    <td

                    colSpan="6"

                    style={{

                        padding:"20px",

                        textAlign:"center"

                    }}

                    >

                        No approved topics found.

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

    textAlign:"left",

    borderBottom:"1px solid #ddd"

};


const td={

    padding:"12px",

    borderBottom:"1px solid #ddd"

};


const buttonStyle={

    background:"#1e3a8a",

    color:"white",

    border:"none",

    padding:"8px 15px",

    borderRadius:"5px",

    cursor:"pointer"

};


export default AssignSupervisors;
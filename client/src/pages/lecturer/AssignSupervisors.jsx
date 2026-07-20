import { useEffect, useState } from "react";
import LecturerLayout from "../../components/LecturerLayout";
import api from "../../services/api";


function AssignSupervisors() {


    const [topics,setTopics] = useState([]);
    const [supervisors,setSupervisors] = useState([]);
    const [selectedSupervisor,setSelectedSupervisor] = useState({});
    const [search,setSearch] = useState("");



    useEffect(()=>{

        fetchApprovedTopics();
        fetchSupervisors();

    },[]);





    const fetchApprovedTopics = async()=>{

        try{

            const response = await api.get("/topics");


            const approved = response.data.filter(
                topic => topic.status === "Approved"
            );


            setTopics(approved);


        }
        catch(error){

            console.log(error);

        }

    };





    const fetchSupervisors = async()=>{

        try{

            const response = await api.get("/users/supervisors");

            setSupervisors(response.data);


        }
        catch(error){

            console.log(error);

        }

    };





    const assignSupervisor = async(topicId)=>{


        const supervisorId =
        selectedSupervisor[topicId];


        if(!supervisorId){

            alert("Please select a supervisor.");

            return;

        }



        try{


            await api.put(

                `/topics/${topicId}/assign-supervisor`,

                {
                    supervisor_id:supervisorId
                }

            );


            alert("Supervisor assigned successfully.");

            fetchApprovedTopics();


        }
        catch(error){

            console.log(error);

            alert("Failed to assign supervisor.");

        }


    };





    const filteredTopics = topics.filter(topic=>

        topic.full_name.toLowerCase()
        .includes(search.toLowerCase())

        ||

        topic.title.toLowerCase()
        .includes(search.toLowerCase())

        ||

        topic.email.toLowerCase()
        .includes(search.toLowerCase())

    );





return(

<LecturerLayout>


<div className="container-fluid">


<div

className="card border-0 shadow-sm p-4"

style={{

borderRadius:"22px"

}}

>


<div className="mb-4">


<h2 className="fw-bold">

👨‍🏫 Assign Supervisors

</h2>


<p className="text-muted">

Assign supervisors to approved research topics

</p>


</div>




<input

className="form-control mb-4"

style={{

borderRadius:"15px",

padding:"12px"

}}

placeholder="🔍 Search student or research topic..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>




<div className="table-responsive">


<table className="table table-hover align-middle">


<thead>


<tr>

<th>Student</th>

<th>Email</th>

<th>Research Topic</th>

<th>Supervisor</th>

<th>Select</th>

<th>Action</th>


</tr>


</thead>




<tbody>


{

filteredTopics.length > 0 ?


filteredTopics.map(topic=>(


<tr key={topic.id}>


<td>

<div className="fw-semibold">

{topic.full_name}

</div>

</td>




<td>

{topic.email}

</td>




<td>

<div className="fw-bold">

{topic.title}

</div>


<small className="text-muted">

Approved Topic

</small>


</td>





<td>


{

topic.supervisor_name ?


<span

style={{

background:"#16a34a",

color:"white",

padding:"7px 14px",

borderRadius:"30px",

fontSize:"13px",

fontWeight:"600"

}}

>

👨‍🏫 {topic.supervisor_name}

</span>



:


<span className="text-muted">

⚪ Not Assigned

</span>


}



</td>





<td>


{

topic.supervisor_name ?


<span className="badge bg-success">

Assigned

</span>



:


<select

className="form-select"

value={selectedSupervisor[topic.id] || ""}


onChange={(e)=>

setSelectedSupervisor({

...selectedSupervisor,

[topic.id]:e.target.value

})

}


>


<option value="">

Select Supervisor

</option>



{

supervisors.map(supervisor=>(


<option

key={supervisor.id}

value={supervisor.id}

>

{supervisor.full_name}

</option>


))


}


</select>


}



</td>





<td>


{

!topic.supervisor_name &&


<button

className="btn btn-primary btn-sm"

onClick={()=>assignSupervisor(topic.id)}

>

👨‍🏫 Assign

</button>


}



</td>




</tr>


))


:


<tr>


<td

colSpan="6"

className="text-center py-5 text-muted"

>

No approved topics found.

</td>


</tr>


}



</tbody>



</table>


</div>


</div>


</div>


</LecturerLayout>


);


}


export default AssignSupervisors;
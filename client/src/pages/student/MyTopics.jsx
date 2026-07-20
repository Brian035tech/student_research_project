import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";


function MyTopics() {


    const [topics,setTopics] = useState([]);
    const [search,setSearch] = useState("");



    useEffect(()=>{

        fetchTopics();

    },[]);





    const fetchTopics = async()=>{

        try{

            const response = await api.get("/topics");

            setTopics(response.data);

        }
        catch(error){

            console.log(error);

        }

    };





    const statusBadge=(status)=>{


        const styles={

            Approved:{
                bg:"#16a34a",
                icon:"✅"
            },

            Pending:{
                bg:"#eab308",
                icon:"⏳"
            },

            Rejected:{
                bg:"#dc2626",
                icon:"❌"
            }

        };



        const current =
        styles[status] || {

            bg:"#64748b",

            icon:""

        };



        return(

            <span

            style={{

                background:current.bg,

                color:"white",

                padding:"7px 15px",

                borderRadius:"30px",

                fontSize:"13px",

                fontWeight:"600"

            }}

            >

                {current.icon} {status}

            </span>

        );


    };





    const filteredTopics = topics.filter(topic=>

        topic.title.toLowerCase()
        .includes(search.toLowerCase())

        ||

        topic.status.toLowerCase()
        .includes(search.toLowerCase())

    );





return(

<StudentLayout>


<div className="container-fluid">


<div

className="card border-0 shadow-sm p-4"

style={{

borderRadius:"22px"

}}

>


<div className="mb-4">


<h2 className="fw-bold">

📚 My Research Topics

</h2>


<p className="text-muted">

Track your submitted topics, approval status and feedback.

</p>


</div>





<input

className="form-control mb-4"

style={{

borderRadius:"15px",

padding:"12px"

}}

placeholder="🔍 Search topic or status..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>






<div className="table-responsive">


<table className="table table-hover align-middle">


<thead>


<tr>


<th>Topic</th>

<th>Status</th>

<th>Lecturer Comment</th>

<th>Supervisor Feedback</th>

<th>Date</th>


</tr>


</thead>




<tbody>


{

filteredTopics.length > 0 ?


filteredTopics.map(topic=>(


<tr key={topic.id}>


<td>


<div className="fw-bold">

{topic.title}

</div>


<small className="text-muted">

{topic.description}

</small>


</td>





<td>

{statusBadge(topic.status)}

</td>





<td>


<div

style={{

background:"#eff6ff",

padding:"10px",

borderRadius:"10px"

}}

>

{

topic.lecturer_comment ||

<span className="text-muted">

No comment

</span>

}


</div>


</td>





<td>


<div

style={{

background:"#f0fdf4",

padding:"10px",

borderRadius:"10px"

}}

>

{

topic.supervisor_feedback ||

<span className="text-muted">

No feedback

</span>

}


</div>


</td>





<td>


📅{" "}

{

new Date(topic.created_at)

.toLocaleDateString(
"en-KE",
{

day:"numeric",

month:"short",

year:"numeric"

}

)

}


</td>




</tr>


))


:


<tr>


<td

colSpan="5"

className="text-center py-5 text-muted"

>

No research topics submitted.

</td>


</tr>


}



</tbody>



</table>


</div>


</div>


</div>


</StudentLayout>

);


}


export default MyTopics;
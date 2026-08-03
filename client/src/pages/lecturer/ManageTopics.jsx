import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LecturerLayout from "../../components/LecturerLayout";
import api from "../../services/api";


function ManageTopics() {

    const [searchParams] = useSearchParams();

const selectedStatus = searchParams.get("status");

    const [topics,setTopics] = useState([]);
    const [comments,setComments] = useState({});
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




    const reviewTopic = async(id,status)=>{

        try{


            await api.put(`/topics/${id}`,{

                status,

                lecturer_comment:comments[id] || "",

                supervisor_id:null

            });



            alert(`Topic ${status} successfully.`);


            fetchTopics();


        }
        catch(error){

            console.log(error);

            alert("Failed to update topic.");

        }


    };

const filteredTopics = topics.filter((topic) => {

  // Filter by status from the dashboard URL
  const matchesStatus =
    !selectedStatus ||
    topic.status
      ?.trim()
      .toLowerCase() ===
    selectedStatus
      ?.trim()
      .toLowerCase();

  // Filter by the search box
  const searchText =
    search
      .trim()
      .toLowerCase();

  const matchesSearch =
    topic.title
      ?.toLowerCase()
      .includes(searchText)

    ||

    topic.full_name
      ?.toLowerCase()
      .includes(searchText)

    ||

    topic.email
      ?.toLowerCase()
      .includes(searchText);

  // Both filters must match
  return (
    matchesStatus &&
    matchesSearch
  );

});

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

                padding:"7px 14px",

                borderRadius:"30px",

                fontSize:"13px",

                fontWeight:"600"

            }}

            >

                {current.icon} {status}

            </span>

        );


    };



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

📚 {
  selectedStatus
    ? `${selectedStatus.charAt(0).toUpperCase()}${selectedStatus.slice(1)} Research Topics`
    : "Manage Research Topics"
}

</h2>


<p className="text-muted">

Review and manage student research proposals

</p>


</div>




<input

className="form-control mb-4"

style={{

borderRadius:"15px",

padding:"12px"

}}

placeholder="🔍 Search student, email or topic..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>




<div className="table-responsive">


<table className="table align-middle table-hover">


<thead>


<tr>


<th>Student Details</th>
<th>Research Topic</th>
<th>Status</th>
<th>Comment</th>
<th>Action</th>

</tr>


</thead>




<tbody>


{

filteredTopics.length > 0 ?


filteredTopics.map(topic=>(


<tr key={topic.id}>


<td>
    <strong>{topic.full_name}</strong>
    <br />

    <small>
        ID: {topic.student_id}
    </small>

    <br />

    <small>
        {topic.school}
    </small>

    <br />

    <small>
        {topic.department}
    </small>

    <br />

    <small>
        {topic.course}
    </small>

    <br />

    <small>
        {topic.email}</small>
</td>


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


<textarea

rows="2"

className="form-control"

placeholder="Lecturer comment..."

value={comments[topic.id] || ""}

onChange={(e)=>

setComments({

...comments,

[topic.id]:e.target.value

})

}

/>


</td>




<td>


<button

className="btn btn-success btn-sm me-2"

onClick={()=>reviewTopic(topic.id,"Approved")}

>

✅ Approve

</button>



<button

className="btn btn-danger btn-sm"

onClick={()=>reviewTopic(topic.id,"Rejected")}

>

❌ Reject

</button>



</td>



</tr>


))


:


<tr>

<td

colSpan="6"

className="text-center py-5 text-muted"

>

No research topics found.

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



export default ManageTopics;
import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/SupervisorLayout";
import api from "../../services/api";


function Feedback() {

    const [topics,setTopics] = useState([]);
    const [feedback,setFeedback] = useState({});
    const [message,setMessage] = useState("");
    const [search,setSearch] = useState("");



    useEffect(()=>{

        loadTopics();

    },[]);




    const loadTopics = async()=>{

        try{

            const res = await api.get("/topics/assigned");

            setTopics(res.data);


            const initialFeedback={};


            res.data.forEach(topic=>{

                initialFeedback[topic.id] =
                topic.supervisor_feedback || "";

            });


            setFeedback(initialFeedback);


        }
        catch(err){

            console.log(err);

        }

    };





    const handleSubmit = async(id)=>{

        try{


            await api.put(`/topics/${id}/feedback`,{

                supervisor_feedback:feedback[id]

            });


            setMessage(
                "✅ Feedback saved successfully."
            );


            loadTopics();



            setTimeout(()=>{

                setMessage("");

            },3000);


        }
        catch(err){


            console.log(err);


            setMessage(
                err.response?.data?.message ||
                "Failed to save feedback."
            );


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
        styles[status] ||
        {
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

        topic.full_name.toLowerCase()
        .includes(search.toLowerCase())

    );




return(

<SupervisorLayout>


<div className="container-fluid">


<div className="card border-0 shadow-sm p-4"

style={{

borderRadius:"22px"

}}

>


<h2 className="fw-bold mb-2">

💬 Supervisor Feedback

</h2>


<p className="text-muted">

Provide guidance and feedback to assigned students

</p>




{
message &&

<div

className="alert alert-success"

>

{message}

</div>

}




<input

className="form-control mb-4"

style={{

borderRadius:"15px",

padding:"12px"

}}

placeholder="🔍 Search student or topic..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>




{

filteredTopics.length === 0 ?


(

<div className="text-center text-muted py-5">

No assigned research topics.

</div>

)



:


filteredTopics.map(topic=>(


<div

key={topic.id}

className="card border-0 shadow-sm mb-4 p-4"

style={{

borderRadius:"18px"

}}

>



<div className="d-flex justify-content-between align-items-center">


<div>

<h4 className="fw-bold">

📚 {topic.title}

</h4>


</div>



{statusBadge(topic.status)}


</div>



<hr/>




<div className="row">


<div className="col-md-6">


<p>

<strong>Student:</strong>

<br/>

{topic.full_name}

</p>


<p>

<strong>Email:</strong>

<br/>

{topic.email}

</p>


</div>



<div className="col-md-6">


<p>

<strong>Description:</strong>

</p>


<p className="text-muted">

{topic.description}

</p>


</div>


</div>





<textarea

className="form-control mt-3"

rows="5"

placeholder="Enter supervisor feedback..."

value={feedback[topic.id] || ""}

onChange={(e)=>

setFeedback({

...feedback,

[topic.id]:e.target.value

})

}


/>




<button

className="btn btn-success mt-3"

onClick={()=>handleSubmit(topic.id)}

>

💾 Save Feedback

</button>



</div>


))


}



</div>


</div>


</SupervisorLayout>


);


}


export default Feedback;
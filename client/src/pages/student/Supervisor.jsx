import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";


function Supervisor() {


    const [supervisor,setSupervisor] = useState(null);
    const [loading,setLoading] = useState(true);



    useEffect(()=>{

        fetchSupervisor();

    },[]);





    const fetchSupervisor = async()=>{

        try{

            const res = await api.get("/topics/supervisor");

            setSupervisor(res.data);

        }
        catch(err){

            console.log(err);

            setSupervisor(null);

        }
        finally{

            setLoading(false);

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

                padding:"8px 16px",

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

<StudentLayout>


<div className="container-fluid">


<div

className="card border-0 shadow-sm p-4"

style={{

borderRadius:"22px",

maxWidth:"800px"

}}

>


<h2 className="fw-bold mb-2">

👨‍🏫 Assigned Supervisor

</h2>


<p className="text-muted">

Your research supervisor and approved topic details.

</p>





{

loading ?


<div className="text-center py-5 text-muted">

Loading supervisor details...

</div>



:


supervisor ?



(


<>


<div

className="text-center mb-4"

>


<div

style={{

width:"100px",

height:"100px",

borderRadius:"50%",

background:"#2563eb",

color:"white",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:"38px",

fontWeight:"700",

margin:"auto"

}}

>

{

supervisor.supervisor_name

.charAt(0)

.toUpperCase()

}

</div>




<h3 className="fw-bold mt-3">

{supervisor.supervisor_name}

</h3>



<span className="text-muted">

Research Supervisor

</span>



</div>






<div className="card border-0 bg-light p-3 mb-3"

style={{

borderRadius:"15px"

}}

>


<h5 className="fw-bold">

📧 Contact Information

</h5>


<p className="mb-1">

<strong>Email:</strong>

{" "}

{supervisor.supervisor_email}

</p>


</div>







<div className="card border-0 bg-light p-3"

style={{

borderRadius:"15px"

}}

>


<h5 className="fw-bold">

📚 Approved Research Topic

</h5>


<p className="fw-semibold">

{supervisor.title}

</p>



<p>

Status:

{" "}

{statusBadge(supervisor.status)}

</p>



</div>


</>




)


:


<div

className="text-center py-5"

>


<h3>

No Supervisor Assigned

</h3>


<p className="text-muted">

Your research topic has not yet been assigned to a supervisor.
Please wait for lecturer assignment.

</p>


</div>


}



</div>


</div>


</StudentLayout>

);


}


export default Supervisor;
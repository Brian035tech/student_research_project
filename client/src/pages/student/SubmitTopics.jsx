import { useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";


function SubmitTopics() {


    const [formData,setFormData] = useState({

        topic_title:"",
        description:""

    });


    const [message,setMessage] = useState("");




    const handleChange=(e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };





    const handleSubmit=async(e)=>{

        e.preventDefault();


        try{


            const response = await api.post(
                "/topics",
                formData
            );


            setMessage(
                "✅ " + response.data.message
            );


            setFormData({

                topic_title:"",

                description:""

            });



            setTimeout(()=>{

                setMessage("");

            },3000);


        }
        catch(error){


            if(error.response){

                setMessage(
                    "❌ " + error.response.data.message
                );

            }
            else{

                setMessage(
                    "❌ Server Error"
                );

            }


        }


    };





return(

<StudentLayout>


<div className="container-fluid">


<div

className="card border-0 shadow-sm p-4"

style={{

borderRadius:"22px",

maxWidth:"850px"

}}

>


<div className="mb-4">


<h2 className="fw-bold">

📝 Submit Research Topic

</h2>


<p className="text-muted">

Submit your proposed research topic for lecturer approval.

</p>


</div>




<div

className="alert alert-info"

style={{

borderRadius:"15px"

}}

>

📌 You may submit up to <strong>three research topics</strong>.
Your lecturer will review and approve one topic.

</div>





{

message &&


<div

className="alert alert-success"

style={{

borderRadius:"15px"

}}

>

{message}

</div>


}





<form onSubmit={handleSubmit}>


<label className="fw-semibold">

Research Topic

</label>


<input

type="text"

name="topic_title"

className="form-control mt-2 mb-4"

style={{

padding:"13px",

borderRadius:"12px"

}}

placeholder="Enter your research topic"

value={formData.topic_title}

onChange={handleChange}

required

/>





<label className="fw-semibold">

Description

</label>



<textarea

name="description"

rows="6"

className="form-control mt-2"

style={{

padding:"13px",

borderRadius:"12px",

resize:"vertical"

}}

placeholder="Explain your research idea, objectives and expected outcome..."

value={formData.description}

onChange={handleChange}

required

/>





<button

type="submit"

className="btn btn-primary mt-4 px-4 py-2"

style={{

borderRadius:"12px",

fontWeight:"600"

}}

>

🚀 Submit Topic

</button>



</form>


</div>


</div>


</StudentLayout>

);


}


export default SubmitTopics;
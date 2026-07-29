import { useEffect, useState } from "react";
import api from "../../services/api";
import SupervisorLayout from "../../components/SupervisorLayout";


function FinalDraftReview(){

    const [submissions, setSubmissions] = useState([]);
    const [feedback, setFeedback] = useState({});


    useEffect(()=>{

        loadSubmissions();

    },[]);



    const loadSubmissions = async()=>{

        try{

            const res = await api.get(
                "/submissions/supervisor"
            );

            setSubmissions(res.data);


        }catch(err){

            console.log(err);

        }

    };



    const approveDraft = async(id)=>{

        try{

            await api.put(
                `/submissions/${id}/approve`,
                {
                    feedback:
                    feedback[id] || "Final draft approved."
                }
            );


            loadSubmissions();


        }catch(err){

            console.log(err);

        }

    };



    const requestRevision = async(id)=>{

        try{

            await api.put(
                `/submissions/${id}/revision`,
                {
                    feedback:
                    feedback[id]
                }
            );


            loadSubmissions();


        }catch(err){

            console.log(err);

        }

    };

    const downloadDraft = async (id, fileName) => {

    try {

        const response = await api.get(
            `/submissions/download/${id}`,
            {
                responseType: "blob"
            }
        );

        const fileUrl = window.URL.createObjectURL(
            new Blob([response.data])
        );

        const link = document.createElement("a");

        link.href = fileUrl;

        link.setAttribute(
            "download",
            fileName || "Final_Draft"
        );

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(fileUrl);

    } catch (error) {

        console.log(
            "Final draft download error:",
            error
        );

        alert(
            "Unable to download the final draft."
        );

    }

};


    return (

        <SupervisorLayout>


        <div className="container-fluid">


        <h2 className="mb-4">
            📄 Final Draft Reviews
        </h2>



        {
            submissions.length === 0 ?

            <div className="alert alert-info">
                No final drafts awaiting review.
            </div>

            :

            submissions.map((item)=>(


            <div
                key={item.id}
                className="card shadow-sm mb-3 p-4"
            >


                <h5>
                    {item.full_name}
                </h5>


                <p>
                    <strong>Topic:</strong>
                    <br/>
                    {item.title}
                </p>


                <p>
                    <strong>Status:</strong>
                    <br/>

                    <span className="badge bg-warning">
                        {item.status}
                    </span>

                </p>


                <button
    type="button"
    className="btn btn-outline-primary mb-3"
    onClick={() =>
        downloadDraft(
            item.id,
            item.file_name
        )
    }
>
    ⬇ Download Draft
</button>



                <textarea
                    className="form-control mb-3"
                    placeholder="Supervisor feedback..."
                    value={feedback[item.id] || ""}
                    onChange={(e)=>
                        setFeedback({

                        ...feedback,

                        [item.id]:
                        e.target.value

                        })
                    }
                />



                <button
                    className="btn btn-success me-2"
                    onClick={()=>
                        approveDraft(item.id)
                    }
                >
                    ✅ Approve
                </button>


                <button
                    className="btn btn-warning"
                    onClick={()=>
                        requestRevision(item.id)
                    }
                >
                    🔄 Request Revision
                </button>



            </div>


            ))

        }


        </div>


        </SupervisorLayout>

    );

}


export default FinalDraftReview;
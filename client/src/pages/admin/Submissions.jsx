import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";


function Submissions() {

    const [submissions, setSubmissions] = useState([]);
    const [search, setSearch] = useState("");


    useEffect(() => {

        fetchSubmissions();

    }, []);



    const fetchSubmissions = async () => {

        try {

            const res = await api.get("/admin/submissions");

            setSubmissions(res.data);

        } catch(err) {

            console.log(err);

            alert("Failed to load submissions.");

        }

    };



    const formatDate = (date)=>{

        if(!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-KE",
            {
                day:"numeric",
                month:"short",
                year:"numeric"
            }
        );

    };



    const filteredSubmissions = submissions.filter((submission)=>

        submission.full_name
        .toLowerCase()
        .includes(search.toLowerCase())

        ||

        submission.file_name
        .toLowerCase()
        .includes(search.toLowerCase())

    );



    return (

        <AdminLayout>


        <div className="container-fluid">


        <div

        className="card border-0 shadow-sm p-4"

        style={{

            borderRadius:"22px"

        }}

        >



        <div className="d-flex justify-content-between align-items-center mb-4">


            <div>

                <h2 className="fw-bold">

                    📄 Final Submissions

                </h2>


                <p className="text-muted mb-0">

                    Review and download student final research documents

                </p>

            </div>



            <span className="badge bg-primary px-3 py-2">

                Total: {submissions.length}

            </span>


        </div>




        <input

            className="form-control mb-4"

            style={{

                borderRadius:"15px",

                padding:"12px"

            }}

            placeholder="🔍 Search student or file name..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

        />





        <div className="table-responsive">


        <table className="table table-hover align-middle">


        <thead>


        <tr>

            <th>#</th>

            <th>Student</th>

            <th>Document</th>

            <th>Date Submitted</th>

            <th>Action</th>

        </tr>


        </thead>




        <tbody>


        {

        filteredSubmissions.length > 0 ?


        filteredSubmissions.map((submission)=>(


        <tr key={submission.id}>


            <td>

                {submission.id}

            </td>



            <td>

                <div className="fw-semibold">

                    {submission.full_name}

                </div>

            </td>



            <td>


                <span

                style={{

                    background:"#2563eb",

                    color:"white",

                    padding:"8px 14px",

                    borderRadius:"30px",

                    fontSize:"13px",

                    fontWeight:"600"

                }}

                >

                    📄 {submission.file_name}

                </span>


            </td>




            <td>

                <span className="text-muted">

                    📅 {formatDate(submission.submitted_at)}

                </span>

            </td>




            <td>


                <a

                href={submission.download_url}

                target="_blank"

                rel="noopener noreferrer"

                download={submission.file_name}

                >

                <button

                className="btn btn-success btn-sm"

                >

                    ⬇ Download

                </button>


                </a>


            </td>



        </tr>


        ))



        :



        (

        <tr>

            <td

            colSpan="5"

            className="text-center py-5 text-muted"

            >

                No final submissions found.

            </td>

        </tr>

        )


        }



        </tbody>



        </table>


        </div>


        </div>


        </div>



        </AdminLayout>

    );

}


export default Submissions;
import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";


function Submissions() {


    const [submissions, setSubmissions] = useState([]);



    useEffect(() => {

        fetchSubmissions();

    }, []);



    const fetchSubmissions = async () => {


        try {


            const res = await api.get("/admin/submissions");

            setSubmissions(res.data);


        } catch (err) {


            console.log(err);

            alert("Failed to load submissions.");


        }


    };



    const formatDate = (date) => {

        if(!date) return "-";

        return new Date(date).toLocaleDateString();

    };



    return (


        <AdminLayout>


            <h2>
                Final Submissions
            </h2>



            <table

                width="100%"

                style={{

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


                        <th style={thStyle}>
                            ID
                        </th>


                        <th style={thStyle}>
                            Student
                        </th>


                        <th style={thStyle}>
                            File Name
                        </th>


                        <th style={thStyle}>
                            Date Submitted
                        </th>


                    </tr>


                </thead>



                <tbody>


                {submissions.length > 0 ? (


                    submissions.map((submission)=>(


                        <tr key={submission.id}>


                            <td style={tdStyle}>
                                {submission.id}
                            </td>



                            <td style={tdStyle}>
                                {submission.full_name}
                            </td>



                            <td style={tdStyle}>


                                <span

                                style={{
                                    background:"#0d6efd",
                                    color:"white",
                                    padding:"6px 12px",
                                    borderRadius:"20px",
                                    fontSize:"13px"
                                }}

                                >

                                    📄 {submission.file_name}

                                </span>


                            </td>



                            <td style={tdStyle}>
                                {formatDate(submission.submitted_at)}
                            </td>


                        </tr>


                    ))


                ) : (


                    <tr>

                        <td

                        colSpan="4"

                        style={{
                            textAlign:"center",
                            padding:"20px"
                        }}

                        >

                            No final submissions found.

                        </td>

                    </tr>


                )}



                </tbody>


            </table>



        </AdminLayout>


    );


}



const thStyle = {

    padding:"12px",
    textAlign:"left"

};



const tdStyle = {

    padding:"12px",
    borderBottom:"1px solid #ddd"

};



export default Submissions;
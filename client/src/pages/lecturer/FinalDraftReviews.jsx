import { useEffect, useState } from "react";
import api from "../../services/api";
import LecturerLayout from "../../components/LecturerLayout";

function FinalDraftReviews() {

    const [submissions, setSubmissions] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadSubmissions();
    }, []);


    // Load final drafts approved by supervisors
    const loadSubmissions = async () => {

        try {

            const res = await api.get(
                "/submissions/lecturer"
            );

            console.log(
                "Lecturer final drafts:",
                res.data
            );

            setSubmissions(res.data);

        } catch (err) {

            console.log(
                "Error loading final drafts:",
                err
            );

            setMessage(
                "❌ " +
                (
                    err.response?.data?.message ||
                    "Failed to load final drafts."
                )
            );

        }

    };


    // Lecturer approves a final draft
    const approveFinalDraft = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to approve this final draft?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const res = await api.put(
                `/submissions/lecturer/approve/${id}`
            );

            setMessage(
                "✅ " + res.data.message
            );

            // Remove approved draft from the list
            setSubmissions(
                submissions.filter(
                    submission =>
                        submission.id !== id
                )
            );

        } catch (err) {

            console.log(
                "Approval error:",
                err
            );

            setMessage(
                "❌ " +
                (
                    err.response?.data?.message ||
                    "Failed to approve final draft."
                )
            );

        }

    };


    // Download final draft
    const downloadDraft = async (
        id,
        fileName
    ) => {

        try {

            const response = await api.get(
                `/submissions/download/${id}`,
                {
                    responseType: "blob"
                }
            );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                fileName
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.log(
                "Download error:",
                err
            );

            setMessage(
                "❌ Failed to download the final draft."
            );

        }

    };


    return (

        <LecturerLayout>

            <div className="container-fluid">

                <div
                    className="card border-0 shadow-sm p-4"
                    style={{
                        borderRadius: "22px"
                    }}
                >

                    <h2 className="fw-bold">
                        📄 Final Draft Reviews
                    </h2>

                    <p className="text-muted">
                        Review final research drafts approved
                        by supervisors.
                    </p>


                    {message && (

                        <div
                            className={
                                message.includes("❌")
                                    ? "alert alert-danger"
                                    : "alert alert-success"
                            }
                        >
                            {message}
                        </div>

                    )}


                    {submissions.length === 0 ? (

                        <div className="text-center py-5">

                            <h4>
                                📭 No Final Drafts Available
                            </h4>

                            <p className="text-muted">
                                No supervisor-approved final
                                drafts are waiting for lecturer
                                review.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Research Topic
                                        </th>

                                        <th>
                                            File
                                        </th>

                                        <th>
                                            Supervisor Feedback
                                        </th>

                                        <th>
                                            Submitted
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {submissions.map(
                                        submission => (

                                        <tr
                                            key={
                                                submission.id
                                            }
                                        >

                                            <td>
                                                {
                                                    submission
                                                        .student_name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    submission
                                                        .topic_title
                                                }
                                            </td>

                                            <td>
                                                {
                                                    submission
                                                        .file_name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    submission
                                                        .supervisor_feedback ||
                                                    "No feedback provided."
                                                }
                                            </td>

                                            <td>
                                                {
                                                    new Date(
                                                        submission
                                                            .submitted_at
                                                    ).toLocaleString()
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() =>
                                                        downloadDraft(
                                                            submission.id,
                                                            submission.file_name
                                                        )
                                                    }
                                                >
                                                    ⬇ Download
                                                </button>

                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() =>
                                                        approveFinalDraft(
                                                            submission.id
                                                        )
                                                    }
                                                >
                                                    ✔ Approve
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </LecturerLayout>

    );

}

export default FinalDraftReviews;
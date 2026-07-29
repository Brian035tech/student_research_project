import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/SupervisorLayout";
import api from "../../services/api";

function SupervisorProposals() {


const [proposals, setProposals] = useState([]);
const [message, setMessage] = useState("");
const [feedback, setFeedback] = useState({});

useEffect(() => {
    loadProposals();
}, []);

// Load proposals assigned to the logged-in supervisor
const loadProposals = async () => {

    try {

        const res = await api.get("/proposals/assigned");

        setProposals(res.data);

    } catch (err) {

        console.log("Error loading proposals:", err);

        setMessage(
            "❌ " +
            (
                err.response?.data?.message ||
                "Failed to load proposals."
            )
        );

    }

};

const reviewProposal = async (
    proposalId,
    reviewStatus,
    feedback
) => {

    if (
        reviewStatus === "Revision Required" &&
        !feedback.trim()
    ) {

        setMessage(
            "❌ Please provide corrections before requesting a revision."
        );

        return;

    }

    try {

        const res = await api.put(
            "/proposals/review",
            {
                proposal_id: proposalId,
                review_status: reviewStatus,
                supervisor_feedback: feedback
            }
        );

        setMessage("✅ " + res.data.message);

        // Reload proposals to show the new status
        loadProposals();

    } catch (err) {

        console.log("Proposal review error:", err);

        setMessage(
            "❌ " +
            (
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to review the proposal."
            )
        );

    }

};

return (

    <SupervisorLayout>

        <div className="container-fluid">

            <div
                className="card border-0 shadow-sm p-4"
                style={{
                    borderRadius: "22px"
                }}
            >

                <h2 className="fw-bold">
                    📝 Research Proposal Review
                </h2>

                <p className="text-muted">
                    Review research proposals submitted by your assigned students.
                </p>

                {message && (

                    <div
                        className="alert mt-3"
                        style={{
                            borderRadius: "12px",
                            background: "#fee2e2"
                        }}
                    >
                        {message}
                    </div>

                )}

                {proposals.length === 0 ? (

                    <div className="text-center py-5">

                        <h4>
                            📭 No Proposals Available
                        </h4>

                        <p className="text-muted">
                            No research proposals have been submitted by your assigned students.
                        </p>

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-light">

                               <tr>

    <th>Student</th>
    <th>Research Topic</th>
    <th>Proposal File</th>
    <th>Status</th>
    <th>Submitted</th>
    <th>Review Action</th>

</tr>

                            </thead>

                            <tbody>

                                {proposals.map((proposal) => (

                                    <tr key={proposal.id}>

                                        <td>

                                            <strong>
                                                {proposal.student_name}
                                            </strong>

                                            <br />

                                            <small className="text-muted">
                                                {proposal.student_email}
                                            </small>

                                        </td>

                                        <td>
                                            {proposal.title}
                                        </td>

                                        <td>

    <a
        href={`http://localhost:5000/uploads/${proposal.file_name}`}
        target="_blank"
        rel="noreferrer"
        className="btn btn-sm btn-outline-primary"
    >

        ⬇ Download Proposal

    </a>

</td>

                                        <td>

                                            <span
                                                className={
                                                    proposal.review_status === "Approved"
                                                        ? "badge bg-success"
                                                        : proposal.review_status === "Revision Required"
                                                        ? "badge bg-warning text-dark"
                                                        : "badge bg-primary"
                                                }
                                            >

                                                {proposal.review_status}

                                            </span>

                                        </td>

                                        <td>

                                            {new Date(
                                                proposal.submitted_at
                                            ).toLocaleString()}

                                        </td>

                                        <td style={{ minWidth: "280px" }}>

    {proposal.review_status === "Pending" ? (

        <>

            <textarea
                className="form-control mb-2"
                rows="3"
                placeholder="Enter feedback or corrections..."
                value={feedback[proposal.id] || ""}
                onChange={(e) =>
                    setFeedback({
                        ...feedback,
                        [proposal.id]: e.target.value
                    })
                }
            />

            <div className="d-flex gap-2">

                <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() =>
                        reviewProposal(
                            proposal.id,
                            "Approved",
                            feedback[proposal.id] || ""
                        )
                    }
                >
                    ✔ Approve
                </button>

                <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                        reviewProposal(
                            proposal.id,
                            "Revision Required",
                            feedback[proposal.id] || ""
                        )
                    }
                >
                    ↩ Request Revision
                </button>

            </div>

        </>

    ) : (

        <div>

            <strong>Supervisor Feedback:</strong>

            <p className="mb-0 mt-1">

                {proposal.supervisor_feedback ||
                    "No feedback provided."}

            </p>

        </div>

    )}

</td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    </SupervisorLayout>

);


}

export default SupervisorProposals;

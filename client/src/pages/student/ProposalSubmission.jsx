import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";

function ProposalSubmission() {

const [topics, setTopics] = useState([]);
const [topicId, setTopicId] = useState("");
const [file, setFile] = useState(null);
const [message, setMessage] = useState("");
const [proposal, setProposal] = useState(null);
useEffect(() => {
    loadTopics();
    loadProposal();
}, []);

// Load approved topics that have an assigned supervisor
const loadTopics = async () => {

    try {

        const res = await api.get("/topics");

        console.log("Topics returned:", res.data);

        const approved = res.data.filter(
            topic =>
                topic.status === "Approved" &&
                topic.supervisor_id
        );

        setTopics(approved);

        if (approved.length > 0) {
            setTopicId(approved[0].id);
        }

    }catch (err) {

    console.log("Loading topics error:", err);

    console.log(
        "Server response:",
        err.response?.data
    );

    console.log(
        "Status:",
        err.response?.status
    );

}

};

const loadProposal = async () => {

    try {

        const res = await api.get("/proposals/my-proposal");

        if (res.data) {
            setProposal(res.data);
        }

    } catch (err) {

        console.log(
            "Error loading proposal:",
            err
        );

    }

};
// Upload proposal
const submitProposal = async (e) => {

    e.preventDefault();

 if (proposal && proposal.review_status !== "Revision Required") {

    setMessage("❌ You already submitted a proposal.");

    return;

}

    if (!file) {

        setMessage("❌ Please select a proposal file first.");
        return;

    }

    const formData = new FormData();

    formData.append("topic_id", topicId);
    formData.append("file", file);

    try {

        const res = await api.post(
            "/proposals/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        setMessage("✅ " + res.data.message);

setProposal({
    title: topics.find(
        t => t.id === Number(topicId)
    )?.title,
    review_status: "Pending",
    supervisor_feedback: null
});

setFile(null);

const input = document.getElementById("proposalFileInput");

if (input) {
    input.value = "";
}

    } catch (err) {

        console.log(err);

        setMessage(
            "❌ " +
            (
                err.response?.data?.message ||
                "Proposal upload failed."
            )
        );

    }
};

const handleResubmit = () => {

    setProposal(null);
    setMessage("");
};

return (

    <StudentLayout>

        <div className="container-fluid">

            <div
                className="card border-0 shadow-sm p-4"
                style={{
                    borderRadius: "22px",
                    maxWidth: "800px"
                }}
            >

                <h2 className="fw-bold">
                    📝 Research Proposal Submission
                </h2>

                <p className="text-muted">
                    Submit your research proposal for review by your assigned supervisor.
                </p>

                {proposal ? (


<div className="py-4">

  <h4 className="fw-bold">
    📝 Proposal Review Status
</h4>

    <div
        className="card border-0 bg-light p-4 mt-3"
        style={{
            borderRadius: "15px"
        }}
    >

        <p>
            <strong>Research Topic:</strong><br />
            {proposal.title}
        </p>

        <p>
            <strong>Proposal Status:</strong><br />

            <span
                className={
                    proposal.review_status === "Approved"
                        ? "badge bg-success fs-6"
                        : proposal.review_status === "Revision Required"
                        ? "badge bg-warning text-dark fs-6"
                        : "badge bg-primary fs-6"
                }
            >
                {proposal.review_status}
            </span>
        </p>

        <p>
            <strong>Supervisor Feedback:</strong><br />

            {proposal.supervisor_feedback ||
                "Your proposal is awaiting review by the supervisor."}
        </p>

{
    proposal.review_status === "Revision Required" && (

        <button
            className="btn btn-warning mt-3"
            onClick={handleResubmit}
        >
            🔄 Resubmit Proposal
        </button>

    )
}
    </div>

</div>


) : topics.length === 0 ? (


<div className="text-center py-5">

    <h3>
        ⚠️ No Eligible Research Topic
    </h3>

    <p className="text-muted">
        Your research topic must be approved and assigned
        to a supervisor before you can submit a proposal.
    </p>

</div>


) : (


<form onSubmit={submitProposal}>

    <div className="mb-4">

        <label className="fw-semibold">
            Approved Research Topic
        </label>

        <select
            className="form-select mt-2"
            value={topicId}
            onChange={(e) =>
                setTopicId(e.target.value)
            }
        >

            {topics.map((topic) => (

                <option
                    key={topic.id}
                    value={topic.id}
                >
                    {topic.title}
                </option>

            ))}

        </select>

    </div>

    <div className="mb-4">

        <label className="fw-semibold">
            Upload Research Proposal
        </label>

        <input
            id="proposalFileInput"
            type="file"
            className="form-control mt-2"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
                setFile(e.target.files[0])
            }
        />

        {file && (

            <p className="text-success mt-2">

                📎 Selected File:
                <strong> {file.name}</strong>

            </p>

        )}

    </div>

    <button
        type="submit"
        className="btn btn-primary"
    >
        ⬆ Submit Proposal for Review
    </button>

</form>


)}

                {message && (

                    <div
                        className="alert mt-4"
                        style={{
                            borderRadius: "15px",
                            background: message.includes("❌")
                                ? "#fee2e2"
                                : "#dcfce7"
                        }}
                    >
                        {message}
                    </div>

                )}

            </div>

        </div>

    </StudentLayout>

);

}

export default ProposalSubmission;

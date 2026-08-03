import { useEffect, useState } from "react";
import api from "../../services/api";
import SupervisorLayout from "../../components/SupervisorLayout";

function ConceptPapers() {
const [papers, setPapers] = useState([]);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");
const [feedbacks, setFeedbacks] = useState({});
const [reviewingId, setReviewingId] = useState(null);

useEffect(() => {
getConceptPapers();
}, []);

const getConceptPapers = async () => {
try {
setLoading(true);


  const response = await api.get(
    "/concept-papers/supervisor"
  );

  setPapers(response.data);

  const existingFeedbacks = {};

  response.data.forEach((paper) => {
    existingFeedbacks[paper.id] =
      paper.supervisor_feedback || "";
  });

  setFeedbacks(existingFeedbacks);

  setMessage("");

} catch (error) {
  console.error(
    error.response?.data || error.message
  );

  setMessage(
    "Failed to load concept papers."
  );

} finally {
  setLoading(false);
}


};

const handleFeedbackChange = (
paperId,
value
) => {
setFeedbacks((previousFeedbacks) => ({
...previousFeedbacks,
[paperId]: value
}));
};

const reviewPaper = async (
paperId,
status
) => {
const feedback =
feedbacks[paperId] || "";


if (!feedback.trim()) {
  alert(
    "Please enter supervisor feedback."
  );

  return;
}

try {
  setReviewingId(paperId);

  const response = await api.put(
    `/concept-papers/review/${paperId}`,
    {
      status: status,
      supervisor_feedback:
        feedback.trim()
    }
  );

  alert(response.data.message);

  await getConceptPapers();

} catch (error) {
  console.error(
    error.response?.data || error.message
  );

  alert(
    error.response?.data?.message ||
    "Failed to review concept paper."
  );

} finally {
  setReviewingId(null);
}


};

if (loading) {
return ( <SupervisorLayout> <div className="card shadow-sm border-0"> <div className="card-body"> <p className="mb-0">
Loading concept papers... </p> </div> </div> </SupervisorLayout>
);
}

return ( <SupervisorLayout> <div className="card shadow-sm border-0"> <div className="card-body">


      <h3 className="fw-bold">
        📑 Concept Paper Reviews
      </h3>

      <p className="text-muted">
        Review concept papers submitted
        by your assigned students.
      </p>

      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      {papers.length === 0 ? (
        <div className="alert alert-info">
          No concept papers have been
          submitted yet.
        </div>
      ) : (
        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Student Details</th>
                <th>Research Topic</th>
                <th>Concept Paper</th>
                <th>Status</th>
                <th>Review</th>
              </tr>
            </thead>

            <tbody>

              {papers.map((paper) => (

                <tr key={paper.id}>

                  <td>
                    <strong>
                      {paper.full_name}
                    </strong>

                    <br />

                    <small className="text-muted">
                      {paper.email}
                    </small>
                  </td>

                  <td>
                    <strong>
                      ID:
                    </strong>{" "}
                    {paper.student_id}

                    <br />

                    {paper.school}

                    <br />

                    {paper.department}

                    <br />

                    {paper.course}
                  </td>

                  <td>
                    <strong>
                      {paper.title}
                    </strong>

                    <br />

                    <small className="text-muted">
                      {paper.description}
                    </small>
                  </td>

                  <td>
                    {paper.file_name ? (
                      <a
                        href={
                          `http://localhost:5000/uploads/${paper.file_name}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        📥 Download
                      </a>
                    ) : (
                      <span className="text-muted">
                        No file
                      </span>
                    )}
                  </td>

                  <td>
                    <span
                      className={
                        paper.status === "Approved"
                          ? "badge bg-success"

                          : paper.status ===
                            "Revision Required"
                          ? "badge bg-warning text-dark"

                          : "badge bg-secondary"
                      }
                    >
                      {paper.status}
                    </span>
                  </td>

                  <td style={{ minWidth: "250px" }}>

                    <textarea
                      className="form-control mb-2"
                      rows="4"
                      placeholder="Enter feedback..."
                      value={
                        feedbacks[paper.id] || ""
                      }
                      onChange={(event) =>
                        handleFeedbackChange(
                          paper.id,
                          event.target.value
                        )
                      }
                    />

                    <div className="d-flex gap-2">

                      <button
                        className="btn btn-success btn-sm"
                        disabled={
                          reviewingId === paper.id
                        }
                        onClick={() =>
                          reviewPaper(
                            paper.id,
                            "Approved"
                          )
                        }
                      >
                        {reviewingId === paper.id
                          ? "Saving..."
                          : "✓ Approve"}
                      </button>

                      <button
                        className="btn btn-warning btn-sm"
                        disabled={
                          reviewingId === paper.id
                        }
                        onClick={() =>
                          reviewPaper(
                            paper.id,
                            "Revision Required"
                          )
                        }
                      >
                        {reviewingId === paper.id
                          ? "Saving..."
                          : "↻ Request Revision"}
                      </button>

                    </div>

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

export default ConceptPapers;

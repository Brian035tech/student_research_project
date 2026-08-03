import { useEffect, useState } from "react";
import api from "../../services/api";
import StudentLayout from "../../components/StudentLayout";

function ConceptPaper() {
const [file, setFile] = useState(null);
const [paper, setPaper] = useState(null);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(true);
const [uploading, setUploading] = useState(false);

useEffect(() => {
getConceptPaper();
}, []);

const getConceptPaper = async () => {
try {
setLoading(true);


  const response = await api.get(
    "/concept-papers/student"
  );

  setPaper(response.data);

} catch (error) {
  console.error(
    error.response?.data || error.message
  );

  /*
   If the student has not submitted a concept
   paper, the upload form will be displayed.
  */

  if (
    error.response?.status !== 404
  ) {
    setMessage(
      error.response?.data?.message ||
      "Failed to load concept paper information."
    );
  }

} finally {
  setLoading(false);
}


};

const handleSubmit = async (event) => {
event.preventDefault();


if (!file) {
  setMessage(
    "Please select a concept paper before uploading."
  );

  return;
}

const formData = new FormData();

formData.append(
  "conceptPaper",
  file
);

try {
  setUploading(true);
  setMessage("");

  /*
   The backend should update the existing
   record when revision is required instead
   of creating a second submission.
  */

  const response = await api.post(
    "/concept-papers/upload",
    formData
  );

  setMessage(
    response.data.message
  );

  setFile(null);

  document.getElementById(
    "conceptPaperFile"
  ).value = "";

  await getConceptPaper();

} catch (error) {
  console.error(
    error.response?.data || error.message
  );

  setMessage(
    error.response?.data?.message ||
    "Concept paper upload failed."
  );

} finally {
  setUploading(false);
}


};

if (loading) {
return ( <StudentLayout> <div className="card shadow-sm border-0"> <div className="card-body p-4">
Loading concept paper information... </div> </div> </StudentLayout>
);
}

const status = paper?.status;

const canUpload =
!paper ||
status === "Revision Required";

return ( <StudentLayout>


  <div className="card shadow-sm border-0">

    <div className="card-body p-4">

      <h3 className="fw-bold">
        📑 Concept Paper Submission
      </h3>

      <p className="text-muted">
        Submit your concept paper for
        review by your assigned supervisor.
      </p>

      {message && (
        <div
          className={
            message
              .toLowerCase()
              .includes("success")
              ? "alert alert-success"
              : "alert alert-danger"
          }
        >
          {message}
        </div>
      )}

      {/* PENDING STATUS */}

      {paper &&
        status === "Pending" && (

        <div className="alert alert-info">

          <h5>
            ⏳ Concept Paper Under Review
          </h5>

          <p className="mb-0">
            Your concept paper has been
            submitted successfully and is
            awaiting review by your
            supervisor.
          </p>

        </div>

      )}

      {/* REVISION REQUIRED */}

      {paper &&
        status === "Revision Required" && (

        <div className="alert alert-warning">

          <h5>
            ↻ Revision Required
          </h5>

          <p>
            Your supervisor has requested
            changes to your concept paper.
            Please read the feedback below,
            make the required corrections,
            and upload the revised document.
          </p>

          <hr />

          <strong>
            Supervisor Feedback:
          </strong>

          <p className="mb-0 mt-2">
            {
              paper.supervisor_feedback ||
              "No feedback was provided."
            }
          </p>

        </div>

      )}

      {/* APPROVED STATUS */}

      {paper &&
        status === "Approved" && (

        <div className="alert alert-success">

          <h5>
            ✓ Concept Paper Approved
          </h5>

          <p className="mb-0">
            Your concept paper has been
            approved by your supervisor.
            You may now proceed to the
            proposal submission stage.
          </p>

        </div>

      )}

      {/* UPLOAD OR RESUBMISSION FORM */}

      {canUpload && (

        <form
          onSubmit={handleSubmit}
        >

          <div className="mb-3">

            <label
              className="form-label fw-bold"
            >

              {
                status ===
                "Revision Required"

                ? "Upload Revised Concept Paper"

                : "Select Concept Paper"
              }

            </label>

            <input

              id="conceptPaperFile"

              type="file"

              className="form-control"

              accept=".pdf,.doc,.docx"

              onChange={(event) =>
                setFile(
                  event.target.files[0]
                )
              }

              required

            />

            <small
              className="text-muted"
            >

              Allowed formats:
              PDF, DOC and DOCX.

            </small>

          </div>

          <button

            type="submit"

            className="btn btn-primary"

            disabled={uploading}

          >

            {
              uploading

              ? "Uploading..."

              : status ===
                "Revision Required"

              ? "Submit Revised Concept Paper"

              : "Upload Concept Paper"
            }

          </button>

        </form>

      )}

    </div>

  </div>

</StudentLayout>


);
}

export default ConceptPaper;

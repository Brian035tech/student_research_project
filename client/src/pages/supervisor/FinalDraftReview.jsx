import { useEffect, useState } from "react";
import api from "../../services/api";
import SupervisorLayout from "../../components/SupervisorLayout";

function FinalDraftReview() {


const [submissions, setSubmissions] =
    useState([]);

const [feedback, setFeedback] =
    useState({});

const [loading, setLoading] =
    useState(true);

const [processingId, setProcessingId] =
    useState(null);


useEffect(() => {

    loadSubmissions();

}, []);


const loadSubmissions = async () => {

    try {

        setLoading(true);

        const res = await api.get(
            "/submissions/supervisor"
        );

        setSubmissions(res.data);

    } catch (err) {

        console.log(
            "Failed to load final drafts:",
            err
        );

        alert(
            "Failed to load final drafts."
        );

    } finally {

        setLoading(false);

    }

};


const approveDraft = async (id) => {

    try {

        setProcessingId(id);

        const response = await api.put(
            `/submissions/${id}/approve`,
            {
                feedback:
                    feedback[id]?.trim()
                    ||
                    "Final draft approved."
            }
        );

        alert(
            response.data.message
            ||
            "Final draft approved successfully."
        );

        await loadSubmissions();

    } catch (err) {

        console.log(
            "Approval error:",
            err
        );

        alert(
            err.response?.data?.message
            ||
            "Failed to approve the final draft."
        );

    } finally {

        setProcessingId(null);

    }

};


const requestRevision = async (id) => {

    const revisionFeedback =
        feedback[id]?.trim();


    // Feedback is compulsory
    // when requesting revision

    if (!revisionFeedback) {

        alert(
            "Please enter feedback explaining the required revisions before continuing."
        );

        return;

    }


    try {

        setProcessingId(id);

        const response = await api.put(
            `/submissions/${id}/revision`,
            {
                feedback:
                    revisionFeedback
            }
        );

        alert(
            response.data.message
            ||
            "Revision request sent successfully."
        );

        await loadSubmissions();

    } catch (err) {

        console.log(
            "Revision request error:",
            err
        );

        alert(
            err.response?.data?.message
            ||
            "Failed to request revision."
        );

    } finally {

        setProcessingId(null);

    }

};


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

        const fileUrl =
            window.URL.createObjectURL(
                new Blob([
                    response.data
                ])
            );

        const link =
            document.createElement("a");

        link.href =
            fileUrl;

        link.setAttribute(
            "download",
            fileName
            ||
            "Final_Draft"
        );

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
            fileUrl
        );

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


if (loading) {

    return (

        <SupervisorLayout>

            <div className="container-fluid">

                <div className="card shadow-sm p-4">

                    Loading final drafts...

                </div>

            </div>

        </SupervisorLayout>

    );

}


return (

    <SupervisorLayout>

        <div className="container-fluid">


            <h2 className="mb-4">

                📄 Final Draft Reviews

            </h2>


            {
                submissions.length === 0

                ?

                <div className="alert alert-info">

                    No final drafts awaiting review.

                </div>

                :

                submissions.map(
                    (item) => (

                    <div

                        key={item.id}

                        className=
                        "card shadow-sm mb-3 p-4"

                    >


                        <h5>

                            {item.full_name}

                        </h5>


                        <p>

                            <strong>

                                Topic:

                            </strong>

                            <br />

                            {item.title}

                        </p>


                        <p>

                            <strong>

                                Status:

                            </strong>

                            <br />

                            <span
                                className=
                                "badge bg-warning"
                            >

                                {item.status}

                            </span>

                        </p>


                        <button

                            type="button"

                            className=
                            "btn btn-outline-primary mb-3"

                            onClick={() =>

                                downloadDraft(

                                    item.id,

                                    item.file_name

                                )

                            }

                        >

                            ⬇ Download Draft

                        </button>


                        <label
                            className=
                            "form-label fw-bold"
                        >

                            Supervisor Feedback

                        </label>


                        <textarea

                            className=
                            "form-control mb-2"

                            rows="5"

                            placeholder={
                                "Explain what the student should correct or improve..."
                            }

                            value={
                                feedback[item.id]
                                ||
                                ""
                            }

                            onChange={
                                (event) =>

                                setFeedback({

                                    ...feedback,

                                    [item.id]:

                                    event.target
                                    .value

                                })

                            }

                        />


                        <small
                            className=
                            "text-muted d-block mb-3"
                        >

                            Feedback is required
                            when requesting a
                            revision.

                        </small>


                        <div
                            className=
                            "d-flex gap-2"
                        >


                            <button

                                className=
                                "btn btn-success"

                                disabled={
                                    processingId
                                    ===
                                    item.id
                                }

                                onClick={() =>

                                    approveDraft(
                                        item.id
                                    )

                                }

                            >

                                {
                                    processingId
                                    ===
                                    item.id

                                    ?

                                    "Processing..."

                                    :

                                    "✅ Approve"

                                }

                            </button>


                            <button

                                className=
                                "btn btn-warning"

                                disabled={
                                    processingId
                                    ===
                                    item.id
                                }

                                onClick={() =>

                                    requestRevision(
                                        item.id
                                    )

                                }

                            >

                                {
                                    processingId
                                    ===
                                    item.id

                                    ?

                                    "Processing..."

                                    :

                                    "🔄 Request Revision"

                                }

                            </button>


                        </div>


                    </div>

                ))

            }


        </div>

    </SupervisorLayout>

);


}

export default FinalDraftReview;

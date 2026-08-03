import { useEffect, useState } from "react";
import StudentLayout from "../../components/StudentLayout";
import api from "../../services/api";

function FinalSubmission() {


const [topics, setTopics] = useState([]);

const [topicId, setTopicId] = useState("");

const [file, setFile] = useState(null);

const [message, setMessage] = useState("");

const [submissions, setSubmissions] = useState([]);

const [loading, setLoading] = useState(true);

const [uploading, setUploading] = useState(false);


useEffect(() => {

    loadTopics();

    loadSubmissions();

}, []);


// Load approved research topics

const loadTopics = async () => {

    try {

        const res =
            await api.get("/topics");

        const approved =
            res.data.filter(

                (topic) =>
                    topic.status ===
                    "Approved"

            );

        setTopics(approved);


        if (
            approved.length > 0
        ) {

            setTopicId(
                approved[0].id
            );

        }

    } catch (error) {

        console.log(
            "Topic loading error:",
            error
        );

    }

};


// Load all student drafts

const loadSubmissions = async () => {

    try {

        setLoading(true);


        const res =
            await api.get(
                "/submissions"
            );


        if (
            Array.isArray(
                res.data
            )
        ) {

            setSubmissions(
                res.data
            );

        } else if (
            res.data
        ) {

            setSubmissions([
                res.data
            ]);

        } else {

            setSubmissions([]);

        }

    } catch (error) {

        console.log(
            "Draft loading error:",
            error
        );

        setSubmissions([]);

    } finally {

        setLoading(false);

    }

};


// Find a draft by stage

const getDraft = (
    stage
) => {

    return submissions.find(

        (item) =>

            item.draft_stage ===
            stage

    );

};


const firstDraft =
    getDraft(
        "First Draft"
    );


const secondDraft =
    getDraft(
        "Second Draft"
    );


const finalDraft =
    getDraft(
        "Final Draft"
    );


/*
Determine the current
draft stage.
*/

let currentStage =
    "First Draft";


let currentSubmission =
    firstDraft;


if (

    firstDraft &&

    firstDraft.status ===
    "Supervisor Approved"

) {

    currentStage =
        "Second Draft";

    currentSubmission =
        secondDraft;

}


if (

    secondDraft &&

    secondDraft.status ===
    "Supervisor Approved"

) {

    currentStage =
        "Final Draft";

    currentSubmission =
        finalDraft;

}


/*
The student can upload when:

1. The current stage has
   not been submitted.

OR

2. Revision is required.
*/

const canUpload =

    !currentSubmission

    ||

    currentSubmission.status ===
    "Revision Required";


// Upload a draft

const submitProject =
async (event) => {

    event.preventDefault();


    if (!file) {

        setMessage(

            "❌ Please select a file first."

        );

        return;

    }


    const formData =
        new FormData();


    formData.append(

        "topic_id",

        topicId

    );


    formData.append(

        "document",

        file

    );


    formData.append(

        "draft_stage",

        currentStage

    );


    try {

        setUploading(true);

        setMessage("");


        const res =
            await api.post(

                "/submissions",

                formData,

                {

                    headers: {

                        "Content-Type":
                        "multipart/form-data"

                    }

                }

            );


        setMessage(

            "✅ " +

            res.data.message

        );


        setFile(null);


        const fileInput =
            document.getElementById(
                "fileInput"
            );


        if (fileInput) {

            fileInput.value = "";

        }


        await loadSubmissions();


    } catch (error) {

        console.log(

            "Draft upload error:",

            error

        );


        setMessage(

            "❌ " +

            (

                error.response
                ?.data
                ?.message

                ||

                error.response
                ?.data
                ?.error

                ||

                "Upload failed."

            )

        );

    } finally {

        setUploading(false);

    }

};


// Status badge

const getStatusClass =
(status) => {

    if (

        status ===
        "Lecturer Approved"

    ) {

        return (
            "badge bg-success fs-6"
        );

    }


    if (

        status ===
        "Supervisor Approved"

    ) {

        return (
            "badge bg-primary fs-6"
        );

    }


    if (

        status ===
        "Revision Required"

    ) {

        return (
            "badge bg-warning " +
            "text-dark fs-6"
        );

    }


    return (
        "badge bg-secondary fs-6"
    );

};


if (loading) {

    return (

        <StudentLayout>

            <div className="container-fluid">

                <div className="card border-0 shadow-sm p-4">

                    Loading draft information...

                </div>

            </div>

        </StudentLayout>

    );

}


return (

    <StudentLayout>

        <div className="container-fluid">


            <div

                className="card border-0 shadow-sm p-4"

                style={{

                    borderRadius:
                    "22px",

                    maxWidth:
                    "800px"

                }}

            >


                <h2 className="fw-bold">

                    📄 Research Draft Submission

                </h2>


                <p className="text-muted">

                    Submit each research
                    draft in sequence.

                    The current draft must
                    be approved before the
                    next stage is unlocked.

                </p>


                {/* Draft progress */}

                <div className="card bg-light p-3 mb-4">

                    <strong>

                        Draft Progress

                    </strong>


                    <div className="mt-2">

                        <span>

                            {

                                firstDraft
                                ?.status ===

                                "Supervisor Approved"

                                ?

                                "✅"

                                :

                                "⏳"

                            }

                            {" "}

                            1st Draft

                        </span>


                        <span className="mx-2">

                            →

                        </span>


                        <span>

                            {

                                secondDraft
                                ?.status ===

                                "Supervisor Approved"

                                ?

                                "✅"

                                :

                                "🔒"

                            }

                            {" "}

                            2nd Draft

                        </span>


                        <span className="mx-2">

                            →

                        </span>


                        <span>

                            {

                                finalDraft
                                ?.status ===

                                "Supervisor Approved"

                                ||

                                finalDraft
                                ?.status ===

                                "Lecturer Approved"

                                ?

                                "✅"

                                :

                                "🔒"

                            }

                            {" "}

                            Final Draft

                        </span>

                    </div>

                </div>


                {

                    topics.length === 0

                    ?

                    <div className="alert alert-warning">

                        <h4>

                            ⚠️ No Approved Topic

                        </h4>


                        Your research topic
                        must be approved
                        before you can
                        submit a draft.

                    </div>


                    :


                    finalDraft

                    &&

                    (

                        finalDraft.status ===

                        "Supervisor Approved"

                        ||

                        finalDraft.status ===

                        "Lecturer Approved"

                    )

                    ?


                    <div className="text-center py-4">


                        <h3 className="text-success">

                            ✅ Final Draft
                            Approved

                        </h3>


                        <p className="text-muted">

                            Your research
                            draft process
                            has been
                            completed.

                        </p>


                        <span

                            className={

                                getStatusClass(

                                    finalDraft
                                    .status

                                )

                            }

                        >

                            {

                                finalDraft
                                .status

                            }

                        </span>


                    </div>


                    :


                    <>


                        {

                            currentStage ===

                            "Second Draft"

                            &&

                            firstDraft
                            ?.status ===

                            "Supervisor Approved"

                            &&

                            !secondDraft

                            &&


                            <div className="alert alert-success">

                                <strong>

                                    ✅ 1st Draft
                                    Approved

                                </strong>

                                <br />

                                Your supervisor
                                has approved
                                your 1st Draft.

                                You may now
                                submit your
                                2nd Draft.

                            </div>

                        }


                        {

                            currentStage ===

                            "Final Draft"

                            &&

                            secondDraft
                            ?.status ===

                            "Supervisor Approved"

                            &&

                            !finalDraft

                            &&


                            <div className="alert alert-success">

                                <strong>

                                    ✅ 2nd Draft
                                    Approved

                                </strong>

                                <br />

                                Your supervisor
                                has approved
                                your 2nd Draft.

                                You may now
                                submit your
                                Final Draft.

                            </div>

                        }


                        {

                            currentSubmission

                            &&

                            !canUpload

                            &&


                            <div className="card bg-light p-4">


                                <h4>

                                    📄 {

                                        currentStage

                                    }

                                </h4>


                                <p>

                                    <strong>

                                        File:

                                    </strong>

                                    <br />

                                    {

                                        currentSubmission
                                        .file_name

                                    }

                                </p>


                                <p>

                                    <strong>

                                        Status:

                                    </strong>

                                    <br />

                                    <span

                                        className={

                                            getStatusClass(

                                                currentSubmission
                                                .status

                                            )

                                        }

                                    >

                                        {

                                            currentSubmission
                                            .status

                                        }

                                    </span>

                                </p>


                                <p className="text-muted">

                                    Your draft is
                                    awaiting
                                    supervisor
                                    review.

                                </p>


                            </div>

                        }


                        {

                            currentSubmission

                            &&

                            currentSubmission
                            .status ===

                            "Revision Required"

                            &&


                            <div className="alert alert-warning">


                                <strong>

                                    🔄 Revision
                                    Required

                                </strong>


                                <br />


                                {

                                    currentSubmission
                                    .supervisor_feedback

                                    ||

                                    "Please review the supervisor feedback and upload a corrected draft."

                                }


                            </div>

                        }


                        {

                            canUpload

                            &&


                            <form
                                onSubmit={
                                    submitProject
                                }
                            >


                                <h4 className="mb-3">

                                    Upload {

                                        currentSubmission
                                        ?.status ===

                                        "Revision Required"

                                        ?

                                        "Corrected "

                                        :

                                        ""

                                    }

                                    {

                                        currentStage

                                    }

                                </h4>


                                <div className="mb-4">


                                    <label className="fw-semibold">

                                        Approved
                                        Research Topic

                                    </label>


                                    <select

                                        className="form-select mt-2"

                                        value={
                                            topicId
                                        }

                                        onChange={
                                            (event) =>

                                            setTopicId(

                                                event
                                                .target
                                                .value

                                            )

                                        }

                                    >


                                        {

                                            topics.map(

                                                (
                                                    topic
                                                ) =>

                                                <option

                                                    key={
                                                        topic.id
                                                    }

                                                    value={
                                                        topic.id
                                                    }

                                                >

                                                    {
                                                        topic.title
                                                    }

                                                </option>

                                            )

                                        }


                                    </select>


                                </div>


                                <div className="mb-4">


                                    <label className="fw-semibold">

                                        Upload {

                                            currentStage

                                        }

                                    </label>


                                    <input

                                        id="fileInput"

                                        type="file"

                                        className="form-control mt-2"

                                        accept=".pdf,.doc,.docx"

                                        onChange={
                                            (event) =>

                                            setFile(

                                                event
                                                .target
                                                .files[0]

                                            )

                                        }

                                    />


                                    {

                                        file

                                        &&


                                        <div className="mt-3 text-success">


                                            📎 Selected
                                            File:

                                            <strong>

                                                {" "}

                                                {
                                                    file.name
                                                }

                                            </strong>


                                        </div>

                                    }


                                </div>


                                <button

                                    type="submit"

                                    className="btn btn-primary"

                                    disabled={
                                        uploading
                                    }

                                >


                                    {

                                        uploading

                                        ?

                                        "Uploading..."

                                        :

                                        "⬆ Upload " +

                                        currentStage

                                    }


                                </button>


                            </form>

                        }


                    </>

                }


                {

                    message

                    &&


                    <div

                        className={

                            message.includes(
                                "❌"
                            )

                            ?

                            "alert alert-danger mt-4"

                            :

                            "alert alert-success mt-4"

                        }

                    >

                        {

                            message

                        }

                    </div>

                }


            </div>

        </div>

    </StudentLayout>

);


}

export default FinalSubmission;

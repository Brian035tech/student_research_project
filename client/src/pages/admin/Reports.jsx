import { useEffect, useState } from "react";

import AdminLayout from "../../components/AdminLayout";

import api from "../../services/api";

function Reports() {


const [

    topicReport,

    setTopicReport

] = useState({});


const [

    progressReport,

    setProgressReport

] = useState([]);


const [

    submissionReport,

    setSubmissionReport

] = useState([]);


const [

    loading,

    setLoading

] = useState(true);


useEffect(

    () => {

        loadReports();

    },

    []

);


const loadReports = async () => {


    try {


        setLoading(true);


        const [

            topics,

            progress,

            submissions

        ] = await Promise.all([


            api.get(
                "/reports/topics"
            ),


            api.get(
                "/reports/progress"
            ),


            api.get(
                "/reports/submissions"
            )


        ]);


        setTopicReport(

            topics.data

        );


        setProgressReport(

            progress.data

        );


        setSubmissionReport(

            submissions.data

        );


    } catch (

        error

    ) {


        console.log(

            "Report loading error:",

            error

        );


    } finally {


        setLoading(false);


    }


};


if (

    loading

) {


    return (


        <AdminLayout>


            <div className="container-fluid">


                <div

                    className="
                    card
                    shadow-sm
                    border-0
                    p-4
                    "

                >


                    Loading reports...


                </div>


            </div>


        </AdminLayout>


    );


}


return (


    <AdminLayout>


        <div className="container-fluid">


            {/* PAGE HEADER */}


            <div

                className="
                d-flex
                justify-content-between
                align-items-center
                mb-4
                "

            >


                <div>


                    <h2 className="fw-bold">


                        📊 System Reports


                    </h2>


                    <p className="text-muted">


                        View research topics,

                        student progress,

                        and submission reports.


                    </p>


                </div>


                <button

                    className="
                    btn
                    btn-primary
                    "

                    onClick={

                        loadReports

                    }

                >


                    🔄 Refresh


                </button>


            </div>


            {/* TOPIC SUMMARY */}


            <div className="row mb-4">


                <div className="col-md-3 mb-3">


                    <div

                        className="
                        card
                        shadow-sm
                        border-0
                        h-100
                        "

                    >


                        <div className="card-body">


                            <small>

                                Total Topics

                            </small>


                            <h2>


                                {

                                    topicReport
                                    .total_topics

                                    ||

                                    0

                                }


                            </h2>


                        </div>


                    </div>


                </div>


                <div className="col-md-3 mb-3">


                    <div

                        className="
                        card
                        shadow-sm
                        border-0
                        h-100
                        "

                    >


                        <div className="card-body">


                            <small>

                                Approved

                            </small>


                            <h2

                                className="
                                text-success
                                "

                            >


                                {

                                    topicReport
                                    .approved_topics

                                    ||

                                    0

                                }


                            </h2>


                        </div>


                    </div>


                </div>


                <div className="col-md-3 mb-3">


                    <div

                        className="
                        card
                        shadow-sm
                        border-0
                        h-100
                        "

                    >


                        <div className="card-body">


                            <small>

                                Pending

                            </small>


                            <h2

                                className="
                                text-warning
                                "

                            >


                                {

                                    topicReport
                                    .pending_topics

                                    ||

                                    0

                                }


                            </h2>


                        </div>


                    </div>


                </div>


                <div className="col-md-3 mb-3">


                    <div

                        className="
                        card
                        shadow-sm
                        border-0
                        h-100
                        "

                    >


                        <div className="card-body">


                            <small>

                                Rejected

                            </small>


                            <h2

                                className="
                                text-danger
                                "

                            >


                                {

                                    topicReport
                                    .rejected_topics

                                    ||

                                    0

                                }


                            </h2>


                        </div>


                    </div>


                </div>


            </div>


            {/* STUDENT PROGRESS REPORT */}


            <div

                className="
                card
                shadow-sm
                border-0
                mb-4
                "

            >


                <div

                    className="
                    card-header
                    bg-primary
                    text-white
                    "

                >


                    Student Research Progress


                </div>


                <div className="table-responsive">


                    <table

                        className="
                        table
                        table-hover
                        mb-0
                        "

                    >


                        <thead>


                            <tr>


                                <th>

                                    Student

                                </th>


                                <th>

                                    Student ID

                                </th>


                                <th>

                                    Research Topic

                                </th>


                                <th>

                                    Supervisor

                                </th>


                                <th>

                                    Draft Stage

                                </th>


                                <th>

                                    Status

                                </th>


                            </tr>


                        </thead>


                        <tbody>


                            {

                                progressReport
                                .length === 0

                                ?


                                <tr>


                                    <td

                                        colSpan="6"

                                        className="
                                        text-center
                                        p-4
                                        "

                                    >


                                        No student progress

                                        records found.


                                    </td>


                                </tr>


                                :


                                progressReport.map(

                                    (

                                        report,

                                        index

                                    ) =>


                                    <tr

                                        key={

                                            index

                                        }

                                    >


                                        <td>


                                            {

                                                report
                                                .student_name

                                            }


                                        </td>


                                        <td>


                                            {

                                                report
                                                .student_id

                                            }


                                        </td>


                                        <td>


                                            {

                                                report
                                                .research_topic

                                                ||

                                                "Not Approved"

                                            }


                                        </td>


                                        <td>


                                            {

                                                report
                                                .supervisor_name

                                                ||

                                                "Not Assigned"

                                            }


                                        </td>


                                        <td>


                                            {

                                                report
                                                .draft_stage

                                                ||

                                                "Not Submitted"

                                            }


                                        </td>


                                        <td>


                                            {

                                                report
                                                .submission_status

                                                ||

                                                report
                                                .topic_status

                                                ||

                                                "Pending"

                                            }


                                        </td>


                                    </tr>


                                )

                            }


                        </tbody>


                    </table>


                </div>


            </div>


            {/* FINAL SUBMISSION REPORT */}


            <div

                className="
                card
                shadow-sm
                border-0
                "

            >


                <div

                    className="
                    card-header
                    bg-success
                    text-white
                    "

                >


                    Final Submission Report


                </div>


                <div className="table-responsive">


                    <table

                        className="
                        table
                        table-hover
                        mb-0
                        "

                    >


                        <thead>


                            <tr>


                                <th>

                                    Student

                                </th>


                                <th>

                                    Topic

                                </th>


                                <th>

                                    Draft

                                </th>


                                <th>

                                    Status

                                </th>


                                <th>

                                    Submitted

                                </th>


                            </tr>


                        </thead>


                        <tbody>


                            {

                                submissionReport
                                .length === 0

                                ?


                                <tr>


                                    <td

                                        colSpan="5"

                                        className="
                                        text-center
                                        p-4
                                        "

                                    >


                                        No submissions found.


                                    </td>


                                </tr>


                                :


                                submissionReport.map(

                                    (

                                        report

                                    ) =>


                                    <tr

                                        key={

                                            report.id

                                        }

                                    >


                                        <td>


                                            {

                                                report
                                                .student_name

                                            }


                                        </td>


                                        <td>


                                            {

                                                report
                                                .research_topic

                                            }


                                        </td>


                                        <td>


                                            {

                                                report
                                                .draft_stage

                                            }


                                        </td>


                                        <td>


                                            {

                                                report
                                                .status

                                            }


                                        </td>


                                        <td>


                                            {

                                                new Date(

                                                    report
                                                    .submitted_at

                                                )

                                                .toLocaleDateString()

                                            }


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

export default Reports;

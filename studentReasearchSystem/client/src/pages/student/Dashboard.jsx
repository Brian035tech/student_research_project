import StudentLayout from "../../components/StudentLayout";

function Dashboard() {

    return (

        <StudentLayout>

            <h1>Student Dashboard</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "20px",
                    marginTop: "30px",
                }}
            >

                <div style={card}>
                    <h2>Topics</h2>
                    <p>0 Submitted</p>
                </div>

                <div style={card}>
                    <h2>Supervisor</h2>
                    <p>Not Assigned</p>
                </div>

                <div style={card}>
                    <h2>Final Project</h2>
                    <p>Not Submitted</p>
                </div>

            </div>

        </StudentLayout>

    );

}

const card = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

export default Dashboard;
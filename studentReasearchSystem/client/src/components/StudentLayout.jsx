import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function StudentLayout({ children }) {

    return (

        <div
            style={{
                display: "flex",
                minHeight: "100vh",
            }}
        >

            <Sidebar />

            <div
                style={{
                    flex: 1,
                    background: "#f4f6f9",
                }}
            >

                <Navbar />

                <div
                    style={{
                        padding: "30px",
                    }}
                >
                    {children}
                </div>

            </div>

        </div>

    );

}

export default StudentLayout;
import SupervisorSidebar from "./SupervisorSidebar";

function SupervisorLayout({ children }) {

    return (

        <div style={{ display: "flex" }}>

            <SupervisorSidebar />

            <div
                style={{
                    flex: 1,
                    padding: "20px",
                    background: "#f5f5f5",
                    minHeight: "100vh"
                }}
            >

                {children}

            </div>

        </div>

    );

}

export default SupervisorLayout;
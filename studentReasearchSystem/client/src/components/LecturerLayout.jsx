import LecturerSidebar from "./LecturerSidebar";

function LecturerLayout({ children }) {
    return (
        <div style={{ display: "flex" }}>
            <LecturerSidebar />

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

export default LecturerLayout;
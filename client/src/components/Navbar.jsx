import { getUser } from "../utils/auth";

function Navbar() {
  const user = getUser();

  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Student Research Management System</h2>

      <div>
        <strong>{user?.full_name}</strong>
      </div>
    </div>
  );
}

export default Navbar;
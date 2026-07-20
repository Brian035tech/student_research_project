import { NavLink } from "react-router-dom";

function Sidebar({ title, menuItems, onLogout }) {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div
      className="d-flex flex-column text-white shadow-lg"
      style={{
        width: "280px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Header */}
      <div
        className="text-center py-4 border-bottom"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#2563eb",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          🎓
        </div>

        <h3 className="fw-bold mb-1">SRMS</h3>

        <small className="text-light opacity-75">
          Student Research Management System
        </small>
      </div>

      {/* Logged In User */}
      <div
        className="mx-3 mt-4 mb-3 p-3 rounded"
        style={{
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="fw-bold fs-5">
          {user.full_name || "User"}
        </div>

        <div
          className="text-uppercase"
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            letterSpacing: "1px",
          }}
        >
          {title}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow-1 px-3">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "sidebar-active" : ""
              }`
            }
          >
            <span
              style={{
                fontSize: "20px",
                width: "30px",
                display: "inline-block",
              }}
            >
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}

      </div>

      {/* Logout */}
      <div className="p-3">

        <button
          onClick={onLogout}
          className="btn w-100 fw-semibold"
          style={{
            background: "#dc2626",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px",
            border: "none",
          }}
        >
          🚪 Logout
        </button>

      </div>

      {/* Styles */}
      <style>{`
        .sidebar-link{
            display:flex;
            align-items:center;
            gap:15px;
            text-decoration:none;
            color:#e2e8f0;
            padding:14px 18px;
            margin-bottom:10px;
            border-radius:12px;
            transition:all .25s ease;
        }

        .sidebar-link:hover{
            background:rgba(255,255,255,.08);
            color:#fff;
            transform:translateX(6px);
        }

        .sidebar-active{
            background:#2563eb;
            color:white !important;
            font-weight:600;
            box-shadow:0 8px 20px rgba(37,99,235,.35);
        }

        .btn:hover{
            transform:translateY(-2px);
            transition:.2s;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
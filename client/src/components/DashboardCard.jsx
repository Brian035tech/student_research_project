import "./DashboardCard.css";
function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
      <div
  className="card border-0 h-100 dashboard-card"
        style={{
          borderRadius: "22px",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          transition: "all .35s ease",
          cursor: "pointer",
        }}
      >
        {/* Gradient Header */}
        <div
          style={{
            background: color,
            padding: "22px",
            color: "white",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">

            <div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </div>

              <h1
                style={{
                  fontWeight: "700",
                  marginTop: "8px",
                  marginBottom: 0,
                  fontSize: "38px",
                }}
              >
                {value}
              </h1>
            </div>

            <div
              style={{
                width: "75px",
                height: "75px",
                borderRadius: "18px",
                background: "rgba(255,255,255,.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
                backdropFilter: "blur(6px)",
              }}
            >
              {icon}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 d-flex justify-content-between align-items-center"
          style={{
            background: "#f8fafc",
          }}
        >
          <span
            style={{
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            Total {title}
          </span>

          <span
            style={{
              color: "#22c55e",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            ● Live
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
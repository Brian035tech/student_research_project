function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="col-md-4 mb-4">
      <div
        className="card shadow-sm border-0"
        style={{
          borderLeft: `5px solid ${color}`,
        }}
      >
        <div className="card-body d-flex align-items-center">
          <div className="me-4 fs-1">
            {icon}
          </div>

          <div>
            <h6 className="text-muted">{title}</h6>
            <h2 className="fw-bold">{value}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
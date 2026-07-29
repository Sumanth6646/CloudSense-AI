function DashboardCard({ title, value, colour }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${colour}`,
        minWidth: "220px",
      }}
    >
      <h3 style={{ margin: 0, color: "#6B7280" }}>{title}</h3>

      <h1 style={{ marginTop: "15px" }}>{value}</h1>
    </div>
  );
}

export default DashboardCard;

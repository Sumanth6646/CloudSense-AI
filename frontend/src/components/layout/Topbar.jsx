function Topbar() {
  return (
    <div
      style={{
        height: "70px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2>Dashboard</h2>

      <div>
        🔔 Notifications &nbsp;&nbsp;&nbsp;
        👤 Sai
      </div>
    </div>
  );
}

export default Topbar;
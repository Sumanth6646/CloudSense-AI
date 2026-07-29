function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        backgroundColor: "#111827",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2>☁ CloudSense AI</h2>

      <hr />

      <p>📊 Dashboard</p>
      <p>📂 Billing Import</p>
      <p>📈 Analytics</p>
      <p>🚨 Anomalies</p>
      <p>🔮 Forecast</p>
      <p>💡 Recommendations</p>
      <p>📄 Reports</p>
      <p>⚙ Settings</p>
    </div>
  );
}

export default Sidebar;
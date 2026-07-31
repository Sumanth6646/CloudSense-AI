function AnomaliesTable() {
  const anomalies = [
    {
      date: "30 Jul 2026",
      service: "Amazon EC2",
      cost: "£620",
      severity: "Critical",
      status: "Open",
    },
    {
      date: "29 Jul 2026",
      service: "Amazon S3",
      cost: "£245",
      severity: "Medium",
      status: "Investigating",
    },
    {
      date: "28 Jul 2026",
      service: "Azure Virtual Machine",
      cost: "£980",
      severity: "Critical",
      status: "Open",
    },
    {
      date: "27 Jul 2026",
      service: "AWS Lambda",
      cost: "£65",
      severity: "Low",
      status: "Resolved",
    },
    {
      date: "26 Jul 2026",
      service: "Google Cloud Storage",
      cost: "£430",
      severity: "High",
      status: "Open",
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "#DC2626";
      case "High":
        return "#EA580C";
      case "Medium":
        return "#D97706";
      case "Low":
        return "#16A34A";
      default:
        return "#64748B";
    }
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        marginTop: "30px",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflowX: "auto",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        🚨 Recent Cost Anomalies
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#F1F5F9" }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Cloud Service</th>
            <th style={thStyle}>Cost</th>
            <th style={thStyle}>Severity</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {anomalies.map((item, index) => (
            <tr key={index}>
              <td style={tdStyle}>{item.date}</td>

              <td style={tdStyle}>{item.service}</td>

              <td style={tdStyle}>{item.cost}</td>

              <td style={tdStyle}>
                <span
                  style={{
                    background: getSeverityColor(item.severity),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                  }}
                >
                  {item.severity}
                </span>
              </td>

              <td style={tdStyle}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "14px",
  textAlign: "left",
  borderBottom: "2px solid #E2E8F0",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #E2E8F0",
};

export default AnomaliesTable;
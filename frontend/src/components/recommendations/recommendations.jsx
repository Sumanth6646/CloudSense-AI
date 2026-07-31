function Recommendations() {
  const recommendations = [
    "Rightsize EC2 instances",
    "Delete unattached EBS volumes",
    "Enable Auto Scaling",
    "Purchase Reserved Instances",
    "Move infrequent data to S3 Glacier",
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2>💡 AI Recommendations</h2>

      <ul style={{ marginTop: "15px" }}>
        {recommendations.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;
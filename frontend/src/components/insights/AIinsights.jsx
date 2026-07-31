function AIInsights() {
  const insights = [
    {
      title: "Cloud cost increased by 12%",
      color: "#2563EB",
    },
    {
      title: "Storage spending is unusually high",
      color: "#F59E0B",
    },
    {
      title: "Potential monthly savings: £2,850",
      color: "#22C55E",
    },
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
      <h2>🤖 AI Insights</h2>

      {insights.map((item, index) => (
        <div
          key={index}
          style={{
            marginTop: "15px",
            padding: "15px",
            borderLeft: `6px solid ${item.color}`,
            background: "#f8fafc",
            borderRadius: "8px",
          }}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
}

export default AIInsights;
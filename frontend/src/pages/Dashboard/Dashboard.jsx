import Layout from "../../components/layout/Layout";
import DashboardCard from "../../components/cards/DashboardCard";
import LineChartCard from "../../components/charts/LineChartCard";
import PieChartCard from "../../components/charts/PieChartCard";
import AIInsights from "../../components/insights/AIInsights";
import Recommendations from "../../components/recommendations/Recommendations";

function Dashboard() {
  return (
    <Layout>
      {/* Dashboard Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          ☁ CloudSense AI Dashboard
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "16px",
          }}
        >
          Welcome to your AI-powered Cloud Cost Optimisation Platform.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <DashboardCard
          title="Total Cloud Cost"
          value="£18,420"
          colour="#2563EB"
        />

        <DashboardCard
          title="Monthly Growth"
          value="+12%"
          colour="#22C55E"
        />

        <DashboardCard
          title="Active Anomalies"
          value="7"
          colour="#EF4444"
        />

        <DashboardCard
          title="Estimated Savings"
          value="£2,850"
          colour="#F59E0B"
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <LineChartCard />
        <PieChartCard />
      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* AI Recommendations */}
      <Recommendations />
    </Layout>
  );
}

export default Dashboard;
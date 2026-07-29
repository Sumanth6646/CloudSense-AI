import Layout from "../../components/layout/Layout";
import DashboardCard from "../../components/cards/DashboardCard";
import LineChartCard from "../../components/charts/LineChartCard";
import PieChartCard from "../../components/charts/PieChartCard";

function Dashboard() {
  return (
    <Layout>
      {/* Dashboard Header */}
      <h1>☁ CloudSense AI Dashboard</h1>
      <p>Welcome to your AI-powered cloud cost optimisation platform.</p>

      {/* KPI Cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
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

      {/* Charts Section */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <LineChartCard />
        <PieChartCard />
      </div>
    </Layout>
  );
}

export default Dashboard;
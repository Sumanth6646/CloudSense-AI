import Layout from "../../components/layout/Layout";
import DashboardHeader from "../../components/header/DashboardHeader";
import DashboardCard from "../../components/cards/DashboardCard";
import LineChartCard from "../../components/charts/LineChartCard";
import PieChartCard from "../../components/charts/PieChartCard";
import AIInsights from "../../components/insights/AIInsights";
import AnomaliesTable from "../../components/tables/AnomaliesTable";
import Recommendations from "../../components/recommendations/Recommendations";

function Dashboard() {
  return (
    <Layout>
      <DashboardHeader />

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

      <AIInsights />

      <AnomaliesTable />

      <Recommendations />
    </Layout>
  );
}

export default Dashboard;
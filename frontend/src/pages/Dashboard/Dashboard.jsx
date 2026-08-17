import Layout from "../../components/layout/Layout";
import DashboardHeader from "../../components/header/DashboardHeader";
import DashboardCard from "../../components/cards/DashboardCard";
import LineChartCard from "../../components/charts/LineChartCard";
import PieChartCard from "../../components/charts/PieChartCard";
import AIInsights from "../../components/insights/AIInsights";
import AnomaliesTable from "../../components/tables/AnomaliesTable";
import Recommendations from "../../components/recommendations/Recommendations";
import { useBillingData } from "../../context/BillingDataContext";

function Dashboard() {
  const { billingData, totalCost } = useBillingData();

  /*
   * Calculate basic dashboard metrics
   */

  // Calculate total number of anomalies using a simple
  // frontend threshold for now.
  // This will later be replaced by Isolation Forest.
  const anomalyThreshold = 500;

  const activeAnomalies = billingData.filter(
    (item) => Number(item.Cost || 0) >= anomalyThreshold
  ).length;

  // Estimate potential savings as 15% of total spending.
  // This is only a temporary frontend estimate.
  // The recommendation engine will replace this later.
  const estimatedSavings = totalCost * 0.15;

  // Calculate monthly growth based on the first
  // and last billing records.
  let monthlyGrowth = 0;

  if (billingData.length >= 2) {
    const firstCost = Number(billingData[0].Cost || 0);
    const lastCost = Number(
      billingData[billingData.length - 1].Cost || 0
    );

    if (firstCost > 0) {
      monthlyGrowth =
        ((lastCost - firstCost) / firstCost) * 100;
    }
  }

  return (
    <Layout>
      <DashboardHeader />

      {/* Dashboard KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">

        <DashboardCard
          title="Total Cloud Cost"
          value={`$${totalCost.toLocaleString()}`}
          colour="#2563EB"
        />

        <DashboardCard
          title="Spending Growth"
          value={`${monthlyGrowth >= 0 ? "+" : ""}${monthlyGrowth.toFixed(1)}%`}
          colour="#22C55E"
        />

        <DashboardCard
          title="Active Anomalies"
          value={activeAnomalies}
          colour="#EF4444"
        />

        <DashboardCard
          title="Potential Savings"
          value={`$${estimatedSavings.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          colour="#F59E0B"
        />

      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-3 mb-8">

        <div className="lg:col-span-2">
          <LineChartCard />
        </div>

        <div>
          <PieChartCard />
        </div>

      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* Anomalies */}
      <AnomaliesTable />

      {/* Recommendations */}
      <Recommendations />

    </Layout>
  );
}

export default Dashboard;
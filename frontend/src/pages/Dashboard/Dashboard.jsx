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
  const {
    billingData,
    totalCost,
    anomalies,
    totalPotentialSavings,
  } = useBillingData();

  /*
   * --------------------------------------------------
   * Dashboard Metrics
   * --------------------------------------------------
   */

  // Real Isolation Forest anomaly results
  const activeAnomalies = anomalies.length;

  /*
   * Real potential savings returned by the
   * recommendation engine.
   *
   * No more temporary 15% calculation.
   */
  const estimatedSavings = Number(
    totalPotentialSavings || 0
  );

  /*
   * --------------------------------------------------
   * Spending Growth
   * --------------------------------------------------
   *
   * Calculate spending growth using the first
   * and last billing records.
   */

  let monthlyGrowth = 0;

  if (billingData.length >= 2) {
    const firstCost = Number(
      billingData[0].Cost || 0
    );

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

      {/* --------------------------------------------------
          Dashboard Header
      -------------------------------------------------- */}

      <DashboardHeader />

      {/* --------------------------------------------------
          Dashboard KPI Cards
      -------------------------------------------------- */}

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Cloud Cost */}

        <DashboardCard
          title="Total Cloud Cost"
          value={`$${totalCost.toLocaleString()}`}
          colour="#2563EB"
        />

        {/* Spending Growth */}

        <DashboardCard
          title="Spending Growth"
          value={`${
            monthlyGrowth >= 0 ? "+" : ""
          }${monthlyGrowth.toFixed(1)}%`}
          colour="#22C55E"
        />

        {/* Active Anomalies */}

        <DashboardCard
          title="Active Anomalies"
          value={activeAnomalies}
          colour="#EF4444"
        />

        {/* Real Potential Savings */}

        <DashboardCard
          title="Potential Savings"
          value={`$${estimatedSavings.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 0,
            }
          )}`}
          colour="#F59E0B"
        />

      </div>

      {/* --------------------------------------------------
          Charts
      -------------------------------------------------- */}

      <div className="mb-8 grid gap-5 lg:grid-cols-3">

        {/* Spending Trend */}

        <div className="lg:col-span-2">
          <LineChartCard />
        </div>

        {/* Provider Distribution */}

        <div>
          <PieChartCard />
        </div>

      </div>

      {/* --------------------------------------------------
          AI Insights
      -------------------------------------------------- */}

      <AIInsights />

      {/* --------------------------------------------------
          Isolation Forest Anomalies
      -------------------------------------------------- */}

      <AnomaliesTable />

      {/* --------------------------------------------------
          Cost Optimization Recommendations
      -------------------------------------------------- */}

      <Recommendations />

    </Layout>
  );
}

export default Dashboard;
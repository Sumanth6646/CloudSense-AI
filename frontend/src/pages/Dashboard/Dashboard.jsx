import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
} from "lucide-react";

import Layout from "../../components/layout/layout";
import DashboardHeader from "../../components/header/DashboardHeader";
import DashboardCard from "../../components/cards/DashboardCard";
import LineChartCard from "../../components/charts/LineChartCard";
import PieChartCard from "../../components/charts/PieChartCard";
import AIInsights from "../../components/insights/AIInsights";
import AnomaliesTable from "../../components/tables/AnomaliesTable";
import Recommendations from "../../components/recommendations/Recommendations";
import BudgetStatus from "../../components/common/BudgetStatus";

import {
  dashboardSummary,
  currencySymbol,
} from "../../data/costdata";

function Dashboard() {
  const formatCurrency = (value) =>
    `${currencySymbol}${Number(value).toLocaleString()}`;

  return (
    <Layout>
      <DashboardHeader />

      {/* KPI Cards */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Cloud Cost"
          value={formatCurrency(
            dashboardSummary.totalCost
          )}
          colour="#2563EB"
          icon={DollarSign}
          trend="+12.0%"
          subtitle="vs previous month"
        />

        <DashboardCard
          title="Monthly Growth"
          value={`+${dashboardSummary.monthlyGrowth}%`}
          colour="#22C55E"
          icon={TrendingUp}
          trend="Increasing"
          subtitle="monthly spending"
          trendType="warning"
        />

        <DashboardCard
          title="Potential Savings"
          value={formatCurrency(
            dashboardSummary.estimatedSavings
          )}
          colour="#F59E0B"
          icon={PiggyBank}
          trend="Optimization found"
          subtitle="per month"
        />

        <DashboardCard
          title="Active Anomalies"
          value={dashboardSummary.activeAnomalies}
          colour="#EF4444"
          icon={AlertTriangle}
          trend="2 critical"
          subtitle="need attention"
          trendType="negative"
        />
      </section>

      {/* Forecast summary */}
      <section className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              AI Cost Forecast
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Estimated month-end cost:{" "}
              {formatCurrency(
                dashboardSummary.forecast
              )}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Based on recent cloud spending trends and
              current usage patterns.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-slate-500">
              Forecast confidence
            </p>

            <p className="mt-1 text-lg font-bold text-blue-600">
              87%
            </p>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <LineChartCard />
        <PieChartCard />
      </section>

      {/* Insights + Budget */}
      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <AIInsights />
        <BudgetStatus />
      </section>

      {/* Anomalies */}
      <section className="mb-6">
        <AnomaliesTable />
      </section>

      {/* Recommendations */}
      <section className="pb-6">
        <Recommendations />
      </section>
    </Layout>
  );
}

export default Dashboard;
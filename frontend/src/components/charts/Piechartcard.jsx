import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useBillingData } from "../../context/BillingDataContext";

const colours = [
  "#2563EB",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

function PieChartCard() {
  const { billingData } = useBillingData();

  /*
   * Group billing costs by cloud service.
   *
   * Example:
   *
   * EC2      → 2031
   * S3       → 1135
   * RDS      → 780
   */

  const serviceTotals = {};

  billingData.forEach((item) => {
    const service = item.Service || "Unknown";
    const cost = Number(item.Cost || 0);

    if (!serviceTotals[service]) {
      serviceTotals[service] = 0;
    }

    serviceTotals[service] += cost;
  });

  const chartData = Object.entries(serviceTotals).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 h-[380px]">

      <div className="mb-2">
        <h3 className="text-xl font-bold text-slate-900">
          Service Cost Distribution
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Spending by cloud service
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-slate-400">
          Upload billing data to view service costs.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={90}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colours[index % colours.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`$${value}`, "Cost"]}
            />

            <Legend />

          </PieChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}

export default PieChartCard;
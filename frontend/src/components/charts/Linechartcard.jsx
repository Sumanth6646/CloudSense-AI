import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useBillingData } from "../../context/BillingDataContext";

function LineChartCard() {
  const { billingData } = useBillingData();

  /*
   * Convert billing records into chart data.
   *
   * Example:
   *
   * 2026-07-01 → 420
   * 2026-07-02 → 438
   * 2026-07-03 → 210
   */

  const chartData = billingData.map((item) => ({
    date: item.Date,
    cost: Number(item.Cost || 0),
  }));

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 h-[380px]">

      <div className="mb-5">
        <h3 className="text-xl font-bold text-slate-900">
          Cloud Cost Trend
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Daily cloud spending from imported billing data
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-slate-400">
          Upload billing data to view the cost trend.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="75%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
            />

            <YAxis
              tick={{ fontSize: 11 }}
            />

            <Tooltip
              formatter={(value) => [`$${value}`, "Cost"]}
            />

            <Line
              type="monotone"
              dataKey="cost"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}

export default LineChartCard;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { monthlyCost, currencySymbol } from "../../data/costdata";

function LineChartCard() {
  const formatCurrency = (value) =>
    `${currencySymbol}${Number(value).toLocaleString()}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Cloud Cost Trend
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Monthly cloud spending
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
          Last 6 Months
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyCost}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickFormatter={(value) =>
                `$${(value / 1000).toFixed(0)}k`
              }
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
              }}
              formatter={(value) => [
                formatCurrency(value),
                "Cloud Cost",
              ]}
            />

            <Line
              type="monotone"
              dataKey="cost"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#FFFFFF",
                stroke: "#2563EB",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#2563EB",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LineChartCard;
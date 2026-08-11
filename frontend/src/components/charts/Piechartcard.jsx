import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  serviceCost,
  currencySymbol,
} from "../../data/costdata";

const colours = [
  "#2563EB",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

function PieChartCard() {
  const total = serviceCost.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-2">
        <h3 className="text-base font-bold text-slate-900">
          Service Cost Distribution
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Spending by cloud service
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={serviceCost}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {serviceCost.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={colours[index % colours.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                `${currencySymbol}${Number(value).toLocaleString()}`,
                "Cost",
              ]}
            />

            <Legend
              verticalAlign="bottom"
              height={30}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 text-center">
        <p className="text-xs text-slate-500">
          Total analyzed cost
        </p>

        <p className="text-lg font-bold text-slate-900">
          {currencySymbol}
          {total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default PieChartCard;
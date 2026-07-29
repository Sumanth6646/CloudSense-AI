import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { serviceCost } from "../../data/costData";

const colours = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444"];

function PieChartCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        flex: 1,
        minWidth: "320px",
        height: "350px",
      }}
    >
      <h3>Service Cost Distribution</h3>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={serviceCost}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {serviceCost.map((entry, index) => (
              <Cell
                key={index}
                fill={colours[index % colours.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartCard;
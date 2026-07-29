import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { monthlyCost } from "../../data/costData";

function LineChartCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        flex: 2,
        minWidth: "500px",
        height: "350px",
      }}
    >
      <h3>Monthly Cloud Cost</h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={monthlyCost}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#2563EB"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartCard;
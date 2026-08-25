import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Layout from "../../components/layout/Layout";
import { useBillingData } from "../../context/BillingDataContext";

function Forecast() {
  const { billingData } = useBillingData();

  const [forecastData, setForecastData] = useState([]);
  const [forecastInfo, setForecastInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!billingData || billingData.length < 3) {
      setForecastData([]);
      setForecastInfo(null);
      return;
    }

    const generateForecast = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/forecast/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(billingData),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.detail || "Unable to generate forecast."
          );
        }

        if (result.status !== "success") {
          throw new Error(
            result.message || "Forecast generation failed."
          );
        }

        setForecastData(result.forecast || []);
        setForecastInfo(result);
      } catch (err) {
        console.error("Forecast error:", err);
        setError(
          err.message || "Unable to connect to forecasting API."
        );
      } finally {
        setLoading(false);
      }
    };

    generateForecast();
  }, [billingData]);

  return (
    <Layout>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Cost Forecast
        </h1>

        <p className="mt-2 text-slate-500">
          Predict future cloud spending using your billing history.
        </p>
      </div>

      {/* No Billing Data */}
      {billingData.length < 3 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">🔮</div>

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            Not enough billing data
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Upload billing data containing at least 3 records
            to generate a forecast.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center">
          <p className="font-semibold text-blue-700">
            Generating cost forecast...
          </p>

          <p className="mt-1 text-sm text-blue-600">
            Analyzing your historical billing data.
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-bold text-red-700">
            Forecast failed
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Forecast Results */}
      {!loading &&
        !error &&
        forecastInfo &&
        forecastData.length > 0 && (
          <>
            {/* Summary Cards */}
            <div className="mb-8 grid gap-5 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Average Daily Cost
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  ${forecastInfo.average_daily_cost.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Spending Trend
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {forecastInfo.trend_percentage >= 0 ? "+" : ""}
                  {forecastInfo.trend_percentage}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Predicted 7-Day Cost
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  ${forecastInfo.predicted_total.toLocaleString()}
                </p>
              </div>

            </div>

            {/* Forecast Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  7-Day Cost Forecast
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Estimated cloud spending for the next 7 days.
                </p>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={forecastData}
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
                      formatter={(value) => [
                        `$${Number(value).toLocaleString()}`,
                        "Predicted Cost",
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey="predicted_cost"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Forecast Table */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Forecast Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Daily predicted cloud spending.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">

                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-600">
                        Date
                      </th>

                      <th className="px-6 py-4 font-semibold text-slate-600">
                        Predicted Cost
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {forecastData.map((item) => (
                      <tr
                        key={item.date}
                        className="border-t border-slate-100"
                      >
                        <td className="px-6 py-4">
                          {item.date}
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          ${Number(
                            item.predicted_cost
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>
          </>
        )}

    </Layout>
  );
}

export default Forecast;
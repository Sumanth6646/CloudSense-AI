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
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  BrainCircuit,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import Layout from "../../components/layout/Layout";
import { useBillingData } from "../../context/BillingDataContext";
import { formatCurrency } from "../../utils/currency";

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
      setError("");
      setLoading(false);
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

        let result;

        try {
          result = await response.json();
        } catch {
          throw new Error(
            "The forecasting server returned an invalid response."
          );
        }

        if (!response.ok) {
          const backendError =
            typeof result?.detail === "string"
              ? result.detail
              : "Unable to generate forecast.";

          throw new Error(backendError);
        }

        if (result?.status !== "success") {
          throw new Error(
            result?.message ||
              "Forecast generation failed."
          );
        }

        setForecastData(
          Array.isArray(result?.forecast)
            ? result.forecast
            : []
        );

        setForecastInfo(result);
      } catch (err) {
        console.error("Forecast error:", err);

        setForecastData([]);
        setForecastInfo(null);

        setError(
          err?.message ||
            "Unable to connect to the forecasting API."
        );
      } finally {
        setLoading(false);
      }
    };

    generateForecast();
  }, [billingData]);

  const trendPercentage = Number(
    forecastInfo?.trend_percentage || 0
  );

  const isIncreasing = trendPercentage > 0;
  const isDecreasing = trendPercentage < 0;

  return (
    <Layout>

      {/* Page Header */}

      <div className="mb-8">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <TrendingUp size={24} />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  Cost Forecast
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Predict future cloud spending using your
                  billing history.
                </p>

              </div>

            </div>

          </div>

          {billingData.length >= 3 && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">

              <BrainCircuit
                size={20}
                className="text-violet-600"
              />

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Forecast Method
                </p>

                <p className="mt-1 font-bold text-violet-600">
                  Moving Average
                </p>

              </div>

            </div>
          )}

        </div>

      </div>


      {/* No Billing Data */}

      {billingData.length < 3 && (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">

            <CalendarDays size={30} />

          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Not enough billing data
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Upload billing data containing at least
            3 records to generate a cloud cost forecast.
          </p>

        </div>

      )}


      {/* Loading */}

      {loading && (

        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-10 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-violet-600">

            <LoaderCircle
              size={28}
              className="animate-spin"
            />

          </div>

          <h2 className="mt-4 font-bold text-violet-800">
            Generating cost forecast...
          </h2>

          <p className="mt-1 text-sm text-violet-600">
            Analyzing your historical billing data.
          </p>

        </div>

      )}


      {/* Error */}

      {error && !loading && (

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <div className="flex gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

              <AlertCircle size={20} />

            </div>

            <div>

              <h2 className="font-bold text-red-700">
                Forecast failed
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-600">
                {error}
              </p>

              <p className="mt-2 text-xs text-red-500">
                Make sure the CloudSense AI backend is
                running on port 8000.
              </p>

            </div>

          </div>

        </div>

      )}


      {/* Forecast Results */}

      {!loading &&
        !error &&
        forecastInfo &&
        forecastData.length > 0 && (

          <>

            {/* Summary Cards */}

            <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              {/* Average Daily Cost */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      Average Daily Cost
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {formatCurrency(
                        forecastInfo.average_daily_cost
                      )}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <CalendarDays size={21} />

                  </div>

                </div>

              </div>


              {/* Spending Trend */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      Spending Trend
                    </p>

                    <p
                      className={`mt-2 text-3xl font-bold ${
                        isIncreasing
                          ? "text-orange-600"
                          : isDecreasing
                            ? "text-green-600"
                            : "text-slate-900"
                      }`}
                    >
                      {trendPercentage >= 0
                        ? "+"
                        : ""}
                      {trendPercentage.toFixed(2)}%
                    </p>

                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      isIncreasing
                        ? "bg-orange-50 text-orange-600"
                        : isDecreasing
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-50 text-slate-600"
                    }`}
                  >

                    {isIncreasing ? (
                      <TrendingUp size={21} />
                    ) : isDecreasing ? (
                      <TrendingDown size={21} />
                    ) : (
                      <TrendingUp size={21} />
                    )}

                  </div>

                </div>

                <p className="mt-3 text-xs text-slate-500">

                  {isIncreasing
                    ? "Recent spending is increasing."
                    : isDecreasing
                      ? "Recent spending is decreasing."
                      : "Recent spending is relatively stable."}

                </p>

              </div>


              {/* Predicted Total */}

              <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      Predicted 7-Day Cost
                    </p>

                    <p className="mt-2 text-3xl font-bold text-violet-600">
                      {formatCurrency(
                        forecastInfo.predicted_total
                      )}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                    <TrendingUp size={21} />

                  </div>

                </div>

              </div>


              {/* Historical Days */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      Historical Days
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {Number(
                        forecastInfo.historical_days || 0
                      )}
                    </p>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                    <CalendarDays size={21} />

                  </div>

                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Days analyzed for forecasting.
                </p>

              </div>

            </div>


            {/* Forecast Chart */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      7-Day Cost Forecast
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Estimated cloud spending for the next
                      7 days.
                    </p>

                  </div>

                  <div className="rounded-xl bg-violet-50 px-4 py-2">

                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                      Forecast Horizon
                    </p>

                    <p className="mt-1 text-sm font-bold text-violet-700">
                      Next 7 Days
                    </p>

                  </div>

                </div>

              </div>


              <div className="h-[400px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={forecastData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                    />

                    <YAxis
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value),
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

                <div className="flex flex-wrap items-center justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Forecast Details
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Daily predicted cloud spending for
                      the next 7 days.
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-2">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total Forecast
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {formatCurrency(
                        forecastInfo.predicted_total
                      )}
                    </p>

                  </div>

                </div>

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
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                          {item.date}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                          {formatCurrency(
                            item.predicted_cost
                          )}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>


            {/* Forecast Method Information */}

            <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-6">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">

                  <BrainCircuit size={20} />

                </div>

                <div>

                  <h3 className="font-bold text-violet-900">
                    How CloudSense AI generates the forecast
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-violet-800">
                    CloudSense AI aggregates your historical
                    billing records by date and analyzes the
                    most recent spending pattern. A moving-average
                    approach is then used to estimate the expected
                    cloud cost for each of the next seven days.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-violet-800">
                    The forecast also considers the recent spending
                    trend so that increasing or decreasing cost
                    patterns are reflected in the prediction.
                  </p>

                </div>

              </div>

            </div>

          </>
        )}

    </Layout>
  );
}

export default Forecast;
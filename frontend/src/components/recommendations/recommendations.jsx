import { useEffect, useState } from "react";

import {
  Lightbulb,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

import { useBillingData } from "../../context/BillingDataContext";

function Recommendations() {
  const { billingData } = useBillingData();

  const [recommendations, setRecommendations] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * --------------------------------------------------
   * Generate recommendations whenever billing data
   * changes.
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!billingData || billingData.length === 0) {
      setRecommendations([]);
      setTotalSavings(0);
      setError("");
      return;
    }

    const generateRecommendations = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/recommendations/generate",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(billingData),
          }
        );

        const result = await response.json();

        /*
         * Handle backend errors
         */

        if (!response.ok) {
          throw new Error(
            typeof result.detail === "string"
              ? result.detail
              : result.detail?.message ||
                  "Unable to generate recommendations."
          );
        }

        /*
         * Make sure backend returned success
         */

        if (result.status !== "success") {
          throw new Error(
            result.message ||
              "Recommendation generation failed."
          );
        }

        /*
         * Store recommendations
         */

        setRecommendations(
          Array.isArray(result.recommendations)
            ? result.recommendations
            : []
        );

        /*
         * Store total potential savings
         */

        setTotalSavings(
          Number(
            result.total_potential_savings || 0
          )
        );
      } catch (err) {
        console.error(
          "Recommendation error:",
          err
        );

        setRecommendations([]);
        setTotalSavings(0);

        setError(
          err.message ||
            "Unable to connect to recommendation API."
        );
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [billingData]);

  /*
   * --------------------------------------------------
   * No billing data
   * --------------------------------------------------
   */

  if (!billingData || billingData.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Lightbulb size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              AI Recommendations
            </h2>

            <p className="text-xs text-slate-500">
              Optimization opportunities identified by CloudSense AI
            </p>
          </div>

        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">

          <p className="font-semibold text-slate-600">
            No billing data available
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Upload billing data to generate cost optimization recommendations.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Lightbulb size={20} />
          </div>

          <div>

            <h2 className="text-base font-bold text-slate-900">
              AI Recommendations
            </h2>

            <p className="text-xs text-slate-500">
              Optimization opportunities identified by CloudSense AI
            </p>

          </div>

        </div>

        {/* Potential Savings */}

        <div className="rounded-xl bg-emerald-50 px-3 py-2">

          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
            Potential Savings
          </p>

          <p className="text-sm font-bold text-emerald-700">
            ${totalSavings.toLocaleString()}/month
          </p>

        </div>

      </div>

      {/* --------------------------------------------------
          Loading
      -------------------------------------------------- */}

      {loading && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">

          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

          <p className="mt-3 font-semibold text-blue-700">
            Analyzing cloud spending...
          </p>

          <p className="mt-1 text-sm text-blue-600">
            CloudSense AI is generating optimization recommendations.
          </p>

        </div>
      )}

      {/* --------------------------------------------------
          Error
      -------------------------------------------------- */}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <p className="font-semibold text-red-700">
            Recommendation generation failed
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* --------------------------------------------------
          No recommendations
      -------------------------------------------------- */}

      {!loading &&
        !error &&
        recommendations.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">

            <div className="text-3xl">
              ✓
            </div>

            <p className="mt-2 font-semibold text-green-600">
              No major optimization opportunities detected
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Your current billing data does not contain
              recommendations requiring immediate attention.
            </p>

          </div>
        )}

      {/* --------------------------------------------------
          Recommendations
      -------------------------------------------------- */}

      {!loading &&
        !error &&
        recommendations.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">

            {recommendations.map(
              (item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-3">

                      {/* Icon */}

                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                        <TrendingDown size={16} />

                      </div>

                      {/* Recommendation information */}

                      <div>

                        <h3 className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>

                      </div>

                    </div>

                    <ArrowRight
                      size={17}
                      className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500"
                    />

                  </div>

                  {/* Bottom information */}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">

                    {/* Priority */}

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                        item.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : item.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.priority} Priority
                    </span>

                    {/* Savings */}

                    <span className="text-sm font-bold text-emerald-600">
                      +$
                      {Number(
                        item.savings || 0
                      ).toLocaleString()}
                      /mo
                    </span>

                  </div>

                  {/* Service */}

                  {item.service && (
                    <div className="mt-3">

                      <span className="text-[11px] text-slate-400">
                        Service:{" "}
                      </span>

                      <span className="text-[11px] font-medium text-slate-600">
                        {item.service}
                      </span>

                    </div>
                  )}

                </div>
              )
            )}

          </div>
        )}

    </section>
  );
}

export default Recommendations;
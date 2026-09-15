import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import Layout from "../../components/layout/Layout";
import { useBillingData } from "../../context/BillingDataContext";
import { formatCurrency } from "../../utils/currency";

function Reports() {
  const {
    billingData,
    billingInfo,
    anomalies,
    recommendations,
    totalPotentialSavings,
    updateRecommendations,
  } = useBillingData();

  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  /*
   * --------------------------------------------------
   * Basic report calculations
   * --------------------------------------------------
   */

  const totalCost = useMemo(() => {
    return billingData.reduce(
      (sum, item) => sum + Number(item.Cost || 0),
      0
    );
  }, [billingData]);

  const totalRecords = billingData.length;
  const anomalyCount = anomalies.length;

  /*
   * --------------------------------------------------
   * Provider summary
   * --------------------------------------------------
   */

  const providerSummary = useMemo(() => {
    const totals = {};

    billingData.forEach((item) => {
      const provider = item.Provider || "Unknown";
      const cost = Number(item.Cost || 0);

      totals[provider] = (totals[provider] || 0) + cost;
    });

    return Object.entries(totals)
      .map(([provider, cost]) => ({
        provider,
        cost,
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [billingData]);

  /*
   * --------------------------------------------------
   * Service summary
   * --------------------------------------------------
   */

  const serviceSummary = useMemo(() => {
    const totals = {};

    billingData.forEach((item) => {
      const service = item.Service || "Unknown";
      const cost = Number(item.Cost || 0);

      totals[service] = (totals[service] || 0) + cost;
    });

    return Object.entries(totals)
      .map(([service, cost]) => ({
        service,
        cost,
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [billingData]);

  /*
   * --------------------------------------------------
   * Anomaly severity summary
   * --------------------------------------------------
   */

  const severitySummary = useMemo(() => {
    const counts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    anomalies.forEach((item) => {
      const severity = item.severity;

      if (counts[severity] !== undefined) {
        counts[severity] += 1;
      }
    });

    return counts;
  }, [anomalies]);

  /*
   * --------------------------------------------------
   * Fetch recommendation and forecast data
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!billingData || billingData.length === 0) {
      return;
    }

    const loadReportData = async () => {
      setReportError("");

      try {
        /*
         * Recommendation Engine
         */

        const recommendationResponse = await fetch(
          "http://127.0.0.1:8000/api/recommendations/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(billingData),
          }
        );

        if (recommendationResponse.ok) {
          const recommendationResult =
            await recommendationResponse.json();

          updateRecommendations(recommendationResult);
        }

        /*
         * Forecast Engine
         */

        setForecastLoading(true);

        const forecastResponse = await fetch(
          "http://127.0.0.1:8000/api/forecast/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(billingData),
          }
        );

        const forecastText = await forecastResponse.text();

        let forecastResult = null;

        try {
          forecastResult = forecastText
            ? JSON.parse(forecastText)
            : null;
        } catch {
          forecastResult = null;
        }

        if (!forecastResponse.ok) {
          throw new Error(
            forecastResult?.detail ||
              "Unable to generate forecast."
          );
        }

        setForecast(forecastResult);
      } catch (error) {
        console.error("Report data error:", error);

        setReportError(
          error.message ||
            "Some report information could not be loaded."
        );
      } finally {
        setForecastLoading(false);
      }
    };

    loadReportData();
  }, [billingData]);

  /*
   * --------------------------------------------------
   * Formatting helpers
   * --------------------------------------------------
   */

  const formatPercentage = (value) => {
    return `${Number(value || 0).toFixed(1)}%`;
  };

  /*
   * --------------------------------------------------
   * Export complete report as PDF
   * --------------------------------------------------
   */

  const exportReport = () => {
    if (!billingData || billingData.length === 0) {
      setReportError(
        "No billing data available to export."
      );
      return;
    }

    try {
      setReportError("");

      const doc = new jsPDF();

      const generatedDate =
        new Date().toLocaleString();

      const formatPdfCurrency = (value) => formatCurrency(value);

      /*
       * --------------------------------------------------
       * Helper for section titles
       * --------------------------------------------------
       */

      const addSectionTitle = (title, yPosition) => {
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);

        doc.text(title, 14, yPosition);

        doc.setTextColor(0, 0, 0);

        return yPosition + 7;
      };

      let currentY = 20;

      /*
       * --------------------------------------------------
       * Report Header
       * --------------------------------------------------
       */

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);

      doc.text("CloudSense AI", 14, currentY);

      currentY += 9;

      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59);

      doc.text(
        "Cloud Cost Analysis Report",
        14,
        currentY
      );

      currentY += 8;

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);

      doc.text(
        `Generated: ${generatedDate}`,
        14,
        currentY
      );

      if (billingInfo?.filename) {
        currentY += 5;

        doc.text(
          `Source file: ${billingInfo.filename}`,
          14,
          currentY
        );
      }

      doc.setTextColor(0, 0, 0);

      currentY += 12;

      /*
       * --------------------------------------------------
       * Executive Summary
       * --------------------------------------------------
       */

      currentY = addSectionTitle(
        "Executive Summary",
        currentY
      );

      autoTable(doc, {
        startY: currentY,
        head: [["Metric", "Value"]],
        body: [
          [
            "Total Cloud Cost",
            formatPdfCurrency(totalCost),
          ],
          [
            "Billing Records",
            totalRecords.toString(),
          ],
          [
            "Detected Anomalies",
            anomalyCount.toString(),
          ],
          [
            "Potential Savings",
            formatPdfCurrency(
              totalPotentialSavings
            ),
          ],
          [
            "Predicted 7-Day Cost",
            formatPdfCurrency(
              forecast?.predicted_total || 0
            ),
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fontStyle: "bold",
        },
      });

      currentY =
        doc.lastAutoTable.finalY + 12;

      /*
       * --------------------------------------------------
       * Provider Summary
       * --------------------------------------------------
       */

      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      currentY = addSectionTitle(
        "Cloud Provider Summary",
        currentY
      );

      autoTable(doc, {
        startY: currentY,
        head: [
          ["Provider", "Cost", "Share"],
        ],
        body: providerSummary.map((item) => {
          const percentage =
            totalCost > 0
              ? (item.cost / totalCost) * 100
              : 0;

          return [
            item.provider,
            formatPdfCurrency(item.cost),
            `${percentage.toFixed(1)}%`,
          ];
        }),
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fontStyle: "bold",
        },
      });

      currentY =
        doc.lastAutoTable.finalY + 12;

      /*
       * --------------------------------------------------
       * Service Summary
       * --------------------------------------------------
       */

      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      currentY = addSectionTitle(
        "Service Cost Summary",
        currentY
      );

      autoTable(doc, {
        startY: currentY,
        head: [
          ["Service", "Cost", "Share"],
        ],
        body: serviceSummary.map((item) => {
          const percentage =
            totalCost > 0
              ? (item.cost / totalCost) * 100
              : 0;

          return [
            item.service,
            formatPdfCurrency(item.cost),
            `${percentage.toFixed(1)}%`,
          ];
        }),
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fontStyle: "bold",
        },
      });

      currentY =
        doc.lastAutoTable.finalY + 12;

      /*
       * --------------------------------------------------
       * Anomaly Summary
       * --------------------------------------------------
       */

      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      currentY = addSectionTitle(
        "Anomaly Summary",
        currentY
      );

      autoTable(doc, {
        startY: currentY,
        head: [
          ["Severity", "Count"],
        ],
        body: [
          [
            "Critical",
            severitySummary.Critical.toString(),
          ],
          [
            "High",
            severitySummary.High.toString(),
          ],
          [
            "Medium",
            severitySummary.Medium.toString(),
          ],
          [
            "Low",
            severitySummary.Low.toString(),
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fontStyle: "bold",
        },
      });

      currentY =
        doc.lastAutoTable.finalY + 10;

      /*
       * --------------------------------------------------
       * Detected Anomalies
       * --------------------------------------------------
       */

      if (anomalies.length > 0) {
        if (currentY > 240) {
          doc.addPage();
          currentY = 20;
        }

        currentY = addSectionTitle(
          "Detected Anomalies",
          currentY
        );

        autoTable(doc, {
          startY: currentY,
          head: [
            [
              "Date",
              "Provider",
              "Service",
              "Cost",
              "Severity",
            ],
          ],
          body: anomalies.map((item) => [
            item.Date || "-",
            item.Provider || "-",
            item.Service || "-",
            formatPdfCurrency(item.Cost),
            item.severity || "Unknown",
          ]),
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 2.5,
          },
          headStyles: {
            fontStyle: "bold",
          },
        });

        currentY =
          doc.lastAutoTable.finalY + 12;
      }

      /*
       * --------------------------------------------------
       * Forecast
       * --------------------------------------------------
       */

      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      currentY = addSectionTitle(
        "Cost Forecast",
        currentY
      );

      if (forecast) {
        autoTable(doc, {
          startY: currentY,
          head: [
            ["Forecast Metric", "Value"],
          ],
          body: [
            [
              "Historical Days",
              String(
                forecast.historical_days || 0
              ),
            ],
            [
              "Average Daily Cost",
              formatPdfCurrency(
                forecast.average_daily_cost
              ),
            ],
            [
              "Spending Trend",
              `${Number(
                forecast.trend_percentage || 0
              ).toFixed(1)}%`,
            ],
            [
              "Predicted 7-Day Cost",
              formatPdfCurrency(
                forecast.predicted_total
              ),
            ],
          ],
          theme: "grid",
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          headStyles: {
            fontStyle: "bold",
          },
        });

        currentY =
          doc.lastAutoTable.finalY + 12;
      } else {
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);

        doc.text(
          "Forecast information was not available.",
          14,
          currentY
        );

        doc.setTextColor(0, 0, 0);

        currentY += 12;
      }

      /*
       * --------------------------------------------------
       * Optimization Recommendations
       * --------------------------------------------------
       */

      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      currentY = addSectionTitle(
        "Optimization Recommendations",
        currentY
      );

      if (recommendations.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [
            [
              "Recommendation",
              "Service",
              "Priority",
              "Estimated Savings",
            ],
          ],
          body: recommendations.map(
            (recommendation) => [
              recommendation.title || "-",
              recommendation.service || "-",
              recommendation.priority || "-",
              formatPdfCurrency(
                recommendation.savings
              ),
            ]
          ),
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 2.5,
          },
          headStyles: {
            fontStyle: "bold",
          },
          columnStyles: {
            0: {
              cellWidth: 65,
            },
            1: {
              cellWidth: 35,
            },
            2: {
              cellWidth: 25,
            },
            3: {
              cellWidth: 45,
            },
          },
        });

        currentY =
          doc.lastAutoTable.finalY + 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(5, 150, 105);

        doc.text(
          `Total Potential Savings: ${formatPdfCurrency(
            totalPotentialSavings
          )}`,
          14,
          currentY
        );

        doc.setTextColor(0, 0, 0);

        currentY += 12;
      } else {
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);

        doc.text(
          "No optimization recommendations available.",
          14,
          currentY
        );

        doc.setTextColor(0, 0, 0);

        currentY += 12;
      }

      /*
       * --------------------------------------------------
       * Billing Data
       * --------------------------------------------------
       */

      if (currentY > 225) {
        doc.addPage();
        currentY = 20;
      }

      currentY = addSectionTitle(
        "Billing Data",
        currentY
      );

      autoTable(doc, {
        startY: currentY,
        head: [
          [
            "Date",
            "Provider",
            "Service",
            "Region",
            "Usage",
            "Unit",
            "Cost",
          ],
        ],
        body: billingData.map((item) => [
          item.Date || "-",
          item.Provider || "-",
          item.Service || "-",
          item.Region || "-",
          item.Usage || "-",
          item.Unit || "-",
          formatPdfCurrency(item.Cost),
        ]),
        theme: "grid",
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        headStyles: {
          fontStyle: "bold",
        },
      });

      /*
       * --------------------------------------------------
       * Footer on every page
       * --------------------------------------------------
       */

      const pageCount =
        doc.internal.getNumberOfPages();

      for (
        let page = 1;
        page <= pageCount;
        page++
      ) {
        doc.setPage(page);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);

        doc.text(
          `CloudSense AI | Page ${page} of ${pageCount}`,
          14,
          287
        );

        doc.setTextColor(0, 0, 0);
      }

      /*
       * --------------------------------------------------
       * Download PDF
       * --------------------------------------------------
       */

      doc.save("cloudsense-ai-report.pdf");
    } catch (error) {
      console.error(
        "Report export error:",
        error
      );

      setReportError(
        "Unable to export the report. Please try again."
      );
    }
  };

  /*
   * --------------------------------------------------
   * No billing data
   * --------------------------------------------------
   */

  if (!billingData || billingData.length === 0) {
    return (
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-2 text-slate-500">
            Generate a detailed cloud cost analysis
            report.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">
            📊
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            No billing data available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Upload a billing CSV file to generate
            your CloudSense AI report.
          </p>
        </div>
      </Layout>
    );
  }

  /*
   * --------------------------------------------------
   * Main report
   * --------------------------------------------------
   */

  return (
    <Layout>
      {/* Header */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-2 text-slate-500">
            Comprehensive cloud cost analysis
            generated by CloudSense AI.
          </p>
        </div>

        <button
          onClick={exportReport}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Export Report
        </button>
      </div>

      {/* Error */}

      {reportError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          {reportError}
        </div>
      )}

      {/* Summary Cards */}

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Cloud Cost
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatCurrency(totalCost)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Billing Records
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalRecords.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Detected Anomalies
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {anomalyCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Potential Savings
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {formatCurrency(
              totalPotentialSavings
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Predicted 7-Day Cost
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {forecastLoading
              ? "Loading..."
              : formatCurrency(
                  forecast?.predicted_total || 0
                )}
          </p>
        </div>
      </div>

      {/* Provider Summary */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Cloud Provider Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Total spending and percentage
            contribution by cloud provider.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">
                  Provider
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Cost
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Share
                </th>
              </tr>
            </thead>

            <tbody>
              {providerSummary.map(
                (item) => {
                  const percentage =
                    totalCost > 0
                      ? (item.cost /
                          totalCost) *
                        100
                      : 0;

                  return (
                    <tr
                      key={item.provider}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {item.provider}
                      </td>

                      <td className="px-6 py-4">
                        {formatCurrency(
                          item.cost
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {formatPercentage(
                          percentage
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Summary */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Service Cost Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Spending distribution across cloud
            services.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">
                  Service
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Cost
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Share
                </th>
              </tr>
            </thead>

            <tbody>
              {serviceSummary.map(
                (item) => {
                  const percentage =
                    totalCost > 0
                      ? (item.cost /
                          totalCost) *
                        100
                      : 0;

                  return (
                    <tr
                      key={item.service}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {item.service}
                      </td>

                      <td className="px-6 py-4">
                        {formatCurrency(
                          item.cost
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {formatPercentage(
                          percentage
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Summary */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Anomaly Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Billing records identified by the
            Isolation Forest anomaly detection
            model.
          </p>
        </div>

        {/* Severity cards */}

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-sm text-red-600">
              Critical
            </p>

            <p className="mt-1 text-2xl font-bold text-red-700">
              {severitySummary.Critical}
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-sm text-orange-600">
              High
            </p>

            <p className="mt-1 text-2xl font-bold text-orange-700">
              {severitySummary.High}
            </p>
          </div>

          <div className="rounded-xl bg-yellow-50 p-4">
            <p className="text-sm text-yellow-600">
              Medium
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-700">
              {severitySummary.Medium}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-green-600">
              Low
            </p>

            <p className="mt-1 text-2xl font-bold text-green-700">
              {severitySummary.Low}
            </p>
          </div>
        </div>

        {anomalies.length === 0 ? (
          <div className="border-t border-slate-100 p-8 text-center">
            <p className="font-semibold text-green-600">
              No anomalies detected
            </p>

            <p className="mt-1 text-sm text-slate-500">
              The current billing dataset does not
              contain detected unusual spending
              patterns.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Date
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Provider
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Service
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Cost
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Severity
                  </th>
                </tr>
              </thead>

              <tbody>
                {anomalies.map(
                  (item, index) => (
                    <tr
                      key={`${item.Date}-${item.Service}-${index}`}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4">
                        {item.Date}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {item.Provider}
                      </td>

                      <td className="px-6 py-4">
                        {item.Service}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {formatCurrency(
                          item.Cost
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.severity ===
                            "Critical"
                              ? "bg-red-100 text-red-700"
                              : item.severity ===
                                "High"
                              ? "bg-orange-100 text-orange-700"
                              : item.severity ===
                                "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.severity ||
                            "Unknown"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Forecast Summary */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Cost Forecast Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Seven-day cloud spending prediction
            generated from historical billing data.
          </p>
        </div>

        {forecastLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Generating forecast...
          </div>
        ) : forecast ? (
          <div className="grid gap-5 p-6 md:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm text-blue-600">
                Average Daily Cost
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-800">
                {formatCurrency(
                  forecast.average_daily_cost
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-600">
                Spending Trend
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {formatPercentage(
                  forecast.trend_percentage
                )}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-5">
              <p className="text-sm text-emerald-600">
                Predicted 7-Day Cost
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {formatCurrency(
                  forecast.predicted_total
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">
            Forecast information is not available.
          </div>
        )}
      </div>

      {/* Recommendations */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Optimization Recommendations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explainable recommendations generated
            by the CloudSense AI recommendation
            engine.
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No optimization recommendations
            available.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recommendations.map(
              (recommendation, index) => (
                <div
                  key={`${recommendation.title}-${index}`}
                  className="p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800">
                        {recommendation.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {recommendation.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {recommendation.service}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            recommendation.priority ===
                            "High"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {recommendation.priority}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Estimated Savings
                      </p>

                      <p className="mt-1 text-xl font-bold text-emerald-600">
                        {formatCurrency(
                          recommendation.savings
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="border-t border-slate-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-700">
            Total Potential Savings
          </p>

          <p className="mt-1 text-3xl font-bold text-emerald-800">
            {formatCurrency(
              totalPotentialSavings
            )}
          </p>
        </div>
      </div>

      {/* Report Information */}

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-800">
          CloudSense AI Report
        </h2>

        <p className="mt-2 text-sm leading-6 text-blue-700">
          This report combines billing analysis,
          cloud provider spending, service-level
          costs, Isolation Forest anomaly detection,
          cost forecasting, and explainable
          optimization recommendations into a single
          cloud cost management view.
        </p>

        {billingInfo?.filename && (
          <p className="mt-3 text-xs text-blue-600">
            Source file:{" "}
            <span className="font-semibold">
              {billingInfo.filename}
            </span>
          </p>
        )}
      </div>
    </Layout>
  );
}

export default Reports;


import { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import BillingImport from "../pages/BillingImport/BillingImport";
import Forecast from "../pages/Forecast/Forecast";
import Anomalies from "../pages/Anomalies/Anomalies";
import Analytics from "../pages/Analytics/Analytics";
import RecommendationsPage from "../pages/Recommendations/Recommendations";
import Reports from "../pages/Reports/Reports";

import { useBillingData } from "../context/BillingDataContext";

/* =========================================================
   AI ASSISTANT
   ========================================================= */

function AIAssistantPage() {
  const {
    billingData,
    anomalies,
    recommendations,
    totalPotentialSavings,
    totalCost,
    formatCurrency,
  } = useBillingData();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  /* ---------------------------------------------------------
     Provider summary
     --------------------------------------------------------- */

  const providerSummary = useMemo(() => {
    const summary = {};

    billingData.forEach((item) => {
      const provider = item.Provider || "Unknown";

      summary[provider] =
        (summary[provider] || 0) +
        Number(item.Cost || 0);
    });

    return summary;
  }, [billingData]);

  /* ---------------------------------------------------------
     Service summary
     --------------------------------------------------------- */

  const serviceSummary = useMemo(() => {
    const summary = {};

    billingData.forEach((item) => {
      const service = item.Service || "Unknown";

      summary[service] =
        (summary[service] || 0) +
        Number(item.Cost || 0);
    });

    return summary;
  }, [billingData]);

  const getHighestEntry = (summary) => {
    const entries = Object.entries(summary);

    if (!entries.length) {
      return null;
    }

    return entries.sort(
      (a, b) => b[1] - a[1]
    )[0];
  };

  /* ---------------------------------------------------------
     Generate assistant response
     --------------------------------------------------------- */

  const generateResponse = (rawQuestion) => {
    const text = rawQuestion
      .toLowerCase()
      .trim();

    if (!text) {
      return "Please enter a question about your cloud spending.";
    }

    if (!billingData.length) {
      return (
        "No billing data is currently loaded. " +
        "Please upload your billing CSV from the Billing Import page " +
        "so I can analyze your cloud spending."
      );
    }

    /* Total cost */

    if (
      text.includes("total cost") ||
      text.includes("total spending") ||
      text.includes("total spend") ||
      (text.includes("how much") &&
        text.includes("spend"))
    ) {
      return (
        `Your total cloud cost is ${formatCurrency(totalCost)} ` +
        `across ${billingData.length} billing records.`
      );
    }

    /* Provider */

    if (
      text.includes("provider") ||
      text.includes("cloud provider") ||
      text.includes("aws") ||
      text.includes("azure") ||
      text.includes("gcp")
    ) {
      const highestProvider =
        getHighestEntry(providerSummary);

      if (!highestProvider) {
        return "There is not enough provider data to analyze.";
      }

      const providerLines =
        Object.entries(providerSummary)
          .sort((a, b) => b[1] - a[1])
          .map(
            ([provider, cost]) =>
              `${provider}: ${formatCurrency(cost)}`
          )
          .join(", ");

      return (
        `Your highest-spending provider is ${highestProvider[0]} ` +
        `at ${formatCurrency(highestProvider[1])}. ` +
        `Provider spending is ${providerLines}.`
      );
    }

    /* Service */

    if (
      text.includes("service") ||
      text.includes("expensive service") ||
      text.includes("highest service")
    ) {
      const highestService =
        getHighestEntry(serviceSummary);

      if (!highestService) {
        return "There is not enough service data to analyze.";
      }

      return (
        `Your highest-spending service is ${highestService[0]} ` +
        `with ${formatCurrency(highestService[1])} in spending.`
      );
    }

    /* Anomalies */

    if (
      text.includes("anomal") ||
      text.includes("unusual") ||
      text.includes("abnormal")
    ) {
      if (!anomalies.length) {
        return (
          "No anomalies are currently available in the imported billing data."
        );
      }

      const critical =
        anomalies.filter(
          (item) =>
            item.severity === "Critical"
        ).length;

      const high =
        anomalies.filter(
          (item) =>
            item.severity === "High"
        ).length;

      const topAnomaly =
        anomalies[0];

      return (
        `I detected ${anomalies.length} billing anomalies. ` +
        `${critical} are Critical and ${high} are High severity. ` +
        `The highest-cost detected anomaly is ` +
        `${topAnomaly.Service || "Unknown Service"} ` +
        `at ${formatCurrency(topAnomaly.Cost)} ` +
        `on ${topAnomaly.Date || "an unknown date"}.`
      );
    }

    /* Recommendations */

    if (
      text.includes("recommend") ||
      text.includes("optimization") ||
      text.includes("optimize") ||
      text.includes("saving") ||
      text.includes("save")
    ) {
      if (!recommendations.length) {
        return (
          "No optimization recommendations are currently available."
        );
      }

      return (
        `CloudSense AI generated ${recommendations.length} ` +
        `optimization recommendations with an estimated potential ` +
        `saving of ${formatCurrency(totalPotentialSavings)}. ` +
        `The highest-priority recommendation is ` +
        `${recommendations[0].title || "the top optimization opportunity"}.`
      );
    }

    /* Forecast */

    if (
      text.includes("forecast") ||
      text.includes("future cost") ||
      text.includes("next 7") ||
      text.includes("next seven")
    ) {
      const dailyAverage =
        billingData.length > 0
          ? totalCost / billingData.length
          : 0;

      const estimatedSevenDay =
        dailyAverage * 7;

      return (
        `Based on the average daily spending in the uploaded data, ` +
        `the estimated cost for the next 7 days is approximately ` +
        `${formatCurrency(estimatedSevenDay)}. ` +
        `For the detailed ML forecast, visit the Forecast page.`
      );
    }

    /* Summary */

    if (
      text.includes("summary") ||
      text.includes("overview") ||
      text.includes("analyze my") ||
      text.includes("analysis")
    ) {
      const highestProvider =
        getHighestEntry(providerSummary);

      const highestService =
        getHighestEntry(serviceSummary);

      return (
        `Cloud spending summary: total cost is ` +
        `${formatCurrency(totalCost)} across ` +
        `${billingData.length} records. ` +
        `The highest-spending provider is ` +
        `${highestProvider?.[0] || "Unknown"} at ` +
        `${formatCurrency(highestProvider?.[1] || 0)}. ` +
        `The highest-spending service is ` +
        `${highestService?.[0] || "Unknown"} at ` +
        `${formatCurrency(highestService?.[1] || 0)}. ` +
        `There are ${anomalies.length} detected anomalies ` +
        `and ${recommendations.length} optimization recommendations.`
      );
    }

    /* Help */

    if (
      text.includes("help") ||
      text.includes("what can you") ||
      text.includes("what can i ask")
    ) {
      return (
        "You can ask me about your total cost, provider spending, " +
        "most expensive services, detected anomalies, optimization " +
        "recommendations, potential savings, forecasts, or request " +
        "an overall cloud spending summary."
      );
    }

    /* Default */

    return (
      "I can analyze your imported CloudSense billing data. " +
      "Try asking: \"What is my total cloud cost?\", " +
      "\"Which provider costs the most?\", " +
      "\"What anomalies were detected?\", or " +
      "\"How much can I save?\""
    );
  };

  /* ---------------------------------------------------------
     Ask question
     --------------------------------------------------------- */

  const handleAsk = (questionText = question) => {
    const cleanQuestion =
      questionText.trim();

    if (!cleanQuestion) {
      return;
    }

    const response =
      generateResponse(cleanQuestion);

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: cleanQuestion,
      },
      {
        type: "assistant",
        text: response,
      },
    ]);

    setQuestion("");
  };

  const suggestedQuestions = [
    "What is my total cloud cost?",
    "Which provider costs the most?",
    "What are my biggest anomalies?",
    "How much can I potentially save?",
    "Give me a summary of my cloud spending.",
  ];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          AI Assistant
        </h1>

        <p className="mt-2 text-slate-500">
          Ask questions about your cloud spending using natural language.
        </p>
      </div>

      {/* Status */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>
            <p className="font-semibold text-slate-900">
              CloudSense AI Assistant
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {billingData.length
                ? `Analyzing ${billingData.length} imported billing records.`
                : "Upload billing data to start the analysis."}
            </p>
          </div>

          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            â— Ready
          </div>

        </div>

      </div>

      {/* Chat */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="min-h-[280px] max-h-[500px] space-y-4 overflow-y-auto p-6">

          {messages.length === 0 ? (

            <div className="py-8 text-center">

              <div className="text-4xl">
                â˜ï¸
              </div>

              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                How can I help?
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                Ask questions about your cloud costs, anomalies,
                providers, services, forecasts, and optimization opportunities.
              </p>

            </div>

          ) : (

            messages.map((message, index) => (

              <div
                key={index}
                className={
                  message.type === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >

                <div
                  className={
                    message.type === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm text-white"
                      : "max-w-[80%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-700"
                  }
                >
                  {message.text}
                </div>

              </div>

            ))

          )}

        </div>

        {/* Input */}

        <div className="border-t border-slate-200 p-4">

          <div className="flex gap-3">

            <input
              type="text"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAsk();
                }
              }}
              placeholder="Ask about your cloud spending..."
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => handleAsk()}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Ask
            </button>

          </div>

        </div>

      </div>

      {/* Suggested questions */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Suggested questions
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">

          {suggestedQuestions.map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleAsk(item)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {item}
              </button>
            )
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SETTINGS
   ========================================================= */

function SettingsPage() {
  const {
    billingData,
    clearBillingData,
    currency,
    updateCurrency,
  } = useBillingData();

  const [assistantStyle, setAssistantStyle] =
    useState(
      () =>
        localStorage.getItem(
          "cloudsense_assistant_style"
        ) || "Detailed"
    );

  const [backendStatus, setBackendStatus] =
    useState("Not checked");

  const [message, setMessage] =
    useState("");

  /* Save assistant style */

  useEffect(() => {
    localStorage.setItem(
      "cloudsense_assistant_style",
      assistantStyle
    );
  }, [assistantStyle]);

  /* Backend health */

  const checkBackend = async () => {
    setBackendStatus("Checking...");

    try {
      const response =
        await fetch(
          "http://127.0.0.1:8000/health"
        );

      if (!response.ok) {
        throw new Error(
          "Backend unavailable"
        );
      }

      const result =
        await response.json();

      if (
        result.status === "healthy"
      ) {
        setBackendStatus(
          "Connected"
        );
      } else {
        setBackendStatus(
          "Unavailable"
        );
      }

    } catch (error) {
      setBackendStatus(
        "Unavailable"
      );
    }
  };

  /* Clear billing data */

  const handleClearData = () => {
    const confirmed =
      window.confirm(
        "Clear the currently imported billing data? This will reset the data used by the dashboard and other analysis pages."
      );

    if (!confirmed) {
      return;
    }

    clearBillingData();

    setMessage(
      "Imported billing data has been cleared."
    );

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage CloudSense AI preferences and application settings.
        </p>
      </div>

      {/* Success message */}

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}

      {/* Preferences */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Application preferences
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          {/* Currency */}

          <div>

            <label className="block text-sm font-medium text-slate-700">
              Currency
            </label>

            <p className="mt-1 text-xs text-slate-500">
              Used throughout CloudSense AI when displaying monetary values.
            </p>

            <select
              value={currency}
              onChange={(event) =>
                updateCurrency(
                  event.target.value
                )
              }
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="USD">
                USD ($)
              </option>

              <option value="INR">
                INR (â‚¹)
              </option>

              <option value="GBP">
                GBP (Â£)
              </option>

              <option value="EUR">
                EUR (â‚¬)
              </option>
            </select>

          </div>

          {/* Assistant style */}

          <div>

            <label className="block text-sm font-medium text-slate-700">
              AI Assistant response style
            </label>

            <p className="mt-1 text-xs text-slate-500">
              Preference saved for your CloudSense AI session.
            </p>

            <select
              value={assistantStyle}
              onChange={(event) =>
                setAssistantStyle(
                  event.target.value
                )
              }
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Detailed">
                Detailed
              </option>

              <option value="Concise">
                Concise
              </option>
            </select>

          </div>

        </div>

      </div>

      {/* Backend */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Backend connection
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Check whether the CloudSense AI FastAPI backend is running.
            </p>

          </div>

          <button
            type="button"
            onClick={checkBackend}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Check connection
          </button>

        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

          <span
            className={
              backendStatus === "Connected"
                ? "h-3 w-3 rounded-full bg-emerald-500"
                : backendStatus === "Unavailable"
                ? "h-3 w-3 rounded-full bg-red-500"
                : "h-3 w-3 rounded-full bg-slate-400"
            }
          />

          <span className="text-sm font-medium text-slate-700">
            {backendStatus}
          </span>

        </div>

      </div>

      {/* Data management */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Data management
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage the billing data currently stored in the application session.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">

          <div>

            <p className="text-sm font-medium text-slate-800">
              Imported billing records
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {billingData.length} records currently loaded
            </p>

          </div>

          <button
            type="button"
            onClick={handleClearData}
            disabled={!billingData.length}
            className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear billing data
          </button>

        </div>

      </div>

      {/* Application information */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Application information
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Application
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              CloudSense AI
            </p>

          </div>

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Version
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              1.0.0
            </p>

          </div>

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Frontend
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              React + Vite
            </p>

          </div>

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Backend
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              FastAPI + Python
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   APPLICATION ROUTES
   ========================================================= */

function AppRoutes() {
  return (
    <Routes>

      {/* Default Route */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* Dashboard */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* Billing Import */}

      <Route
        path="/billing"
        element={<BillingImport />}
      />

      {/* Analytics */}

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      {/* Anomaly Detection */}

      <Route
        path="/anomalies"
        element={<Anomalies />}
      />

      {/* Cost Forecast */}

      <Route
        path="/forecast"
        element={<Forecast />}
      />

      {/* Recommendations */}

      <Route
        path="/recommendations"
        element={<RecommendationsPage />}
      />

      {/* Reports */}

      <Route
        path="/reports"
        element={<Reports />}
      />

      {/* AI Assistant */}

      <Route
        path="/ai-assistant"
        element={<AIAssistantPage />}
      />

      {/* Settings */}

      <Route
        path="/settings"
        element={<SettingsPage />}
      />

      {/* Unknown Routes */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;

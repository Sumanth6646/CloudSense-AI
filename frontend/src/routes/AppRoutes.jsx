import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Layout from "../components/layout/Layout";

function PlaceholderPage({ title, description }) {
  return (
    <Layout>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="text-slate-500">
          {description}
        </p>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="font-semibold text-blue-700">
            This module is currently under development.
          </p>

          <p className="mt-2 text-sm text-blue-600">
            It will be connected to the CloudSense AI backend and machine
            learning modules in the upcoming phases.
          </p>
        </div>
      </div>
    </Layout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/billing"
        element={
          <PlaceholderPage
            title="Billing Import"
            description="Import and validate cloud billing data from AWS, Azure, or Google Cloud."
          />
        }
      />

      <Route
        path="/analytics"
        element={
          <PlaceholderPage
            title="Analytics"
            description="Explore detailed cloud spending trends and service-level cost analytics."
          />
        }
      />

      <Route
        path="/anomalies"
        element={
          <PlaceholderPage
            title="Anomaly Detection"
            description="Identify unusual cloud spending patterns and investigate cost spikes."
          />
        }
      />

      <Route
        path="/forecast"
        element={
          <PlaceholderPage
            title="Cost Forecast"
            description="View predicted cloud spending and projected month-end costs."
          />
        }
      />

      <Route
        path="/recommendations"
        element={
          <PlaceholderPage
            title="Recommendations"
            description="Review AI-generated cloud cost optimization opportunities."
          />
        }
      />

      <Route
        path="/reports"
        element={
          <PlaceholderPage
            title="Reports"
            description="Generate and review cloud cost analysis reports."
          />
        }
      />

      <Route
        path="/ai-assistant"
        element={
          <PlaceholderPage
            title="AI Assistant"
            description="Ask questions about your cloud spending using natural language."
          />
        }
      />

      <Route
        path="/settings"
        element={
          <PlaceholderPage
            title="Settings"
            description="Manage CloudSense AI preferences and application settings."
          />
        }
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
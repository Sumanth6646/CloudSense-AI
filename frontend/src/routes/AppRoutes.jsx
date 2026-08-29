import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import BillingImport from "../pages/BillingImport/BillingImport";
import Forecast from "../pages/Forecast/Forecast";
import Anomalies from "../pages/Anomalies/Anomalies";
import Analytics from "../pages/Analytics/Analytics";


function PlaceholderPage({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-2 text-2xl font-bold text-slate-900">
        {title}
      </div>

      <p className="text-slate-500">
        {description}
      </p>

      <div className="mt-6 rounded-xl bg-blue-50 p-5">

        <p className="font-medium text-blue-700">
          This module is currently under development.
        </p>

        <p className="mt-1 text-sm text-blue-600">
          It will be connected to the CloudSense AI backend
          in the upcoming phases.
        </p>

      </div>

    </div>
  );
}


function AppRoutes() {
  return (
    <Routes>

      {/* ==================================================
          Default Route
      ================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />


      {/* ==================================================
          Dashboard
      ================================================== */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />


      {/* ==================================================
          Billing Import
      ================================================== */}

      <Route
        path="/billing"
        element={<BillingImport />}
      />


      {/* ==================================================
          Analytics
      ================================================== */}

      <Route
        path="/analytics"
        element={<Analytics />}
      />


      {/* ==================================================
          Anomaly Detection
      ================================================== */}

      <Route
        path="/anomalies"
        element={<Anomalies />}
      />


      {/* ==================================================
          Cost Forecast
      ================================================== */}

      <Route
        path="/forecast"
        element={<Forecast />}
      />


      {/* ==================================================
          Recommendations
      ================================================== */}

      <Route
        path="/recommendations"
        element={
          <PlaceholderPage
            title="AI Recommendations"
            description="Review AI-generated cloud cost optimization opportunities."
          />
        }
      />


      {/* ==================================================
          Reports
      ================================================== */}

      <Route
        path="/reports"
        element={
          <PlaceholderPage
            title="Reports"
            description="Generate and review cloud cost analysis reports."
          />
        }
      />


      {/* ==================================================
          AI Assistant
      ================================================== */}

      <Route
        path="/ai-assistant"
        element={
          <PlaceholderPage
            title="AI Assistant"
            description="Ask questions about your cloud spending using natural language."
          />
        }
      />


      {/* ==================================================
          Settings
      ================================================== */}

      <Route
        path="/settings"
        element={
          <PlaceholderPage
            title="Settings"
            description="Manage CloudSense AI preferences and application settings."
          />
        }
      />


      {/* ==================================================
          Unknown Routes
      ================================================== */}

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
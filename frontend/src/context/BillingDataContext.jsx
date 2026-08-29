import { createContext, useContext, useState } from "react";

const BillingDataContext = createContext(null);

export function BillingDataProvider({ children }) {
  const [billingData, setBillingData] = useState([]);
  const [billingInfo, setBillingInfo] = useState(null);
  const [anomalies, setAnomalies] = useState([]);

  // --------------------------------------------------
  // Recommendation State
  // --------------------------------------------------

  const [recommendations, setRecommendations] = useState([]);
  const [totalPotentialSavings, setTotalPotentialSavings] =
    useState(0);

  // --------------------------------------------------
  // Update Billing Data
  // --------------------------------------------------

  const updateBillingData = (result) => {
    /*
     * Backend returns something similar to:
     *
     * {
     *   data: [...billing records],
     *   anomalies: [...ML anomalies],
     *   total_cost: ...,
     * }
     */

    if (Array.isArray(result)) {
      setBillingData(result);
      setBillingInfo(null);
      setAnomalies([]);

      // Clear recommendations when raw data is supplied
      setRecommendations([]);
      setTotalPotentialSavings(0);

      return;
    }

    setBillingData(
      Array.isArray(result?.data)
        ? result.data
        : []
    );

    setBillingInfo(result || null);

    setAnomalies(
      Array.isArray(result?.anomalies)
        ? result.anomalies
        : []
    );

    /*
     * If the backend already provides recommendations,
     * store them here.
     */

    setRecommendations(
      Array.isArray(result?.recommendations)
        ? result.recommendations
        : []
    );

    setTotalPotentialSavings(
      Number(
        result?.total_potential_savings || 0
      )
    );
  };

  // --------------------------------------------------
  // Update Recommendations
  // --------------------------------------------------

  const updateRecommendations = (result) => {
    if (!result) {
      setRecommendations([]);
      setTotalPotentialSavings(0);
      return;
    }

    setRecommendations(
      Array.isArray(result?.recommendations)
        ? result.recommendations
        : []
    );

    setTotalPotentialSavings(
      Number(
        result?.total_potential_savings || 0
      )
    );
  };

  // --------------------------------------------------
  // Clear All Billing Data
  // --------------------------------------------------

  const clearBillingData = () => {
    setBillingData([]);
    setBillingInfo(null);
    setAnomalies([]);

    setRecommendations([]);
    setTotalPotentialSavings(0);
  };

  // --------------------------------------------------
  // Calculate Total Cost
  // --------------------------------------------------

  const totalCost = billingData.reduce(
    (total, item) =>
      total + Number(item.Cost || 0),
    0
  );

  // --------------------------------------------------
  // Context Provider
  // --------------------------------------------------

  return (
    <BillingDataContext.Provider
      value={{
        // Billing
        billingData,
        billingInfo,
        totalCost,

        // Anomalies
        anomalies,

        // Recommendations
        recommendations,
        totalPotentialSavings,

        // Functions
        updateBillingData,
        updateRecommendations,
        clearBillingData,
      }}
    >
      {children}
    </BillingDataContext.Provider>
  );
}

// --------------------------------------------------
// Custom Hook
// --------------------------------------------------

export function useBillingData() {
  const context = useContext(
    BillingDataContext
  );

  if (!context) {
    throw new Error(
      "useBillingData must be used inside BillingDataProvider"
    );
  }

  return context;
}
import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  formatCurrency,
  getCurrency,
} from "../utils/currency";

const BillingDataContext = createContext(null);

export function BillingDataProvider({ children }) {
  const [billingData, setBillingData] = useState([]);
  const [billingInfo, setBillingInfo] = useState(null);
  const [anomalies, setAnomalies] = useState([]);

  const [recommendations, setRecommendations] =
    useState([]);

  const [totalPotentialSavings, setTotalPotentialSavings] =
    useState(0);

  const [currency, setCurrencyState] = useState(
    getCurrency()
  );

  const updateBillingData = (result) => {
    if (Array.isArray(result)) {
      setBillingData(result);
      setBillingInfo(null);
      setAnomalies([]);
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

  const updateCurrency = (newCurrency) => {
    localStorage.setItem(
      "cloudsense_currency",
      newCurrency
    );

    setCurrencyState(newCurrency);
  };

  const clearBillingData = () => {
    setBillingData([]);
    setBillingInfo(null);
    setAnomalies([]);
    setRecommendations([]);
    setTotalPotentialSavings(0);
  };

  const totalCost = billingData.reduce(
    (total, item) =>
      total + Number(item.Cost || 0),
    0
  );

  return (
    <BillingDataContext.Provider
      value={{
        billingData,
        billingInfo,
        totalCost,
        anomalies,
        recommendations,
        totalPotentialSavings,

        currency,

        formatCurrency: (value, options = {}) =>
          formatCurrency(
            value,
            currency,
            options
          ),

        updateCurrency,

        updateBillingData,
        updateRecommendations,
        clearBillingData,
      }}
    >
      {children}
    </BillingDataContext.Provider>
  );
}

export function useBillingData() {
  const context =
    useContext(BillingDataContext);

  if (!context) {
    throw new Error(
      "useBillingData must be used inside BillingDataProvider"
    );
  }

  return context;
}
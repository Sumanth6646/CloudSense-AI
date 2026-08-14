import { createContext, useContext, useState } from "react";

const BillingDataContext = createContext(null);

export function BillingDataProvider({ children }) {
  const [billingData, setBillingData] = useState([]);

  const updateBillingData = (data) => {
    setBillingData(data);
  };

  const clearBillingData = () => {
    setBillingData([]);
  };

  const totalCost = billingData.reduce(
    (total, item) => total + Number(item.Cost || 0),
    0
  );

  return (
    <BillingDataContext.Provider
      value={{
        billingData,
        updateBillingData,
        clearBillingData,
        totalCost,
      }}
    >
      {children}
    </BillingDataContext.Provider>
  );
}

export function useBillingData() {
  const context = useContext(BillingDataContext);

  if (!context) {
    throw new Error(
      "useBillingData must be used inside BillingDataProvider"
    );
  }

  return context;
}
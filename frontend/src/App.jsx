import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { BillingDataProvider } from "./context/BillingDataContext";

function App() {
  return (
    <BrowserRouter>
      <BillingDataProvider>
        <AppRoutes />
      </BillingDataProvider>
    </BrowserRouter>
  );
}

export default App;
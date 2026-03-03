import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrdersPage from "./pages/OrdersPage";
import MenuPage from "./pages/MenuPage";
import { usePWAUpdate } from "./usePWAUpdate";

function App() {
  const { needRefresh, updateServiceWorker } = usePWAUpdate();

  return (
    <Router>
      {needRefresh && (
        <div className="update-banner">
          New version available
          <button onClick={() => updateServiceWorker(true)}>
            Update
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrdersPage from "./pages/OrdersPage";
import MenuPage from "./pages/MenuPage";
import { usePWAUpdate } from "./usePWAUpdate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { needRefresh, updateServiceWorker } = usePWAUpdate();

  return (
    <Router>
      {/* {needRefresh && (
        <div className="update-banner">
          New version available
          <button onClick={() => updateServiceWorker(true)}>
            Update
          </button>
        </div>
      )} */}
      <>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        {/* your routes */}
      </>
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  );
}

export default App;
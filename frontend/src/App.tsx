import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MfaVerifyPage from "./pages/MfaVerifyPage";
import MePage from "./pages/MePage";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mfa/verify" element={<MfaVerifyPage />} />
        <Route
          path="/me"
          element={
            <PrivateRoute>
              <MePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

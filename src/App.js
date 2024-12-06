import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginPage user={user} setUser={setUser} />}
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

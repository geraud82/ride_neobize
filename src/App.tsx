import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import BookingPage from "./BookingPage";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008';

// Create a context for API URL to be used throughout the app
export const ApiContext = React.createContext(API_URL);

export default function App() {
  return (
    <ApiContext.Provider value={API_URL}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ApiContext.Provider>
  );
}

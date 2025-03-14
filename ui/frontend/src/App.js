import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Query from "./pages/Query";
import Dashboard from "./pages/Dashboard";
import Data from "./pages/Data";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import UserPage from "./pages/AdminUserPage";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />}/>                    
        <Route path="/query" element={<Query />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data" element={<Data />} />
        <Route path="/users" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

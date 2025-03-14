// src/components/Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const handleSectionScroll = (sectionId) => {
    if (location.pathname === "/" || location.pathname === "/dashboard") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="navbar">
      <div className="brand">
        <Link to="/">
          <img src="/images/logo.png" alt="logo" className="logo" />
        </Link>
        <span className="mpdb-studio">MPDB-STUDIO</span>
      </div>
      <div className="buttons">
        <Link to="/dashboard">
          <button className="navbar-button">Dash</button>
        </Link>
        <Link to="/data">
          <button className="navbar-button">Data</button>
        </Link>
        <Link to="/query">
          <button className="navbar-button">Query</button>
        </Link>
        <Link to="/users">
          <button className="navbar-button">Users</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

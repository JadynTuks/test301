import React from "react";

const Navbar = () => {
    return (
        <div id="nav-wrapper">
            <div id="navbar">
                <a href="#" id="logo">MPDB Studio</a>
                <span id="pages">
                    <a href="data" className="navbar-button">Data</a>
                    <a href="dashboard" className="navbar-button">Dashboard</a>
                    <a href="query" className="navbar-button">Query</a>
                    <a href="users" className="navbar-button">Users</a>
                </span>
            </div>
        </div>
    );
};

export default Navbar;
// Dashboard.js
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "../styles/Dashboard.css";
// import Navbar from "../components/Navbar";

const Dashboard = () => {
  // pie-chart data (Most Used Operator)
  const [data, setData] = useState([
    { name: "$AND", value: 60 },
    { name: "$OR", value: 25 },
    { name: "$NOT", value: 15 },
  ]);

  // bar-chart data (CRUD Operation Frequency)
  const [crudData, setCrudData] = useState([
    { operation: "Create", count: 120 },
    { operation: "Read", count: 300 },
    { operation: "Update", count: 150 },
    { operation: "Delete", count: 90 },
  ]);

  // new state for user database stats
  const [userDbStats, setUserDbStats] = useState({
    mostQueriedDb: "UsersDB",
    mostQueriedCollection: "Profiles",
    mostDocumentsCollection: "Logs",
    leastDocumentsCollection: "Settings",
  });

  // new state for system-wide stats
  const [systemStats, setSystemStats] = useState({
    totalUserAccounts: 156,
    highestQueryUser: "admin@mpdb.com",
    mostQueriedDb: "ProductsDB",
    mostQueriedCollection: "Inventory",
  });

  // top users data for bar-chart
  const [topUsersData, setTopUsersData] = useState([
    { name: "admin@mpdb.com", queries: 432 },
    { name: "john.doe@example.com", queries: 321 },
    { name: "jane.smith@example.com", queries: 287 },
    { name: "dev.team@company.com", queries: 245 },
    { name: "support@helpdesk.com", queries: 198 },
  ]);

  const COLORS = ["#8A2BE2", "#0000CD", "#FF00FF"]; // BlueViolet for $AND, MediumBlue for $OR, Magenta for $NOT

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        { name: "$AND", value: 50 },
        { name: "$OR", value: 30 },
        { name: "$NOT", value: 20 },
      ]);

      setCrudData([
        { operation: "Create", count: 140 },
        { operation: "Read", count: 320 },
        { operation: "Update", count: 160 },
        { operation: "Delete", count: 100 },
      ]);

      // update user DB stats after "API call"
      setUserDbStats({
        mostQueriedDb: "AnalyticsDB",
        mostQueriedCollection: "Logs",
        mostDocumentsCollection: "Transactions",
        leastDocumentsCollection: "Reports",
      });

      // update system stats after "API call"
      setSystemStats({
        totalUserAccounts: 178,
        highestQueryUser: "admin@mpdb.com",
        mostQueriedDb: "InventoryDB",
        mostQueriedCollection: "Inventory",
      });

      // update top users data
      setTopUsersData([
        { name: "admin@mpdb.com", queries: 458 },
        { name: "john.doe@example.com", queries: 347 },
        { name: "jane.smith@example.com", queries: 298 },
        { name: "dev.team@company.com", queries: 263 },
        { name: "support@helpdesk.com", queries: 219 },
      ]);
    }, 2000); // simul. API delay

    // cleanup function to clear the timeout when component unmounts
    return () => clearTimeout(timer);
  }, []);

  // funct. to get the correct color for each seg.
  const getColor = (index) => {
    if (index < 0 || index >= data.length) return COLORS[0];
    const dataName = data[index].name;
    if (dataName === "$AND") return "#8A2BE2"; // BlueViolet
    if (dataName === "$OR") return "#0000CD"; // MediumBlue
    if (dataName === "$NOT") return "#FF00FF"; // Magenta
    return COLORS[index % COLORS.length]; // Fallback
  };

  return (
    <div className="container">
      {/* <Navbar /> */}
      {/* main content */}
      <div className="main-content">
        {/* user stats */}
        <div className="stats-section" id="user-stats">
          <h2 className="section-title">User Stats</h2>
          <div className="grid-container">
            {/* pie-chart (Most Used Operator) */}
            <div className="pie-chart-container">
              <span>Most Used Operator:</span>
              <div className="chart-wrapper">
                <PieChart width={250} height={250}>
                  <Pie
                    data={data}
                    cx={125}
                    cy={100}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(index)} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: "#FFFFFF" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </div>
            </div>

            {/* First row of stat boxes */}
            <div className="stat-box">
              <div className="stat-title">Total Queries Made:</div>
              <div className="stat-value">112</div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Total Databases:</div>
              <div className="stat-value">31</div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Total Collections:</div>
              <div className="stat-value">93</div>
            </div>

            {/* Second row of stat boxes */}
            <div className="stat-box">
              <div className="stat-title">Your largest Database:</div>
              <div className="stat-value">UsersDB</div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Your most Queried Database:</div>
              <div className="stat-value">{userDbStats.mostQueriedDb}</div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Your most Queried Collection:</div>
              <div className="stat-value">
                {userDbStats.mostQueriedCollection}
              </div>
            </div>

            {/* Third row of stat boxes */}
            <div className="stat-box">
              <div className="stat-title">Collection with Most Docs:</div>
              <div className="stat-value">
                {userDbStats.mostDocumentsCollection}
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Collection with Least Docs:</div>
              <div className="stat-value">
                {userDbStats.leastDocumentsCollection}
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Database with Most Collections:</div>
              <div className="stat-value">
                {userDbStats.leastDocumentsCollection}
              </div>
            </div>
          </div>
        </div>

        {/* syst-wide stats */}
        <div className="stats-section" id="system-stats">
          <h2 className="section-title">System-wide Stats</h2>

          <div className="grid-container system-stats-grid">
            {/* System-wide stat boxes in a 2x2 grid */}
            <div className="stat-box">
              <div className="stat-title">Total User Accounts:</div>
              <div className="stat-value">{systemStats.totalUserAccounts}</div>
            </div>

            <div className="stat-box">
              <div className="stat-title">User with Highest Queries:</div>
              <div className="stat-value">{systemStats.highestQueryUser}</div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Most Queried Database:</div>
              <div className="stat-value">{systemStats.mostQueriedDb}</div>
            </div>

            <div className="stat-box">
              <div className="stat-title">Most Queried Collection:</div>
              <div className="stat-value">
                {systemStats.mostQueriedCollection}
              </div>
            </div>
          </div>

          {/* Charts section with horizontal layout */}
          <div className="charts-container horizontal">
            {/* bar chart: CRUD Operation Frequency */}
            <div className="crud-chart-container">
              <h2>CRUD Operation Frequency</h2>
              <div className="chart-wrapper">
                <BarChart
                  width={400}
                  height={300}
                  data={crudData}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="operation" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      color: "#000",
                    }}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </div>
            </div>

            {/* New bar chart: Top Users by Query Count */}
            <div className="crud-chart-container top-users-chart">
              <h2>Top Users by Query Count</h2>
              <div className="chart-wrapper">
                <BarChart
                  width={400}
                  height={300}
                  data={topUsersData}
                  margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      color: "#000",
                    }}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Bar dataKey="queries" fill="#673ab7" />
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

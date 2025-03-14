// Data.js
import React, { useState } from "react";
import "../styles/Data.css";
// import Navbar from "../components/Navbar";

// Mock databases and collections
const mockDatabases = [
  {
    name: "UsersDB",
    collections: [
      "Profiles",
      "Transactions",
      "Logs",
      "Profiles",
      "Transactions",
      "Logs",
      "Profiles",
      "Transactions",
    ],
  },
  {
    name: "InventoryDB",
    collections: [
      "Products",
      "Suppliers",
      "Orders",
      "Products",
      "Suppliers",
      "Orders",
    ],
  },
  {
    name: "AnalyticsDB",
    collections: [
      "Reports",
      "Metrics",
      "Events",
      "Reports",
      "Metrics",
      "Events",
    ],
  },
  {
    name: "UsersDB2",
    collections: [
      "Profiles",
      "Transactions",
      "Logs",
      "Profiles",
      "Transactions",
      "Logs",
      "Profiles",
    ],
  },
  {
    name: "InventoryDB2",
    collections: [
      "Products",
      "Suppliers",
      "Orders",
      "Products",
      "Suppliers",
      "Orders",
      "Products",
    ],
  },
  {
    name: "AnalyticsDB2",
    collections: [
      "Reports",
      "Metrics",
      "Events",
      "Reports",
      "Metrics",
      "Events",
      "Reports",
    ],
  },
  {
    name: "InventoryDB3",
    collections: [
      "Products",
      "Suppliers",
      "Orders",
      "Products",
      "Suppliers",
      "Orders",
      "Products",
    ],
  },
  {
    name: "AnalyticsDB3",
    collections: [
      "Reports",
      "Metrics",
      "Events",
      "Reports",
      "Metrics",
      "Events",
      "Reports",
    ],
  },
];

// Mock json documents
const mockDocuments = {
  Profiles: [
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 },
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 },
  ],
  Transactions: [
    { id: "T001", amount: 200, status: "Completed" },
    { id: "T002", amount: 150, status: "Pending" },
    { id: "T001", amount: 200, status: "Completed" },
    { id: "T002", amount: 150, status: "Pending" },
  ],
  Logs: [
    { timestamp: "2024-03-09T12:00:00Z", event: "Login Attempt" },
    { timestamp: "2024-03-09T12:05:00Z", event: "Password Change" },
    { timestamp: "2024-03-09T12:00:00Z", event: "Login Attempt" },
    { timestamp: "2024-03-09T12:05:00Z", event: "Password Change" },
  ],
  Products: [
    { id: "P001", name: "Laptop", stock: 50 },
    { id: "P002", name: "Mouse", stock: 200 },
    { id: "P001", name: "Laptop", stock: 50 },
    { id: "P002", name: "Mouse", stock: 200 },
  ],
  Suppliers: [
    { id: "S001", name: "TechSupply Inc." },
    { id: "S002", name: "GadgetWorld" },
    { id: "S001", name: "TechSupply Inc." },
    { id: "S002", name: "GadgetWorld" },
  ],
  Orders: [
    { id: "O001", total: 500, status: "Shipped" },
    { id: "O002", total: 1200, status: "Processing" },
    { id: "O001", total: 500, status: "Shipped" },
    { id: "O002", total: 1200, status: "Processing" },
  ],
  Reports: [{ id: "R001", title: "Monthly Sales", generated: "2024-03-01" }],
  Metrics: [{ metric: "Users Online", value: 120 }],
  Events: [{ id: "E001", name: "System Update", date: "2024-03-15" }],
};

// Back arrow SVG component
const BackArrowIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path
      d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414L7.828 11z"
      fill="currentColor"
    ></path>
  </svg>
);

const Data = () => {
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      {/* <Navbar /> add Navbar */}
      {/* main content */}
      <div className="custom-bg text-gray-300 p-6">
        {selectedDatabase === null ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Select a Database</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockDatabases.map((db, index) => (
                <div
                  key={index}
                  className="bg-gray-300 p-4 cursor-pointer hover:bg-gray-400"
                  onClick={() => setSelectedDatabase(db)}
                >
                  {db.name}
                </div>
              ))}
            </div>
          </>
        ) : selectedCollection === null ? (
          <>
            <button
              className="cssbuttons-io"
              onClick={() => setSelectedDatabase(null)}
            >
              <span>
                <BackArrowIcon />
                Back to Databases
              </span>
            </button>
            <h2 className="text-lg font-semibold mb-2">
              Collections in {selectedDatabase.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedDatabase.collections.map((collection, index) => (
                <div
                  key={index}
                  className="bg-gray-300 p-4 cursor-pointer hover:bg-gray-400"
                  onClick={() => setSelectedCollection(collection)}
                >
                  {collection}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              className="cssbuttons-io"
              onClick={() => setSelectedCollection(null)}
            >
              <span>
                <BackArrowIcon />
                Back to Collections
              </span>
            </button>
            <h2 className="text-lg font-semibold mb-2">
              Documents in {selectedCollection}
            </h2>
            <div className="json-container">
              <pre className="bg-gray-300 p-4 overflow-auto rounded">
                {JSON.stringify(
                  mockDocuments[selectedCollection] || [],
                  null,
                  2
                )}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Data;

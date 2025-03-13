import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Query from "./pages/Query";
import Navbar from "./components/Navbar";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <div id="content">
                <Routes>
                    <Route path="/" element={<Query />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;

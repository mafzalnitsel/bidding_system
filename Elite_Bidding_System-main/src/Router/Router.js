import React from "react";
import LoginForm from "../Screens/Login/index";
import Bidding from "../Screens/BidState";
import Material from "../Screens/MeterialPackages";
import Consumeable from "../Screens/ConsumablePackages";
import BidElement from "../Screens/BidElement";
import Dashboard from "../Screens/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PackageElement from "../Screens/PackageElement";
import Indirect from "../Screens/Indirect";
function path() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/Bidding" element={<Bidding />} />
          {/* <Route path="/Material" element={<Material />} /> */}
          <Route path="/Packages" element={<Material />} />
          <Route path="/BidElement" element={<BidElement />} />
          <Route path="/PackageElement" element={<PackageElement />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Indirect" element={<Indirect />} />
          {/* <Route path="/New" element={<New />} /> */}
          {/* <Route path="/Consumable" element={<Consumeable />} /> */}
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default path;

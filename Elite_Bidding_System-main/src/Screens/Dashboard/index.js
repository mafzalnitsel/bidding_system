import React from "react";
import { Header } from "../../Utils";
import "./index.css";
import Sidebar from "./components/Sidebar";
import BarChartDashboard from "./components/BarChart";
import LineChartDashboard from "./components/LineChart";
import AreaChartDashboard from "./components/AreaChart";
import PieChartDashboard from "./components/PieChart";

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-main">
          <div className="dashboard-content">
            <div className="card-container">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="card">
                  <h2>Card {index + 1}</h2>
                  <p>This is some content for card {index + 1}.</p>
                </div>
              ))}
            </div>
            <div className="chart-container">
              <LineChartDashboard />
              {/* <PieChartDashboard /> */}
              {/* <BarChartDashboard /> */}
            </div>
            <div className="chart-container">
              <AreaChartDashboard />
              <PieChartDashboard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

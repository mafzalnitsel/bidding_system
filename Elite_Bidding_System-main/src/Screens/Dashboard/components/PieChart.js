import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", sales: 4500, profit: 1125, revenue: 5625 },
  { name: "Feb", sales: 5200, profit: 1300, revenue: 6500 },
  { name: "Mar", sales: 6100, profit: 1830, revenue: 7930 },
  { name: "Apr", sales: 4800, profit: 1200, revenue: 6000 },
  { name: "May", sales: 5300, profit: 1325, revenue: 6625 },
  { name: "Jun", sales: 6200, profit: 1550, revenue: 7750 },
  { name: "Jul", sales: 7000, profit: 2100, revenue: 9100 },
  { name: "Aug", sales: 7500, profit: 2250, revenue: 9750 },
  { name: "Sep", sales: 6800, profit: 1700, revenue: 8500 },
  { name: "Oct", sales: 7200, profit: 2160, revenue: 9360 },
  { name: "Nov", sales: 6100, profit: 1525, revenue: 7625 },
  { name: "Dec", sales: 8000, profit: 2400, revenue: 10400 },
];

const PieChartDashboard = () => {
  return (
    <div className="card-container">
      <div className="card">
        {/* <h2>Sales, Profit, and Revenue Distribution (Nested Pie Chart)</h2> */}
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            {/* Outer Pie: Sales */}
            <Pie
              data={data}
              dataKey="sales"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#c32127"
            />

            {/* Middle Pie: Profit */}
            <Pie
              data={data}
              dataKey="profit"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={110}
              fill="#0b9fc8"
            />

            {/* Inner Pie: Revenue */}
            <Pie
              data={data}
              dataKey="revenue"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={120}
              outerRadius={140}
              fill="#82ca9d"
            />

            <Tooltip />
            {/* <Legend /> */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartDashboard;
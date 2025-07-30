import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
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


const LineChartDashboard = () => {
  return (
    <div className="card-container">
      <div className="card">
        <h2>Sales & Profit Line Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
                <Line dataKey="sales" fill="#c32127" name="Sales" type={"monotone"}/>
            <Line dataKey="profit" fill="#0b9fc8" name="Profit" type={"monotone"}/>
            <Line dataKey="revenue" fill="#268c11" name="Revenue" type={"monotone"}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartDashboard;

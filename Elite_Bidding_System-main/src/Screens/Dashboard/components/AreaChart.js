import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
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

const AreaChartDashboard = () => {
  return (
    <div className="card-container">
      <div className="card">
        <h2>Sales & Profit Area Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c32127" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#c32127" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0b9fc8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0b9fc8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#c32127"
              fillOpacity={1}
              fill="url(#colorSales)"
              name="Sales"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#0b9fc8"
              fillOpacity={1}
              fill="url(#colorProfit)"
              name="Profit"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartDashboard;

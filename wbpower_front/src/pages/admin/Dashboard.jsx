import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const barData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 7000 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 9000 },
];

const pieData = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 300 },
  { name: "Product D", value: 200 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export const Dashboard = () => {
  return (
    <>
      {/* Stats row */}
    <div class="container-fluid py-2">
      <div class="row">
         <div class="ms-3">
          <h3 class="mb-0 h4 font-weight-bolder">Dashboard</h3>
          <p class="mb-4">
            Check the sales, value and bounce rate by country.
          </p>
        </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Total Power Generated</h6>
            <h4 className="card-title">12,350 MW</h4>
            <p className="mb-0 text-secondary">This Month</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Active Projects</h6>
            <h4 className="card-title">24</h4>
            <p className="mb-0 text-secondary">Ongoing</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Rural Electrification</h6>
            <h4 className="card-title">98%</h4>
            <p className="mb-0 text-secondary">Coverage</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3">
            <h6>Consumer Satisfaction</h6>
            <h4 className="card-title">92%</h4>
            <p className="mb-0 text-secondary">Survey Result</p>
          </div>
        </div>
      </div>
    </div>

    {/* Charts row */}
<div className="row mb-4">
  {/* Bar Chart */}
   {/*<div className="col-md-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>*/}

  {/* Pie Chart */}
 {/* <div className="col-md-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>*/}
</div>
</div>
    </>
  );
};
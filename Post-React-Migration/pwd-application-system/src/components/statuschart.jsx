import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://sheetdb.io/api/v1/wgjit0nprbfxe")
      .then((res) => res.json())
      .then((rows) => {
        const counts = { Denied: 0, Accepted: 0, Pending: 0 };
        rows.forEach((row) => {
          const status = (row.status || "").trim();
          if (counts[status] !== undefined) counts[status]++;
        });
        const chartData = Object.entries(counts).map(([name, value]) => ({
          name,
          value,
        }));
        setData(chartData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div
      className="chart-card mb-4 w-100"
      style={{
        background: "#fff",
        borderRadius: "1em",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        padding: "1.5em",
      }}>
      <h6 className="mb-3 text-center">Application Status Overview</h6>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => {
              const colors = {
                Denied: "#dc3545",
                Accepted: "#0d6efd",
                Pending: "#ffc107",
              };
              return (
                <cell
                  key={`cell-${index}`}
                  fill={colors[entry.name] || "#6c757d"}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div
        className="d-flex justify-content-center mt-2"
        style={{ gap: "1.5em", fontSize: "0.9em" }}>
        <span style={{ color: "#dc3545" }}>● Denied</span>
        <span style={{ color: "#0d6efd" }}>● Accepted</span>
        <span style={{ color: "#ffc107" }}>● Pending</span>
      </div>
    </div>
  );
}

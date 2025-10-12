import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const SHEETDB_URL = "https://sheetdb.io/api/v1/wgjit0nprbfxe";

export default function StatusChart() {
  const [data, setData] = useState([]);

  // Define bar colors (keys are lowercase)
  const barColors = {
    approved: "#198754", // green
    pending: "#ffc107", // yellow
    rejected: "#dc3545", // red
    unknown: "#6c757d", // grey
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(SHEETDB_URL);
        const rows = await res.json();

        // Count statuses
        const counts = { approved: 0, pending: 0, rejected: 0, unknown: 0 };
        rows.forEach((row) => {
          const status = (row.status || "unknown").trim().toLowerCase();
          counts[status] = (counts[status] || 0) + 1;
        });

        // Convert counts to array for chart
        const chartData = Object.entries(counts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize for display
          value,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
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
      {data.length > 0 ? (
        <>
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
                  const key = entry.name.toLowerCase();
                  return (
                    <Cell key={index} fill={barColors[key] || "#6c757d"} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div
            className="d-flex justify-content-center mt-2"
            style={{ gap: "1.5em", fontSize: "0.9em" }}>
            {data.map((entry) => {
              const key = entry.name.toLowerCase();
              return (
                <span
                  key={entry.name}
                  style={{ color: barColors[key] || "#6c757d" }}>
                  ● {entry.name}
                </span>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-center text-muted">Loading chart data...</p>
      )}
    </div>
  );
}

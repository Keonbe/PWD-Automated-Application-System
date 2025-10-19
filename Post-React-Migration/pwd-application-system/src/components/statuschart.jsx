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
import { normalizeStatus, barColors } from "../utils/statusUtils";

//const SHEETDB_URL = "https://sheetdb.io/api/v1/wgjit0nprbfxe";
const SHEETDB_URL = "https://sheetdb.io/api/v1/ljqq6umrhu60"; //Backup SheetsDB

export default function StatusChart({
  chartData = null,
  height = 400,
  invert = false,
}) {
  const [data, setData] = useState(chartData || []);

  // normalizeStatus and barColors are imported from shared utils

  useEffect(() => {
    // If chartData prop provided, use it and skip fetch
    if (chartData) {
      setData(chartData);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(SHEETDB_URL);
        const rows = await response.json();

        // Normalize and count statuses
        const counts = {};
        rows.forEach((row) => {
          const st = normalizeStatus(row.status);
          counts[st] = (counts[st] || 0) + 1;
        });

        const chart = Object.entries(counts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          Applications: count,
        }));

        setData(chart);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, [chartData]);

  const legendItems = Object.keys(barColors).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    color: barColors[key],
  }));

  return (
    <div
      className="chart-card mb-4 w-100"
      style={{
        background: "#fff",
        borderRadius: "1em",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        padding: "1.5em",
      }}>
      {data && data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Applications" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={barColors[normalizeStatus(entry.name)] || "#6c757d"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div
            className="chart-legend d-flex justify-content-center mt-2"
            style={{ gap: "1rem", flexWrap: "wrap", alignItems: "center" }}
            role="list"
            aria-label="Application status legend">
            {legendItems.map((item) => (
              <div
                key={item.label}
                role="listitem"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: invert ? "#fff" : "#212529",
                  fontSize: "0.9rem",
                }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: item.color,
                    display: "inline-block",
                    boxShadow: invert
                      ? "0 0 0 2px rgba(255,255,255,0.12) inset"
                      : "none",
                    border: invert
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                  }}></span>
                <span
                  style={{
                    color: invert ? "#fff" : item.color,
                    fontWeight: 500,
                  }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-muted">Loading chart data...</p>
      )}
    </div>
  );
}

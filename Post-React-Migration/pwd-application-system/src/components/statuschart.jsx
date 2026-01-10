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
import { normalizeStatus, barColors } from "@utils/statusUtils";

//const SHEETDB_URL = "https://sheetdb.io/api/v1/wgjit0nprbfxe";
const SHEETDB_URL = "https://sheetdb.io/api/v1/ljqq6umrhu60"; //Backup SheetsDB

export default function StatusChart({
  chartData = null,
  height = 400,
  invert = false,
}) {
  // Use prop directly if provided, otherwise manage fetched data in state
  const [fetchedData, setFetchedData] = useState([]);
  const data = chartData && chartData.length > 0 ? chartData : fetchedData;

  useEffect(() => {
    // Only fetch if no chartData prop provided
    if (chartData && chartData.length > 0) {
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

        setFetchedData(chart);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, []);

  const legendItems = Object.keys(barColors).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    color: barColors[key],
  }));

  // Filter out zero values for cleaner chart
  const filteredData = data.filter((item) => item.Applications > 0);
  const hasZeroValues = data.length > filteredData.length;

  return (
    <div
      className="chart-card mb-4 w-100"
      style={{
        background: "#fff",
        borderRadius: "1em",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        padding: "1.5em",
      }}>
      {data && data.length > 0 && filteredData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="0"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis allowDecimals={false} stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`${value} applications`, "Count"]}
              />
              <Bar dataKey="Applications" radius={[12, 12, 0, 0]}>
                {filteredData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={barColors[normalizeStatus(entry.name)] || "#6c757d"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div
            className="chart-legend d-flex justify-content-center mt-4"
            style={{ gap: "1.2rem", flexWrap: "wrap", alignItems: "center" }}
            role="list"
            aria-label="Application status legend">
            {legendItems.map((item) => (
              <div
                key={item.label}
                role="listitem"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  color: invert ? "#fff" : "#212529",
                  fontSize: "0.9rem",
                }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: item.color,
                    display: "inline-block",
                    boxShadow: invert
                      ? "0 0 0 2px rgba(255,255,255,0.12) inset"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                    border: invert
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                  }}></span>
                <span
                  style={{
                    color: invert ? "#fff" : "#333",
                    fontWeight: 500,
                  }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-muted py-5">
          <i className="fas fa-inbox fa-2x mb-3 d-block opacity-50"></i>
          <p className="mb-0">No results found</p>
        </div>
      )}
    </div>
  );
}

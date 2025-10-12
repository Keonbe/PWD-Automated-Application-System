import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/adminpage.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const SHEETDB_URL = "https://sheetdb.io/api/v1/wgjit0nprbfxe";

const AdminPage = () => {
  const [applications, setApplications] = useState([]);
  const [statusData, setStatusData] = useState([]);

  const barColors = {
    approved: "#198754", // green
    pending: "#ffc107", // yellow
    rejected: "#dc3545", // red
    unknown: "#6c757d", // gray
  };

  const getColor = (status) => barColors[status] || barColors["unknown"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEETDB_URL);
        const data = await response.json();

        const formattedData = data.map((row) => ({
          ...row,
          fullName: `${row.lastName || ""}, ${row.firstName || ""} ${
            row.middleName || ""
          }`.trim(),
          status: (row.status || "Unknown").trim().toLowerCase(),
        }));
        setApplications(formattedData);

        const counts = formattedData.reduce((acc, row) => {
          acc[row.status] = (acc[row.status] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(counts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          Applications: count,
        }));
        setStatusData(chartData);
      } catch (error) {
        console.error("Error fetching data from SheetDB:", error);
      }
    };

    fetchData();
  }, []);

  const totalApplicants = statusData.reduce(
    (sum, s) => sum + s.Applications,
    0
  );
  const approvedCount =
    statusData.find((s) => s.name === "Approved")?.Applications || 0;
  const pendingCount =
    statusData.find((s) => s.name === "Pending")?.Applications || 0;
  const rejectedCount =
    statusData.find((s) => s.name === "Rejected")?.Applications || 0;

  // Generate dynamic legend items
  const legendItems = Object.keys(barColors).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    color: barColors[key],
  }));

  return (
    <div className="admin-page">
      {/* ===== SIDEBAR ===== */}
      <aside className="admin-sidebar">
        <h4>PWD Admin</h4>
        <ul className="sidebar-nav">
          <li>
            <a href="#" className="active">
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-users me-2"></i> Applicants
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-file-alt me-2"></i> Reports
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-cog me-2"></i> Settings
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">© 2025 PWD System</div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-content">
        <header className="admin-header">
          <h2>Admin Dashboard</h2>
          <p className="text-muted">
            Manage and review PWD applications efficiently
          </p>
        </header>

        {/* ===== SUMMARY CARDS ===== */}
        <section className="summary-cards">
          <div className="summary-card">
            <i className="fas fa-users text-success"></i>
            <h6>Total Applicants</h6>
            <p>{totalApplicants}</p>
          </div>
          <div className="summary-card">
            <i className="fas fa-check-circle text-success"></i>
            <h6>Approved</h6>
            <p>{approvedCount}</p>
          </div>
          <div className="summary-card">
            <i className="fas fa-hourglass-half text-warning"></i>
            <h6>Pending</h6>
            <p>{pendingCount}</p>
          </div>
          <div className="summary-card">
            <i className="fas fa-times-circle text-danger"></i>
            <h6>Rejected</h6>
            <p>{rejectedCount}</p>
          </div>
        </section>

        {/* ===== CHART ===== */}
        <section className="chart-card">
          <h5>Application Status Overview</h5>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={statusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Applications" radius={[10, 10, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={barColors[entry.name.toLowerCase()] || "#6c757d"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted">Loading chart data...</p>
          )}
          {/* Dynamic Legend */}
          <div
            className="chart-legend d-flex justify-content-center mt-2"
            style={{ gap: "1.5rem" }}>
            {legendItems.map((item) => (
              <span key={item.label} style={{ color: item.color }}>
                ● {item.label}
              </span>
            ))}
          </div>
        </section>

        {/* ===== APPLICATIONS TABLE ===== */}
        <section className="table-card">
          <h5 className="text-center mb-3">Recent Applications</h5>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications
                    .slice(-10)
                    .reverse()
                    .map((app, index) => (
                      <tr key={index}>
                        <td>{applications.length - index}</td>
                        <td>{app.fullName || "N/A"}</td>
                        <td>{app.email || "N/A"}</td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: getColor(app.status),
                              color:
                                app.status === "pending" ? "#212529" : "#fff",
                            }}>
                            {app.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      Loading applications...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;

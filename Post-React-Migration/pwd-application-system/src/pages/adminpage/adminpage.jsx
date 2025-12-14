import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/adminsidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/adminpage.css";
import StatusChart from "../../components/statuschart";
import { normalizeStatus, barColors, getColor } from "../../utils/statusUtils";

import { getAllApplications } from "../../api/adminApi";

const AdminPage = () => {
  const [applications, setApplications] = useState([]);
  const [statusData, setStatusData] = useState([]);

  /**
   * @summary Color mapping configuration for status visualization.
   *
   * @remarks
   * Provides consistent color coding across charts, badges, and status indicators.
   * Follows Bootstrap color conventions for intuitive status recognition.
   */
  /**
   * @summary Normalizes application status values for consistent categorization.
   *
   * @param {string} status - Raw status value from application data.
   * @returns {string} Normalized status: 'accepted', 'pending', 'rejected', or 'unknown'.
   *
   * @remarks
   * Handles variations in status terminology from different data entry sources.
   * Ensures consistent grouping and color coding across the dashboard.
   */
  /**
   * @summary Retrieves color code for a given application status.
   *
   * @param {string} status - Application status value.
   * @returns {string} Hexadecimal color code for the status.
   *
   * @remarks
   * Wrapper function that applies normalization before color lookup.
   * Used for dynamic styling of status badges and visual elements.
   */
  // getColor and normalizeStatus are imported from shared utils

  /**
   * @summary Effect hook for fetching and processing application data on component mount.
   *
   * @remarks
   * Retrieves all applications from API, normalizes status values, and prepares data for visualization.
   * Handles data transformation for both display and analytical purposes.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllApplications();
        if (res.success) {
          const formattedData = res.users.map((row) => {
            const normalizedStatus = normalizeStatus(row.status);
            return {
              ...row,
              fullName: `${row.lastName || ""}, ${row.firstName || ""} ${
                row.middleName || ""
              }`.trim(),
              status: normalizedStatus,
            };
          });

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
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchData();
  }, []);

  const totalApplicants = statusData.reduce(
    (sum, s) => sum + s.Applications,
    0
  );
  const acceptedCount =
    statusData.find((s) => s.name.toLowerCase() === "accepted")?.Applications ||
    0;
  const pendingCount =
    statusData.find((s) => s.name.toLowerCase() === "pending")?.Applications ||
    0;
  const rejectedCount =
    statusData.find((s) => s.name.toLowerCase() === "rejected")?.Applications ||
    0;

  /**
   * @summary Legend configuration for status color coding visualization.
   *
   * @remarks
   * Provides label-color mappings for charts, legends, and status explanation components.
   * Used to generate consistent status legends across the dashboard interface.
   */
  const legendItems = Object.keys(barColors).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    color: barColors[key],
  }));

  return (
    <div className="admin-page">
      <AdminSidebar />

      <main className="admin-content">
        <header className="admin-header">
          <h2>Admin Dashboard</h2>
          <p className="text-muted">
            Manage and review PWD applications efficiently
          </p>
        </header>

        <section className="summary-cards">
          <div className="summary-card">
            <i className="fas fa-users text-success"></i>
            <h6>Total Applicants</h6>
            <p>{totalApplicants}</p>
          </div>
          <div className="summary-card">
            <i className="fas fa-check-circle text-success"></i>
            <h6>Accepted</h6>
            <p>{acceptedCount}</p>
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

        <section className="chart-card">
          <h5>Application Status Overview</h5>
          <StatusChart chartData={statusData} />
        </section>

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
                                normalizeStatus(app.status) === "pending"
                                  ? "#212529"
                                  : "#fff",
                              textTransform: "capitalize",
                            }}>
                            {normalizeStatus(app.status)}
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

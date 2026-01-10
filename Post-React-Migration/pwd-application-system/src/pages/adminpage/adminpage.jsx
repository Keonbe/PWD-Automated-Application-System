import React, { useEffect, useState, useMemo } from "react";
import AdminSidebar from "@components/adminsidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "@assets/styles/adminpage.css";
import StatusChart from "@components/statuschart";
import { normalizeStatus, barColors, getColor } from "@utils/statusUtils";

import { getAllApplications } from "@api/adminApi";

const AdminPage = () => {
  const [applications, setApplications] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
   * @summary Fetches and processes application data from API.
   *
   * @remarks
   * Retrieves all applications, normalizes status values, and prepares data for visualization.
   * Handles loading, error states, and updates timestamp.
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
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
        setLastUpdated(new Date());
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
      setError("Failed to load applications. Please try again.");
      setLoading(false);
    }
  };

  /**
   * @summary Effect hook for fetching data on component mount.
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * @summary Handles manual refresh of dashboard data.
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

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
   * @summary Generates chart data based on selected status filter.
   * When a status is selected, shows only that status data.
   * When no status is selected, shows all status data.
   * Memoized to prevent infinite re-renders when passed to child components.
   */
  const filteredChartData = useMemo(() => {
    if (!selectedStatus) {
      return statusData;
    }
    return statusData.filter(
      (item) => item.name.toLowerCase() === selectedStatus
    );
  }, [statusData, selectedStatus]);

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
        <header className="admin-header d-flex justify-content-between align-items-start flex-column flex-md-row gap-3">
          <div>
            <h2 className="mb-2">Admin Dashboard</h2>
            <p className="text-muted mb-2">
              Manage and review PWD applications efficiently
            </p>
            {lastUpdated && (
              <small className="text-secondary">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </small>
            )}
          </div>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh dashboard data"
            style={{ whiteSpace: "nowrap" }}>
            <i
              className={`fas fa-sync-alt ${isRefreshing ? "fa-spin" : ""}`}
              aria-hidden="true"></i>
            <span className="d-none d-sm-inline ms-2">
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </header>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            <span className="d-block d-sm-inline">{error}</span>
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
              aria-label="Close"></button>
            <br />
            <button
              type="button"
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={handleRefresh}>
              <i className="fas fa-redo me-1"></i>
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <section className="summary-cards">
              <div
                className="summary-card"
                style={{
                  cursor: "pointer",
                  border:
                    selectedStatus === null
                      ? "2px solid #28a745"
                      : "1px solid #dee2e6",
                  opacity: selectedStatus === null ? 1 : 0.6,
                }}
                onClick={() => setSelectedStatus(null)}
                title="Click to show all applications"
                role="button"
                tabIndex="0"
                onKeyPress={(e) => {
                  if (e.key === "Enter") setSelectedStatus(null);
                }}>
                <i className="fas fa-users text-success"></i>
                <h6 className="mt-2 mb-2">Total Applicants</h6>
                <p className="mb-0">{totalApplicants}</p>
              </div>
              <div
                className="summary-card"
                style={{
                  cursor: "pointer",
                  border:
                    selectedStatus === "accepted"
                      ? "2px solid #28a745"
                      : "1px solid #dee2e6",
                  opacity: selectedStatus === "accepted" ? 1 : 0.6,
                }}
                onClick={() => setSelectedStatus("accepted")}
                title="Click to filter accepted applications"
                role="button"
                tabIndex="0"
                onKeyPress={(e) => {
                  if (e.key === "Enter") setSelectedStatus("accepted");
                }}>
                <i className="fas fa-check-circle text-success"></i>
                <h6 className="mt-2 mb-2">Accepted</h6>
                <p className="mb-0">
                  {acceptedCount}
                  <br />
                  <span className="small text-muted">
                    ({((acceptedCount / totalApplicants) * 100).toFixed(1)}%)
                  </span>
                </p>
              </div>
              <div
                className="summary-card"
                style={{
                  cursor: "pointer",
                  border:
                    selectedStatus === "pending"
                      ? "2px solid #28a745"
                      : "1px solid #dee2e6",
                  opacity: selectedStatus === "pending" ? 1 : 0.6,
                }}
                onClick={() => setSelectedStatus("pending")}
                title="Click to filter pending applications"
                role="button"
                tabIndex="0"
                onKeyPress={(e) => {
                  if (e.key === "Enter") setSelectedStatus("pending");
                }}>
                <i className="fas fa-hourglass-half text-warning"></i>
                <h6 className="mt-2 mb-2">Pending</h6>
                <p className="mb-0">
                  {pendingCount}
                  <br />
                  <span className="small text-muted">
                    ({((pendingCount / totalApplicants) * 100).toFixed(1)}%)
                  </span>
                </p>
              </div>
              <div
                className="summary-card"
                style={{
                  cursor: "pointer",
                  border:
                    selectedStatus === "rejected"
                      ? "2px solid #28a745"
                      : "1px solid #dee2e6",
                  opacity: selectedStatus === "rejected" ? 1 : 0.6,
                }}
                onClick={() => setSelectedStatus("rejected")}
                title="Click to filter rejected applications"
                role="button"
                tabIndex="0"
                onKeyPress={(e) => {
                  if (e.key === "Enter") setSelectedStatus("rejected");
                }}>
                <i className="fas fa-times-circle text-danger"></i>
                <h6 className="mt-2 mb-2">Rejected</h6>
                <p className="mb-0">
                  {rejectedCount}
                  <br />
                  <span className="small text-muted">
                    ({((rejectedCount / totalApplicants) * 100).toFixed(1)}%)
                  </span>
                </p>
              </div>
            </section>

            <section className="chart-card">
              <h5>
                Application Status Overview
                {selectedStatus && (
                  <span className="ms-2">
                    -{" "}
                    <strong>
                      {selectedStatus.charAt(0).toUpperCase() +
                        selectedStatus.slice(1)}
                    </strong>
                  </span>
                )}
              </h5>
              <div style={{ overflowX: "auto" }}>
                <StatusChart chartData={filteredChartData} />
              </div>
            </section>

            <section className="table-card">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
                <h5 className="mb-0">
                  {selectedStatus
                    ? `${
                        selectedStatus.charAt(0).toUpperCase() +
                        selectedStatus.slice(1)
                      } Applications`
                    : "Recent Applications"}
                </h5>
                {selectedStatus && (
                  <button
                    className="btn btn-sm btn-secondary w-100 w-sm-auto"
                    onClick={() => setSelectedStatus(null)}>
                    <i className="fas fa-times me-1"></i>
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="table-responsive">
                <table className="table table-striped align-middle table-sm">
                  <thead className="table-light">
                    <tr>
                      <th style={{ minWidth: "40px" }}>#</th>
                      <th style={{ minWidth: "150px" }}>Full Name</th>
                      <th
                        style={{ minWidth: "180px" }}
                        className="d-none d-md-table-cell">
                        Email
                      </th>
                      <th style={{ minWidth: "100px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length > 0 ? (
                      applications
                        .filter(
                          (app) =>
                            selectedStatus === null ||
                            app.status.toLowerCase() === selectedStatus
                        )
                        .slice(-10)
                        .reverse()
                        .map((app, index) => (
                          <tr key={index}>
                            <td className="fw-bold text-muted">
                              {applications.length - index}
                            </td>
                            <td>
                              <small className="d-block">
                                {app.fullName || "N/A"}
                              </small>
                              <small className="d-md-none text-muted">
                                {app.email?.substring(0, 20) || "N/A"}
                                {app.email?.length > 20 ? "..." : ""}
                              </small>
                            </td>
                            <td className="d-none d-md-table-cell">
                              <small>{app.email || "N/A"}</small>
                            </td>
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
                                  fontSize: "0.75rem",
                                }}>
                                {normalizeStatus(app.status)}
                              </span>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          No applications found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPage;

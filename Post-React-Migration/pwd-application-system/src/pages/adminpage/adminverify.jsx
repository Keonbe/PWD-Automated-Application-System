import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/adminsidebar";
import {
  getPendingApplication,
  updateApplicationStatus,
} from "../../api/adminApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/adminpage.css";

const AdminVerify = () => {
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [applicantFiles, setApplicantFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  /**
   * @summary Updates the status of an individual applicant file (document).
   *
   * @param {number} fileId - The file's unique ID.
   * @param {string} newStatus - The new status: 'approved' or 'rejected'.
   * @returns {Promise<void>}
   *
   * @remarks
   * Calls update-file-status.php endpoint to update a single document's status.
   * Updates UI state on success.
   */
  const handleFileStatusUpdate = async (fileId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/update-file-status.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileId, status: newStatus }),
        }
      );
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        alert("Server error: " + text);
        return;
      }
      if (data.success) {
        setApplicantFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, status: newStatus } : file
          )
        );
      } else {
        alert(
          "Failed to update document status: " +
            (data.error || data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      alert("Error updating document status: " + error.message);
    }
  };

  /**
   * @summary Opens document in new browser tab for viewing.
   *
   * @param {number} fileId - File ID from pwd_file_uploads table
   *
   * @remarks
   * Uses file-view.php endpoint to serve files inline for browser viewing.
   * Opens in new tab using browser's native viewer (PDF, images, etc.)
   */
  const handleViewDocument = (fileId) => {
    if (!fileId) {
      alert("No file available to view");
      return;
    }
    const viewUrl = `http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/file-view.php?fileId=${fileId}`;
    window.open(viewUrl, "_blank");
  };

  /**
   * @summary Normalizes applicant status values for consistent display and processing.
   *
   * @param {string} status - Raw status value from applicant data.
   * @returns {string} Normalized status value: 'accepted', 'pending', 'denied', or 'unknown'.
   *
   * @remarks
   * Handles variations in status formatting from different data sources.
   * Ensures consistent color coding and display logic across the application.
   */
  const normalizeStatus = (status) => {
    if (!status) return "unknown";
    const s = status.trim().toLowerCase();
    if (s.includes("accept")) return "accepted";
    if (s.includes("pending") || s.includes("wait")) return "pending";
    if (s.includes("reject") || s.includes("denied")) return "denied";
    return "unknown";
  };

  /**
   * @summary Fetches the oldest pending applicant from the database queue.
   *
   * @remarks
   * Retrieves the first applicant with 'pending' status for review processing.
   * Sets loading state and handles empty result scenarios.
   */
  const fetchOldestPending = async () => {
    try {
      const res = await getPendingApplication();
      setApplicant(res.success ? res.user || null : null);
    } catch (err) {
      console.error("Error fetching applicant:", err);
      setApplicant(null);
    } finally {
      setLoading(false);
    }
  };

  // Load initial applicant on mount
  useEffect(() => {
    fetchOldestPending();
  }, []);

  // Fetch files when applicant changes
  useEffect(() => {
    if (applicant?.regNumber) {
      setFilesLoading(true);
      setApplicantFiles([]);
      fetch(
        `http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/files.php?regNumber=${applicant.regNumber}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success && Array.isArray(data.files)) {
            setApplicantFiles(data.files);
          } else {
            setApplicantFiles([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching applicant files:", error);
          setApplicantFiles([]);
        })
        .finally(() => {
          setFilesLoading(false);
        });
    }
  }, [applicant?.regNumber]);

  /**
   * @summary Updates applicant status and loads next pending applicant.
   *
   * @param {string} newStatus - The new status to assign: 'accepted' or 'denied'.
   * @returns {Promise<void>}
   *
   * @throws {Error} Throws error if API update fails or applicant data is missing.
   *
   * @remarks
   * Updates current applicant status via PATCH request and automatically fetches next applicant.
   * Provides user feedback via alerts and maintains application workflow continuity.
   */
  const updateStatus = async (newStatus, rejectionReason = "") => {
    if (!applicant) return;
    setLoading(true);
    try {
      const res = await updateApplicationStatus(
        applicant.regNumber,
        newStatus,
        rejectionReason
      );

      if (res.success) {
        alert(`Status updated to: ${newStatus}`);
        if (newStatus === "denied") {
          setShowRejectionModal(false);
          setRejectionReason("");
          setOtherReason("");
        }

        // Wait a moment for the backend to update, then fetch the next applicant.
        setTimeout(() => {
          fetchOldestPending();
        }, 500);
      } else {
        throw new Error(res.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
      setLoading(false); // Ensure loading is turned off on error
    }
  };

  if (loading) return <p className="text-center mt-5">Loading applicant...</p>;
  if (!applicant)
    return (
      <div className="admin-page">
        <AdminSidebar />
        <main className="admin-content text-center mt-5">
          <h4 className="text-muted">No pending applicants found.</h4>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/adminpage")}>
            <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
          </button>
        </main>
      </div>
    );

  const normalized = normalizeStatus(applicant.status);
  const statusColor =
    normalized === "accepted"
      ? "#198754"
      : normalized === "denied"
      ? "#dc3545"
      : "#ffc107";

  return (
    <div className="admin-page">
      <AdminSidebar />

      <main className="admin-content">
        <header className="admin-header">
          <h2>Applicant Verification</h2>
          <p className="text-muted">
            Review and approve or deny this PWD application.
          </p>
        </header>

        <section className="table-card">
          <h5>
            Applicant Details{" "}
            <span
              className="badge ms-2"
              style={{
                backgroundColor: statusColor,
                color: normalized === "pending" ? "#212529" : "#fff",
              }}>
              {normalized}
            </span>
          </h5>

          <div className="row mt-3">
            <div className="col-md-6">
              <h6>Personal Info</h6>
              <p>
                <strong>Registration No:</strong> {applicant.regNumber || "N/A"}
              </p>
              <p>
                <strong>Registration Date:</strong> {applicant.regDate || "N/A"}
              </p>
              <p>
                <strong>Name:</strong>{" "}
                {`${applicant.lastName || ""}, ${applicant.firstName || ""} ${
                  applicant.middleName || ""
                }`}
              </p>
              <p>
                <strong>Date of Birth:</strong> {applicant.dob || "N/A"}
              </p>
              <p>
                <strong>Sex:</strong> {applicant.sex || "N/A"}
              </p>
              <p>
                <strong>Civil Status:</strong> {applicant.civil || "N/A"}
              </p>
              <p>
                <strong>Nationality:</strong> {applicant.nationality || "N/A"}
              </p>
              <p>
                <strong>Blood Type:</strong> {applicant.blood || "N/A"}
              </p>
            </div>

            <div className="col-md-6">
              <h6>Contact & Address</h6>
              <p>
                <strong>Email:</strong> {applicant.email || "N/A"}
              </p>
              <p>
                <strong>Mobile:</strong> {applicant.mobile || "N/A"}
              </p>
              <p>
                <strong>Telephone:</strong> {applicant.tel || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`${applicant.street || ""}, ${applicant.barangay || ""}, ${
                  applicant.municipality || ""
                }, ${applicant.province || ""}, ${applicant.region || ""}`}
              </p>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <h6>Disability Info</h6>
              <p>
                <strong>Type of Disability:</strong>{" "}
                {applicant.disability || "N/A"}
              </p>
            </div>

            <div className="col-md-6">
              <h6>Emergency Contact</h6>
              <p>
                <strong>Name:</strong> {applicant.emergencyName || "N/A"}
              </p>
              <p>
                <strong>Relationship:</strong>{" "}
                {applicant.emergencyRelationship || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {applicant.emergencyPhone || "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h6>Uploaded Documents</h6>
            {filesLoading ? (
              <p className="text-muted">Loading documents...</p>
            ) : applicantFiles.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Document Type</th>
                      <th>Filename</th>
                      <th>Size</th>
                      <th>Status</th>
                      <th>Uploaded</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicantFiles.map((file) => (
                      <tr key={file.id}>
                        <td>
                          <i
                            className={`fas ${
                              file.type === "medical_certificate"
                                ? "fa-file-medical text-danger"
                                : "fa-id-card text-primary"
                            }`}></i>{" "}
                          {file.type === "medical_certificate"
                            ? "Medical Certificate"
                            : "Identity Proof"}
                        </td>
                        <td>
                          <small>{file.originalFilename}</small>
                        </td>
                        <td>
                          <small>{(file.size / 1024).toFixed(1)} KB</small>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              file.status === "approved"
                                ? "success"
                                : file.status === "rejected"
                                ? "danger"
                                : "warning"
                            }`}>
                            {file.status.charAt(0).toUpperCase() +
                              file.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <small>
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              title="Approve document"
                              disabled={file.status === "approved"}
                              onClick={() =>
                                handleFileStatusUpdate(file.id, "approved")
                              }>
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              title="Reject document"
                              disabled={file.status === "rejected"}
                              onClick={() =>
                                handleFileStatusUpdate(file.id, "rejected")
                              }>
                              <i className="fas fa-times"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info"
                              title="View document"
                              onClick={() => handleViewDocument(file.id)}>
                              <i className="fas fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No documents uploaded.</p>
            )}
          </div>

          <div
            className="d-flex justify-content-center mt-4"
            style={{ gap: "1rem" }}>
            <button
              className="btn btn-success"
              disabled={loading}
              onClick={() => updateStatus("accepted")}>
              <i className="fas fa-check-circle me-2"></i> Accept
            </button>
            <button
              className="btn btn-danger"
              disabled={loading}
              onClick={() => setShowRejectionModal(true)}>
              <i className="fas fa-times-circle me-2"></i> Deny
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/adminpage")}>
              <i className="fas fa-arrow-left me-2"></i> Back
            </button>
          </div>
        </section>

        {showRejectionModal && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reason for Rejection</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowRejectionModal(false);
                      setRejectionReason("");
                      setOtherReason("");
                    }}></button>
                </div>
                <div className="modal-body">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rejectionReason"
                      id="reason1"
                      value="Incomplete or incorrect documents"
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason1">
                      Incomplete or incorrect documents
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rejectionReason"
                      id="reason2"
                      value="Information mismatch"
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason2">
                      Information mismatch
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rejectionReason"
                      id="reason3"
                      value="Not a resident of the area"
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason3">
                      Not a resident of the area
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rejectionReason"
                      id="reason4"
                      value="Others"
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="reason4">
                      Others
                    </label>
                  </div>
                  {rejectionReason === "Others" && (
                    <div className="mt-2">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Please specify"
                        value={otherReason}
                        onChange={(e) =>
                          setOtherReason(e.target.value)
                        }></textarea>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowRejectionModal(false);
                      setRejectionReason("");
                      setOtherReason("");
                    }}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={loading}
                    onClick={() => {
                      const finalReason =
                        rejectionReason === "Others"
                          ? otherReason
                          : rejectionReason;
                      if (!finalReason) {
                        alert("Please select a reason for rejection.");
                        return;
                      }
                      updateStatus("denied", finalReason);
                    }}>
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminVerify;

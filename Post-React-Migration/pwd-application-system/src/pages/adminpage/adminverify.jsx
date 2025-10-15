import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/adminsidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/adminpage.css";

const SHEETDB_URL = "https://sheetdb.io/api/v1/wgjit0nprbfxe";

const AdminVerify = () => {
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const normalizeStatus = (status) => {
    if (!status) return "unknown";
    const s = status.trim().toLowerCase();
    if (s.includes("accept")) return "accepted";
    if (s.includes("pending") || s.includes("wait")) return "pending";
    if (s.includes("reject") || s.includes("denied")) return "denied";
    return "unknown";
  };

  // Fetch the oldest pending applicant
  const fetchOldestPending = async () => {
    try {
      const res = await fetch(`${SHEETDB_URL}/search?status=pending`);
      const data = await res.json();
      setApplicant(data[0] || null);
    } catch (err) {
      console.error("Error fetching applicant:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOldestPending();
  }, []);

  const updateStatus = async (newStatus) => {
    if (!applicant) return;
    setUpdating(true);
    try {
      await fetch(`${SHEETDB_URL}/email/${applicant.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { status: newStatus } }),
      });

      alert(`Status updated to: ${newStatus}`);

      // Load the next pending applicant
      const res = await fetch(`${SHEETDB_URL}/search?status=pending`);
      const data = await res.json();
      if (data.length > 0) {
        setApplicant(data[0]);
      } else {
        setApplicant(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
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
              <p>
                <strong>Proof of Disability:</strong>{" "}
                {applicant.proofDisability ? (
                  <a
                    href={applicant.proofDisability}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm">
                    View
                  </a>
                ) : (
                  "Not uploaded"
                )}
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
            <h6>Proof of Identity</h6>
            {applicant.proofIdentity ? (
              <a
                href={applicant.proofIdentity}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm">
                View ID
              </a>
            ) : (
              <p className="text-muted">No proof of identity uploaded.</p>
            )}
          </div>

          <div
            className="d-flex justify-content-center mt-4"
            style={{ gap: "1rem" }}>
            <button
              className="btn btn-success"
              disabled={updating}
              onClick={() => updateStatus("accepted")}>
              <i className="fas fa-check-circle me-2"></i> Accept
            </button>
            <button
              className="btn btn-danger"
              disabled={updating}
              onClick={() => updateStatus("denied")}>
              <i className="fas fa-times-circle me-2"></i> Deny
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/adminpage")}>
              <i className="fas fa-arrow-left me-2"></i> Back
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminVerify;

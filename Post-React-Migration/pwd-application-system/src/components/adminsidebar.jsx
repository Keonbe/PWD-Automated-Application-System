import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/adminpage.css";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  /**
   * @summary Current route path derived from location object.
   * @remarks Used to compare against navigation items for active state management.
   */
  const currentPath = location.pathname;

  /**
   * @summary Navigation items configuration for admin sidebar menu.
   * @remarks
   * Defines the structure, icons, and paths for all admin navigation options.
   * Includes special handling for logout functionality with isLogout flag.
   */
  const navItems = [
    {
      path: "/adminpage",
      iconClass: "fas fa-tachometer-alt me-2",
      label: "Dashboard",
    },
    {
      path: "/admin/adminverify",
      iconClass: "fas fa-users me-2",
      label: "Applicants",
    },
    {
      path: "/admin/news",
      iconClass: "fas fa-newspaper me-2",
      label: "News",
    },
    {
      path: "/logout",
      iconClass: "fas fa-right-from-bracket me-2",
      label: "Log Out",
      isLogout: true,
    },
  ];

  /**
   * @summary Opens the logout confirmation modal.
   * @remarks Shows modal instead of immediately logging out for user confirmation.
   */
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsOpen(false); // Close mobile drawer if open
  };

  /**
   * @summary Handles admin logout process with session cleanup.
   *
   * @remarks
   * Shows loading state, removes admin authentication tokens from both session and local storage.
   * Redirects to home page with replace option to prevent back navigation after a brief delay.
   */
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Simulate logout delay for better UX
    setTimeout(() => {
      sessionStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminLoggedIn");
      setShowLogoutModal(false);
      setIsOpen(false);
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }, 1500);
  };

  /**
   * @summary Cancels the logout process and closes the modal.
   */
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // lock scroll and close on Escape
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile header (shown only on small screens) */}
      <header
        className="mobile-header d-flex d-md-none align-items-center justify-content-between p-2 border-bottom"
        style={{ backgroundColor: "#198754", color: "#fff" }} // <-- made green
      >
        <h4 className="m-0">PWD Admin</h4>
        <button
          type="button"
          className="btn btn-link"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-sidebar"
          onClick={() => setIsOpen((v) => !v)}
          style={{ color: "#fff" }} // ensure icon is white
        >
          <i
            className={isOpen ? "fas fa-times" : "fas fa-bars"}
            aria-hidden="true"
            style={{ fontSize: "1.25rem" }}></i>
        </button>
      </header>

      {/* Desktop aside (hidden on small screens) */}
      <aside className="admin-sidebar d-none d-md-block">
        <h4>PWD Admin</h4>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path}>
              {item.isLogout ? (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogoutClick();
                  }}
                  className={
                    currentPath === item.path
                      ? "active sidebar-link"
                      : "sidebar-link"
                  }>
                  <i className={item.iconClass}></i> {item.label}
                </Link>
              ) : (
                <Link
                  to={item.path}
                  className={
                    currentPath === item.path
                      ? "active sidebar-link"
                      : "sidebar-link"
                  }>
                  <i className={item.iconClass}></i> {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">© 2025 PWD System</div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          id="mobile-sidebar"
          role="dialog"
          aria-modal="true"
          className="mobile-drawer"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100%",
            zIndex: 1050,
            display: "flex",
          }}
          onClick={() => setIsOpen(false)}>
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
            }}
          />
          {/* Panel */}
          <nav
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 260,
              maxWidth: "80%",
              background: "#198754", // <-- made drawer panel green
              boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
              padding: "1rem",
              zIndex: 1060,
              color: "#fff",
            }}>
            <h4 className="mb-3" style={{ color: "#fff" }}>
              PWD Admin
            </h4>
            <ul className="sidebar-nav">
              {navItems.map((item) => (
                <li key={item.path}>
                  {item.isLogout ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogoutClick();
                      }}
                      className={
                        currentPath === item.path
                          ? "active sidebar-link"
                          : "sidebar-link"
                      }
                      style={{ color: "#fff" }} // links white on green
                    >
                      <i
                        className={item.iconClass}
                        style={{ color: "#fff" }}></i>{" "}
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={
                        currentPath === item.path
                          ? "active sidebar-link"
                          : "sidebar-link"
                      }
                      style={{ color: "#fff" }} // links white on green
                    >
                      <i
                        className={item.iconClass}
                        style={{ color: "#fff" }}></i>{" "}
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="sidebar-footer mt-4" style={{ color: "#fff" }}>
              © 2025 PWD System
            </div>
          </nav>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="modal-backdrop-custom"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
          }}
          onClick={!isLoggingOut ? handleCancelLogout : undefined}
        >
          <div
            className="logout-modal"
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isLoggingOut ? (
              // Loading state
              <>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#d1e7dd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ fontSize: "1.5rem", color: "#198754" }}
                  ></i>
                </div>
                <h5 style={{ marginBottom: "0.5rem", color: "#212529" }}>
                  Logging Out...
                </h5>
                <p style={{ color: "#6c757d", marginBottom: "0" }}>
                  Please wait while we securely log you out.
                </p>
              </>
            ) : (
              // Confirmation state
              <>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#f8d7da",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <i
                    className="fas fa-sign-out-alt"
                    style={{ fontSize: "1.5rem", color: "#dc3545" }}
                  ></i>
                </div>
                <h5 style={{ marginBottom: "0.5rem", color: "#212529" }}>
                  Confirm Logout
                </h5>
                <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
                  Are you sure you want to log out of the admin panel?
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancelLogout}
                    style={{ minWidth: "100px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleLogout}
                    style={{ minWidth: "100px" }}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;

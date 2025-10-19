import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/adminpage.css";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      path: "/logout",
      iconClass: "fas fa-right-from-bracket me-2",
      label: "Log Out",
      isLogout: true,
    },
  ];

  /**
   * @summary Handles admin logout process with session cleanup.
   *
   * @remarks
   * Removes admin authentication tokens from both session and local storage.
   * Redirects to home page with replace option to prevent back navigation.
   */
  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminLoggedIn");
    setIsOpen(false);
    navigate("/", { replace: true });
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
                    handleLogout();
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
                        handleLogout();
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
    </>
  );
};

export default AdminSidebar;

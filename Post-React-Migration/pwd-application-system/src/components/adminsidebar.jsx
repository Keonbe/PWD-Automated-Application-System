import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/adminpage.css";

const AdminSidebar = () => {
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
    navigate("/", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <h4>PWD Admin</h4>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.path}>
            {item.isLogout ? (
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault(); // prevent actual navigation
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
  );
};

export default AdminSidebar;

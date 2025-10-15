import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/adminpage.css";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

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

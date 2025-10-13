import React from "react";
// 1. Import Link and useLocation from react-router-dom
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/adminpage.css";

const AdminSidebar = () => {
  // 2. Get the current path (pathname) from the URL
  const location = useLocation();
  const currentPath = location.pathname;

  // Define the navigation items
  const navItems = [
    {
      path: "/testadmin",
      iconClass: "fas fa-tachometer-alt me-2",
      label: "Dashboard",
    },
    {
      path: "/admin/adminverify",
      iconClass: "fas fa-users me-2",
      label: "Applicants",
    },
    // Note: Use a standard <a> tag or a specific routing solution for external links/logout
    {
      path: "/logout",
      iconClass: "fas fa-right-from-bracket me-2",
      label: "Log Out",
    },
  ];

  return (
    <aside className="admin-sidebar">
      <h4>PWD Admin</h4>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.path}>
            {/* 3. Use <Link> instead of <a> for internal navigation */}
            <Link
              to={item.path}
              // 4. Conditional class application based on currentPath
              className={currentPath === item.path ? "active" : ""}>
              <i className={item.iconClass}></i> {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">© 2025 PWD System</div>
    </aside>
  );
};

export default AdminSidebar;

import '../../assets/styles/userpage-styles.css';
import { useState } from 'react';

export default function UserPage() {
  const [isSidebarActive, setSidebarActive] = useState(false);
  const [activeNav, setActiveNav] = useState(0);

  const handleNavClick = (index) => {
    setActiveNav(index);
    if (isSidebarActive) {
      setSidebarActive(false);
    }
  };

  const navItems = [
    { icon: 'fas fa-home', text: 'Dashboard' },
    { icon: 'fas fa-user', text: 'Profile' },
    { icon: 'fas fa-question-circle', text: 'Help' },
    { icon: 'fas fa-sign-out-alt', text: 'Logout' }
  ];

  return (
    <div className="user-dashboard-wrapper">
      {/* Header */}
      <header className="user-dashboard-header">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1>PWD Application Dashboard</h1>
            <button 
              className="user-mobile-menu-btn" 
              onClick={() => setSidebarActive(!isSidebarActive)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay for mobile */}
      <div 
        className={`user-overlay ${isSidebarActive ? 'user-overlay-active' : ''}`}
        onClick={() => setSidebarActive(false)}
      />

      <div className="user-app-container">
        {/* Sidebar */}
        <aside className={`user-sidebar ${isSidebarActive ? 'user-sidebar-active' : ''}`}>
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-name">Juan Dela Cruz</div>
            <span className="user-status">Pending</span>
          </div>

          <ul className="user-nav-menu">
            {navItems.map((item, index) => (
              <li key={index} className="user-nav-item">
                <a 
                  href="#" 
                  className={`user-nav-link ${activeNav === index ? 'user-nav-link-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(index);
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="user-main-content">
          <h2 className="user-page-title">Application Status</h2>
          <p className="user-page-subtitle">Track your PWD ID application progress</p>

          {/* Application Summary */}
          <div className="user-card">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h3 className="user-card-title">PWD ID Application</h3>
                <p className="mb-2"><strong>Registration No:</strong> PWD-2024-001234</p>
                <span className="user-status-badge">
                  <i className="fas fa-clock"></i>
                  Under Review
                </span>
              </div>
              <div className="text-end">
                <div className="user-info-label">Date Submitted</div>
                <div className="user-info-value">March 15, 2024</div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="user-card">
            <h3 className="user-card-title">Application Progress</h3>
            <div className="user-progress-container">
              <div className="user-progress-bar-wrapper">
                <div className="user-progress-fill" style={{width: '60%'}}></div>
              </div>
              <div className="user-progress-steps">
                <span>Submitted</span>
                <span>Verification</span>
                <span>Review</span>
                <span>Approval</span>
                <span>Issuance</span>
              </div>
            </div>
            <p className="text-muted mb-0">Expected completion: <strong>March 25, 2024</strong></p>
          </div>

          {/* Application Details */}
          <div className="user-card">
            <h3 className="user-card-title">Application Details</h3>
            <div className="user-info-row">
              <span className="user-info-label">Full Name</span>
              <span className="user-info-value">Juan M. Dela Cruz</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Date of Birth</span>
              <span className="user-info-value">January 15, 1985</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Disability Type</span>
              <span className="user-info-value">Physical Disability</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Contact Number</span>
              <span className="user-info-value">0917-123-4567</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Assigned Officer</span>
              <span className="user-info-value">Maria Santos</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="user-card">
            <h3 className="user-card-title">Recent Activity</h3>
            
            <div className="user-activity-item">
              <div className="user-activity-header">
                <span className="user-activity-title">Application Under Review</span>
                <span className="user-activity-time">Today, 10:30 AM</span>
              </div>
              <p className="user-activity-desc">Your application is currently being reviewed by our team.</p>
            </div>

            <div className="user-activity-item">
              <div className="user-activity-header">
                <span className="user-activity-title">Documents Verified</span>
                <span className="user-activity-time">March 18, 2024</span>
              </div>
              <p className="user-activity-desc">All submitted documents have been verified.</p>
            </div>

            <div className="user-activity-item">
              <div className="user-activity-header">
                <span className="user-activity-title">Application Submitted</span>
                <span className="user-activity-time">March 15, 2024</span>
              </div>
              <p className="user-activity-desc">Your PWD application has been successfully submitted.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
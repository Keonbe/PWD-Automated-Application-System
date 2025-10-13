import '../../assets/styles/userpage-styles.css';
import { useState,  useEffect  } from 'react';
import { getCurrentUserData } from "../../api/userApi";

export default function UserPage() {
  

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

      {/* Dev debug: show raw API response if available */}
      {process.env.NODE_ENV !== 'production' && userData && userData._raw && (
        <div className="container px-4 mt-2">
          <div className="alert alert-secondary small">
            <strong>Dev debug - raw API response:</strong>
            <pre style={{whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto'}}>{JSON.stringify(userData._raw, null, 2)}</pre>
          </div>
        </div>
      )}

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
            <div className="user-name">{userData.firstName} {userData.lastName}</div>
            <span className="user-status">{userData.status}</span>
          </div>

          <ul className="user-nav-menu">
            {navItems.map((item, index) => (
              <li key={index} className="user-nav-item">
                <button
                  type="button"
                  className={`user-nav-link ${activeNav === index ? 'user-nav-link-active' : ''}`}
                  onClick={() => handleNavClick(index)}
                  aria-pressed={activeNav === index}
                >
                  <i className={item.icon} aria-hidden="true"></i>
                  <span>{item.text}</span>
                </button>
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
                <p className="mb-2"><strong>Registration No:</strong> {userData.regNumber}</p>
                <span className="user-status-badge">
                  <i className="fas fa-clock"></i>
                  Under Review
                </span>
              </div>
              <div className="text-end">
                <div className="user-info-label">Date Submitted</div>
                <div className="user-info-value">{userData.regDate}</div>
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
          </div>

          {/* Application Details */}
          <div className="user-card">
            <h3 className="user-card-title">Personal Information</h3>
            <div className="user-info-row">
              <span className="user-info-label">Full Name</span>
              <span className="user-info-value">{userData.firstName} {userData.middleName} {userData.lastName}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Date of Birth</span>
              <span className="user-info-value">{userData.dob}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Sex</span>
              <span className="user-info-value">{userData.sex}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Civil Status</span>
              <span className="user-info-value">{userData.civil}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Nationality</span>
              <span className="user-info-value">{userData.nationality}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Blood Type</span>
              <span className="user-info-value">{userData.blood}</span>
            </div>
          </div>

          <div className="user-card">
            <h3 className="user-card-title">Contact Information</h3>
            <div className="user-info-row">
              <span className="user-info-label">Address</span>
              <span className="user-info-value">
                {userData.street}, {userData.barangay}, {userData.municipality}, {userData.province}, {userData.region}
              </span>
            </div>
            {userData.mobile && (
              <div className="user-info-row">
                <span className="user-info-label">Mobile Number</span>
                <span className="user-info-value">{userData.mobile}</span>
              </div>
            )}
            {userData.tel && (
              <div className="user-info-row">
                <span className="user-info-label">Telephone</span>
                <span className="user-info-value">{userData.tel}</span>
              </div>
            )}
            <div className="user-info-row">
              <span className="user-info-label">Email</span>
              <span className="user-info-value">{userData.email}</span>
            </div>
          </div>

          <div className="user-card">
            <h3 className="user-card-title">Emergency Contact</h3>
            <div className="user-info-row">
              <span className="user-info-label">Name</span>
              <span className="user-info-value">{userData.emergencyName}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Contact Number</span>
              <span className="user-info-value">{userData.emergencyPhone}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Relationship</span>
              <span className="user-info-value">{userData.emergencyRelationship}</span>
            </div>
          </div>

          <div className="user-card">
            <h3 className="user-card-title">Disability Information</h3>
            <div className="user-info-row">
              <span className="user-info-label">Type of Disability</span>
              <span className="user-info-value">{userData.disability}</span>
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
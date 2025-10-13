import '../../assets/styles/userpage-styles.css';
import { useState, useEffect } from 'react';
import { getCurrentUserData, logoutUser } from "../../api/userApi";
import { useNavigate } from 'react-router-dom';

export default function UserPage() {
  const navigate = useNavigate();
  const [isSidebarActive, setSidebarActive] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('� [UserPage] Starting to fetch user data...');
        
        // Check if user is logged in
        const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        if (!userId) {
          console.warn('⚠️ [UserPage] No userId found, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }
        
        console.log('✅ [UserPage] Found userId:', userId);
        
        // Fetch user data from API
        const data = await getCurrentUserData();
        console.log('📦 [UserPage] User data loaded successfully:', data);
        
        setUserData(data);
        setError(null);
        
      } catch (err) {
        console.error('❌ [UserPage] Failed to load user data:', err.message);
        setError(err.message);
        
        // If API fails, use demo data for development
        console.log('🔄 [UserPage] Using demo data as fallback');
        setUserData(getDemoUserData());
        
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const getDemoUserData = () => {
    return {
      // Use same formats as register.jsx: 12-digit numeric regNumber and YYYY-MM-DD dates
      regNumber: '252175464394',
      regDate: '2025-10-13',
      lastName: 'Dela Cruz',
      firstName: 'Juan',
      middleName: 'M',
      disability: 'Physical Disability',
      street: '123 Main St',
  barangay: 'Sample Barangay',
  // Match register.jsx defaults (disabled inputs)
  municipality: 'Dasmariñas',
      province: 'Cavite',
      region: 'IV-A',
      tel: '(02) 8123-4567',
      mobile: '0917-123-4567',
      email: 'juan.delacruz@email.com',
      dob: '1985-01-15',
      sex: 'Male',
      nationality: 'Filipino',
      blood: 'O+',
      civil: 'Single',
      emergencyName: 'Maria Dela Cruz',
      emergencyPhone: '0918-765-4321',
      emergencyRelationship: 'Mother',
      // Match upload fields: filenames are stored in proofIdentity/proofDisability
      proofIdentityName: 'sample-id.png',
      proofDisabilityName: 'sample-medcert.png',
      proofIdentity: 'sample-id.png',
      proofDisability: 'sample-medcert.png',
      // Registration flow fields
      generatedPassword: '12345678',
      password: '12345678',
      // Default status used by the registration form
      status: 'Denied'
    };
  };

  const handleNavClick = (index) => {
    setActiveNav(index);
    if (isSidebarActive) {
      setSidebarActive(false);
    }

    // Handle navigation actions
    switch(index) {
      case 1: // Help
        showHelp();
        break;
      case 2: // Logout
        handleLogout();
        break;
      default:
        // no-op for other indices (e.g., 0 = Dashboard)
        break;
    }
  };

  const showHelp = () => {
    // Show help modal or page
    alert('Help information will be displayed here.');
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 [UserPage] Logging out...');
      logoutUser();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('❌ [UserPage] Logout error:', err);
      // Force redirect even if error
      navigate('/login', { replace: true });
    }
  };

  const navItems = [
    { icon: 'fas fa-home', text: 'Dashboard' },
    { icon: 'fas fa-question-circle', text: 'Help' },
    { icon: 'fas fa-sign-out-alt', text: 'Logout' }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="user-dashboard-wrapper">
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no user data
  if (!userData) {
    return (
      <div className="user-dashboard-wrapper">
        <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
          <div className="text-center">
            <h3>Error loading user data</h3>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Error banner if API failed */}
      {error && (
        <div className="container px-4 mt-2">
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <strong>Note:</strong> Could not load live data ({error}). Showing demo data.
          </div>
        </div>
      )}

      {/* Dev debug: show raw API response if available 
      {process.env.NODE_ENV !== 'production' && userData && userData._raw && (
        <div className="container px-4 mt-2">
          <div className="alert alert-secondary small">
            <strong>Dev debug - raw API response:</strong>
            <pre style={{whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto'}}>{JSON.stringify(userData._raw, null, 2)}</pre>
          </div>
        </div>
      )} */}

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
import '../../assets/styles/userpage-styles.css';
import { useState, useEffect, useCallback } from 'react';
import { getCurrentUserData, logoutUser, changeUserPassword, updateUserProfile } from "../../api/userApi";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../../assets/images/dasma-logo-only.png';
import UserSidebar from '../../components/usersidebar';

export default function UserPage() {
  const navigate = useNavigate();
  const [isSidebarActive, setSidebarActive] = useState(false); /** @summary Mobile sidebar visibility state. @remarks Controls the collapsible sidebar on mobile devices using CSS classes. */
  const [activeNav, setActiveNav] = useState(0); /** @summary Active navigation item index. @remarks Tracks which navigation item is currently active (Dashboard, Help, Logout). */
  const [userData, setUserData] = useState(null); /** @summary User data state storing profile and application information. @remarks Holds the information of the logged-in user fetched from API or demo data fallback. */
  const [loading, setLoading] = useState(true); /** @summary Loading state for API data fetch operations. @remarksShows loading spinner while user data is being retrieved from the API. */
  const [error, setError] = useState(null); /** @summary Error state for API request failures. @remarks Holds any error messages related to user data fetching when API calls fail and triggers demo data fallback. */

  // help modal useState refer: https://react-bootstrap.netlify.app/docs/components/modal/
  const [showHelpModal, setShowHelpModal] = useState(false); /**  @summary Help modal visibility state for user assistance. @remarks Controls the display of the help information modal using React Bootstrap. */
  // modal handlers
  const handleCloseHelpModal = () => setShowHelpModal(false); /** @summary Closes the help modal dialog.  @remarks Handler function for modal close events and cancel actions. */
  const handleShowHelpModal = () => setShowHelpModal(true); /** @summary Opens the help modal dialog. @remarks Triggered when user clicks the help navigation item or help button. */

  // File list state
  const [userFiles, setUserFiles] = useState([]); /** @summary Uploaded files list for current user. */
  const [filesLoading, setFilesLoading] = useState(false); /** @summary Loading state for file fetch. */
  const [filesError, setFilesError] = useState(null); /** @summary Error message for file operations. */

  // View document in new tab
  const handleViewDocument = (fileId) => {
    const viewUrl = `http://localhost/webdev_finals/PWD AUTOMATED APPLICATION SYSTEM/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/file-view.php?fileId=${fileId}`;
    window.open(viewUrl, '_blank');
  };

  /**
   * @summary Computes status display information based on application status.
   * 
   * @param {string} status - The raw status value from user data.
   * @returns {Object} Object containing display label, progress percentage, and CSS classes.
   * 
   * @remarks
   * Maps backend status values to user-friendly labels and visual indicators.
   * Supports three canonical statuses: pending, accepted, denied with fallback handling.
   */
  //Compute display label, progress percent and css class based on stored status
  const getStatusInfo = (status) => {
    //Only accept the three canonical statuses: pending, accepted, denied
    const s = (status || '').toString().trim().toLowerCase();
    if (s === 'pending' || s === 'under review') {
      return { label: 'Under Review', percent: 60, badgeClass: 'status-warning', fillClass: 'fill-warning' };
    }
    if (s === 'accepted' || s === 'approved') {
      return { label: 'Accepted', percent: 100, badgeClass: 'status-success', fillClass: 'fill-success' };
    }
    if (s === 'denied' || s === 'rejected') {
      return { label: 'Denied', percent: 100, badgeClass: 'status-danger', fillClass: 'fill-danger' };
    }
    // Fallback for any other value: show Unknown with 0% and neutral styling
    return { label: status || 'Unknown', percent: 0, badgeClass: 'status-neutral', fillClass: 'fill-neutral' };
  };

  /**
   * @summary Effect hook for loading user data on component mount.
   * 
   * @remarks
   * Fetches current user data from API and handles authentication checks.
   * Falls back to demo data if API requests fail for development continuity.
   */
  // Fetch user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('[UserPage] Starting to fetch user data...');
        
        //Check if user is logged in
        const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        if (!userId) {
          console.warn(' [UserPage] No userId found, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }
        
        console.log('[UserPage] Found userId:', userId);
        
        // Fetch user data from API
        const data = await getCurrentUserData();
        console.log('[UserPage] User data loaded successfully:', data);
        
        setUserData(data);
        setError(null);
        
      } catch (err) {
        console.error('[UserPage] Failed to load user data:', err.message);
        setError(err.message);
        
        // If API fails, use demo data for development
        console.log('[UserPage] Using demo data as fallback');
        setUserData(getDemoUserData());
        
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Extract file fetching logic to a reusable function using useCallback
  const fetchUserFiles = useCallback(async () => {
    if (!userData?.regNumber) return;
    
    setFilesLoading(true);
    setFilesError(null);
    try {
      const response = await fetch(
        `http://localhost/webdev_finals/PWD AUTOMATED APPLICATION SYSTEM/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/files.php?regNumber=${userData.regNumber}`
      );
      const data = await response.json();
      if (data.success) {
        setUserFiles(data.files);
      } else {
        setFilesError(data.error || 'Failed to load files');
      }
    } catch (error) {
      console.error('[UserPage] Error fetching files:', error);
      setFilesError('Could not load files');
    } finally {
      setFilesLoading(false);
    }
  }, [userData?.regNumber]);

  // Fetch user files when userData is available
  useEffect(() => {
    if (userData?.regNumber) {
      fetchUserFiles();
    }
  }, [userData?.regNumber, fetchUserFiles]);

  // Edit Profile - Initialize form with current data
  const initializeEditProfileForm = useCallback(() => {
    if (userData) {
      setEditAddress(userData.street || '');
      setEditContactNumber(userData.mobile || '');
      setEditEmergencyContact(userData.emergencyName || '');
      setEditEmergencyNumber(userData.emergencyPhone || '');
    }
  }, [userData]);

  // Initialize edit profile form when switching to Edit Profile view
  useEffect(() => {
    if (activeNav === 1) {
      initializeEditProfileForm();
    }
  }, [activeNav, userData, initializeEditProfileForm]);

  /**
   * @summary Provides demo user data for development and fallback scenarios.
   * 
   * @returns {Object} Complete user data object with sample values.
   * 
   * @remarks
   * Used when API is unavailable or during development testing.
   * Mirrors the exact data structure expected from the live API.
   */
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

  /**
   * @summary Handles navigation item clicks with associated actions.
   * 
   * @param {number} index - The index of the clicked navigation item.
   * 
   * @remarks
   * Manages sidebar state for mobile and triggers appropriate actions for each nav item.
   * Closes mobile sidebar automatically after navigation selection.
   */
  const handleNavClick = (index) => {
    setActiveNav(index);
    if (isSidebarActive) {
      setSidebarActive(false);
    }

    // Handle navigation actions
    switch(index) {
      case 1: // Edit Profile
        // switch view handled by activeNav
        break;
      case 2: // View/Print ID
        // switch view handled by activeNav
        break;
      case 3: // Change Password
        // switch view handled by activeNav
        break;
      case 4: // My Documents
        // switch view handled by activeNav
        break;
      case 5: // Help
        showHelp();
        break;
      case 6: // Logout
        // show confirmation modal before logging out
        handleShowLogoutModal();
        break;
      default:
        // no-op for other indices (e.g., 0 = Dashboard)
        break;
    }
  };

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [changeMessage, setChangeMessage] = useState(null);
  const [changeError, setChangeError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleCloseConfirmModal = () => setShowConfirmModal(false);
  const handleShowConfirmModal = () => setShowConfirmModal(true);

  // Edit Profile state
  const [editAddress, setEditAddress] = useState('');
  const [editContactNumber, setEditContactNumber] = useState('');
  const [editEmergencyContact, setEditEmergencyContact] = useState('');
  const [editEmergencyNumber, setEditEmergencyNumber] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editMessage, setEditMessage] = useState(null);
  const [editError, setEditError] = useState(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [editChanges, setEditChanges] = useState({});

  const handleCloseEditConfirmModal = () => setShowEditConfirmModal(false);
  const handleShowEditConfirmModal = () => setShowEditConfirmModal(true);

  // Logout confirmation modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Validate inputs and show confirmation modal
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setChangeMessage(null);
    setChangeError(null);

    if (!currentPassword || !newPassword) {
      setChangeError('Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('New password and confirmation do not match.');
      return;
    }

    // Show confirmation modal before making API call
    handleShowConfirmModal();
  };

  // Actual API call executed when user confirms
  const performChangePassword = async () => {
    setChangeMessage(null);
    setChangeError(null);
    setShowConfirmModal(false);

    try {
      setChangingPassword(true);
      const regNumber = sessionStorage.getItem('userId') || localStorage.getItem('userId');
      const res = await changeUserPassword(regNumber, currentPassword, newPassword);
      if (res.success) {
        setChangeMessage(res.message || 'Password changed successfully.');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        setChangeError(res.message || 'Failed to change password.');
      }
    } catch (err) {
      setChangeError(err.message || 'Error changing password');
    } finally {
      setChangingPassword(false);
    }
  };

  // Edit Profile - Track changes
  const handleEditProfileChange = (field, value) => {
    switch(field) {
      case 'address':
        setEditAddress(value);
        setEditChanges(prev => ({ ...prev, address: value }));
        break;
      case 'contactNumber':
        setEditContactNumber(value);
        setEditChanges(prev => ({ ...prev, contactNumber: value }));
        break;
      case 'emergencyContact':
        setEditEmergencyContact(value);
        setEditChanges(prev => ({ ...prev, emergencyContact: value }));
        break;
      case 'emergencyNumber':
        setEditEmergencyNumber(value);
        setEditChanges(prev => ({ ...prev, emergencyNumber: value }));
        break;
      default:
        break;
    }
  };

  // Edit Profile - Validate and show confirmation
  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    setEditMessage(null);
    setEditError(null);

    if (Object.keys(editChanges).length === 0) {
      setEditError('No changes made.');
      return;
    }

    // Show confirmation modal
    handleShowEditConfirmModal();
  };

  // Edit Profile - Actual API call
  const performEditProfile = async () => {
    setEditMessage(null);
    setEditError(null);
    setShowEditConfirmModal(false);

    try {
      setEditingProfile(true);
      const regNumber = sessionStorage.getItem('userId') || localStorage.getItem('userId');
      
      const res = await updateUserProfile(regNumber, editChanges);
      
      if (res.success) {
        setEditMessage(res.message || 'Profile updated successfully.');
        // Update userData with new profile info
        setUserData(prev => ({
          ...prev,
          street: editAddress || prev.street,
          mobile: editContactNumber || prev.mobile,
          emergencyName: editEmergencyContact || prev.emergencyName,
          emergencyPhone: editEmergencyNumber || prev.emergencyPhone
        }));
        setEditChanges({});
      } else {
        setEditError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setEditError(err.message || 'Error updating profile');
    } finally {
      setEditingProfile(false);
    }
  };

  /**
   * @summary Displays help information to the user.
   * 
   * @remarks
   * Opens the help modal with application guidance and support information.
   */
  const showHelp = () => {
    // Show help modal or page
    handleShowHelpModal();
    //alert('Help information will be displayed here.');
  };

  /**
   * @summary Handles user logout and session cleanup.
   * 
   * @remarks
   * Clears authentication data and redirects to login page.
   * Includes error handling to ensure logout completes even if errors occur.
   */
  const handleLogout = async () => {
    try {
      console.log('[UserPage] Logging out...');
      // show perceived delay with spinner
      setLoggingOut(true);
      // wait 1.2s to simulate processing / give UX feedback
      await new Promise((resolve) => setTimeout(resolve, 1200));
      logoutUser();
      setLoggingOut(false);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('[UserPage] Logout error:', err);
      setLoggingOut(false);
      // Force redirect even if error
      navigate('/login', { replace: true });
    }
  };



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
            <div className="d-flex align-items-center">
              <img src={logo} alt="City of Dasmariñas Logo" className="user-header-logo align-self-center" />
              <h1>PWD Application Dashboard</h1>
            </div>
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
        <UserSidebar 
          userData={userData}
          activeNav={activeNav}
          isSidebarActive={isSidebarActive}
          onNavClick={handleNavClick}
        />

        {/* Main Content */}
        <main className="user-main-content">
          {activeNav === 1 ? (
            <div className="user-card">
              <h3 className="user-card-title">Edit Profile</h3>
              <p className="user-card-subtitle">Update your personal details</p>

              {editMessage && (
                <div className="alert alert-success">{editMessage}</div>
              )}
              {editError && (
                <div className="alert alert-danger">{editError}</div>
              )}

              <form onSubmit={handleEditProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label">Address (House No. and Street)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editAddress}
                    onChange={(e) => handleEditProfileChange('address', e.target.value)}
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={editContactNumber}
                    onChange={(e) => handleEditProfileChange('contactNumber', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Emergency Contact Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editEmergencyContact}
                    onChange={(e) => handleEditProfileChange('emergencyContact', e.target.value)}
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Emergency Contact Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={editEmergencyNumber}
                    onChange={(e) => handleEditProfileChange('emergencyNumber', e.target.value)}
                    placeholder="Enter emergency contact phone number"
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={editingProfile}>
                  {editingProfile ? 'Updating...' : 'Save Changes'}
                </button>
              </form>
            </div>
          ) : activeNav === 2 ? (
            /* View/Print PWD ID Card */
            <div className="user-card pwd-card-preview">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="user-card-title mb-0">PWD ID Application Card</h3>
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print me-2"></i>Print
                </button>
              </div>
              <p className="text-muted small mb-4">Preview your PWD application details. Click Print to save or print this card.</p>

              {/* PWD Card Layout */}
              <div className="pwd-id-card">
                <div className="pwd-card-header">
                  <img src={logo} alt="City Logo" className="pwd-card-logo" />
                  <div className="pwd-card-header-text">
                    <h4>Republic of the Philippines</h4>
                    <h5>City of Dasmariñas, Cavite</h5>
                    <h6>Person with Disability (PWD) ID</h6>
                  </div>
                </div>

                <div className="pwd-card-body">
                  <div className="pwd-card-photo">
                    <i className="fas fa-user"></i>
                    <span className="photo-placeholder-text">Photo</span>
                  </div>
                  <div className="pwd-card-info">
                    <div className="pwd-card-row">
                      <span className="pwd-label">Registration No:</span>
                      <span className="pwd-value">{userData.regNumber || '—'}</span>
                    </div>
                    <div className="pwd-card-row">
                      <span className="pwd-label">Name:</span>
                      <span className="pwd-value">
                        {`${userData.lastName || ''}, ${userData.firstName || ''} ${userData.middleName || ''}`.trim() || '—'}
                      </span>
                    </div>
                    <div className="pwd-card-row">
                      <span className="pwd-label">Date of Birth:</span>
                      <span className="pwd-value">{userData.dob || '—'}</span>
                    </div>
                    <div className="pwd-card-row">
                      <span className="pwd-label">Sex:</span>
                      <span className="pwd-value">{userData.sex || '—'}</span>
                    </div>
                    <div className="pwd-card-row">
                      <span className="pwd-label">Disability:</span>
                      <span className="pwd-value">{userData.disability || '—'}</span>
                    </div>
                    <div className="pwd-card-row">
                      <span className="pwd-label">Address:</span>
                      <span className="pwd-value">
                        {`${userData.street || ''}, ${userData.barangay || ''}, ${userData.municipality || ''}, ${userData.province || ''}`.replace(/^, |, $/g, '') || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pwd-card-footer">
                  <div className="pwd-card-row">
                    <span className="pwd-label">Blood Type:</span>
                    <span className="pwd-value">{userData.blood || '—'}</span>
                  </div>
                  <div className="pwd-card-row">
                    <span className="pwd-label">Emergency Contact:</span>
                    <span className="pwd-value">{userData.emergencyName || '—'} ({userData.emergencyPhone || '—'})</span>
                  </div>
                  <div className="pwd-card-row">
                    <span className="pwd-label">Date Registered:</span>
                    <span className="pwd-value">{userData.regDate || '—'}</span>
                  </div>
                  <div className="pwd-card-row">
                    <span className="pwd-label">Status:</span>
                    <span className={`pwd-value pwd-status-${(userData.status || '').toLowerCase()}`}>
                      {userData.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="pwd-card-qr" role="region" aria-label="PWD ID Verification QR Code">
                  <span className="sr-only">QR Code containing PWD ID information for verification</span>
                  <QRCodeSVG 
                    value={`PWD ID: ${userData.regNumber || 'N/A'}
                    Name: ${userData.lastName || ''}, ${userData.firstName || ''} ${userData.middleName || ''}
                    Disability: ${userData.disability || 'N/A'}
                    Status: ${userData.status || 'Pending'}
                    City Government of Dasmariñas`}
                    size={120}
                    level="H"
                    includeMargin={true}
                    aria-hidden="true"
                  />
                  <span className="pwd-qr-label">
                    <i className="fas fa-qrcode me-1" aria-hidden="true"></i>
                    Scan to Verify
                  </span>
                  <span className="pwd-qr-sublabel">PWD ID: {userData.regNumber || 'N/A'}</span>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="mt-4">
                <h5 className="mb-3">Application Details</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="text-muted">Contact Information</h6>
                      <p className="mb-1"><strong>Mobile:</strong> {userData.mobile || '—'}</p>
                      <p className="mb-1"><strong>Tel:</strong> {userData.tel || '—'}</p>
                      <p className="mb-0"><strong>Email:</strong> {userData.email || '—'}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="text-muted">Documents Submitted</h6>
                      <p className="mb-1"><strong>ID Document:</strong> {userData.proofIdentity || 'Not uploaded'}</p>
                      <p className="mb-0"><strong>Medical Certificate:</strong> {userData.proofDisability || 'Not uploaded'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeNav === 3 ? (
            <div className="user-card">
              <h3 className="user-card-title">Change Password</h3>
              <p className="user-card-subtitle">Update your account password</p>

              {changeMessage && (
                <div className="alert alert-success">{changeMessage}</div>
              )}
              {changeError && (
                <div className="alert alert-danger">{changeError}</div>
              )}

              <form onSubmit={handleChangePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                  {changingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          ) : activeNav === 4 ? (
            /* My Documents */
            <div className="user-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="user-card-title mb-1">My Documents</h3>
                  <p className="user-card-subtitle mb-0">View and manage your uploaded documents</p>
                </div>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={fetchUserFiles}
                  disabled={filesLoading}
                  title="Refresh document list"
                >
                  <i className={`fas fa-sync-alt me-2 ${filesLoading ? 'fa-spin' : ''}`}></i>
                  Refresh
                </button>
              </div>

              {filesError && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {filesError}
                </div>
              )}

              {filesLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading documents...</span>
                  </div>
                </div>
              ) : userFiles.length === 0 ? (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  No documents uploaded yet. Please upload your documents during registration.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Document Type</th>
                        <th>Filename</th>
                        <th>Size</th>
                        <th>Status</th>
                        <th>Uploaded</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userFiles.map(file => (
                        <tr key={file.id}>
                          <td>
                            <i className={`fas me-2 ${
                              file.type === 'medical_certificate' 
                                ? 'fa-file-medical text-danger' 
                                : 'fa-id-card text-primary'
                            }`}></i>
                            {file.type === 'medical_certificate' ? 'Medical Certificate' : 'Identity Proof'}
                          </td>
                          <td>
                            <small>{file.originalFilename}</small>
                          </td>
                          <td>
                            <small>{(file.size / 1024).toFixed(1)} KB</small>
                          </td>
                          <td>
                            <span className={`badge bg-${
                              file.status === 'approved' ? 'success' :
                              file.status === 'rejected' ? 'danger' :
                              'warning'
                            }`}>
                              {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <small>{new Date(file.uploadedAt).toLocaleDateString()}</small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group" aria-label="Document actions">
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                title="View document in new tab"
                                onClick={() => handleViewDocument(file.id)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <a 
                                href={`http://localhost/webdev_finals/PWD AUTOMATED APPLICATION SYSTEM/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/file-download.php?fileId=${file.id}`}
                                className="btn btn-outline-primary"
                                title="Download document"
                                download
                              >
                                <i className="fas fa-download"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Upload Status Summary */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-2"><i className="fas fa-chart-pie me-2"></i>Upload Status</h6>
                <div className="row">
                  <div className="col-sm-6 col-md-3">
                    <small className="text-muted">Total Documents</small>
                    <p className="h5 mb-0 text-primary">{userFiles.length}</p>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <small className="text-muted">Approved</small>
                    <p className="h5 mb-0 text-success">{userFiles.filter(f => f.status === 'approved').length}</p>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <small className="text-muted">Pending</small>
                    <p className="h5 mb-0 text-warning">{userFiles.filter(f => f.status === 'pending').length}</p>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <small className="text-muted">Rejected</small>
                    <p className="h5 mb-0 text-danger">{userFiles.filter(f => f.status === 'rejected').length}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="user-page-title">Application Status</h2>
              <p className="user-page-subtitle">Track your PWD ID application progress</p>

              {/* Application Summary */}
              <div className="user-card">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div>
                    <h3 className="user-card-title">PWD ID Application</h3>
                    <p className="mb-2"><strong>Registration No:</strong> {userData.regNumber}</p>
                    {/* Dynamic status badge */}
                    {(() => {
                      const info = getStatusInfo(userData.status);
                      return (
                        <span className={`user-status-badge ${info.badgeClass}`}>
                          {info.label === 'Under Review' ? <i className="fas fa-clock"></i> : null}
                          {info.label === 'Accepted' ? <i className="fas fa-check-circle"></i> : null}
                          {info.label === 'Denied' ? <i className="fas fa-times-circle"></i> : null}
                          {' '}{info.label}
                        </span>
                      );
                    })()}
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
                    {(() => {
                      const info = getStatusInfo(userData.status);
                      return (
                        <div className={`user-progress-fill ${info.fillClass}`} style={{width: `${info.percent}%`}} />
                      );
                    })()}
                  </div>
                  <div className="user-progress-steps">
                    <span>Submitted</span>
                    <span>Verification</span>
                    <span>Review</span>
                    <span>Approval</span>
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
                
                {/* Dynamic activity based on status */}
                {(() => {
                  const status = userData.status?.toLowerCase();
                  
                  // Helper function to format dates consistently
                  const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  };
                  
                  // Format updatedAt for status changes (fallback to regDate if not available)
                  const statusUpdateDate = formatDate(userData.updatedAt || userData.regDate);
                  
                  // Get latest document review date from userFiles
                  const latestReviewDate = userFiles.length > 0 
                    ? userFiles
                        .filter(f => f.reviewedAt)
                        .sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt))[0]?.reviewedAt
                    : null;
                  const documentsVerifiedDate = formatDate(latestReviewDate || userData.regDate);
                  const submissionDate = formatDate(userData.regDate);
                  
                  if (status === 'pending') {
                    return (
                      <div className="user-activity-item">
                        <div className="user-activity-header">
                          <span className="user-activity-title">Application Under Review</span>
                          <span className="user-activity-time">{submissionDate}</span>
                        </div>
                        <p className="user-activity-desc">Your application is currently being reviewed by our team.</p>
                      </div>
                    );
                  } else if (status === 'accepted') {
                    return (
                      <>
                        <div className="user-activity-item">
                          <div className="user-activity-header">
                            <span className="user-activity-title">Application Approved</span>
                            <span className="user-activity-time">{statusUpdateDate}</span>
                          </div>
                          <p className="user-activity-desc">Congratulations! Your PWD application has been approved.</p>
                        </div>
                        <div className="user-activity-item">
                          <div className="user-activity-header">
                            <span className="user-activity-title">Documents Verified</span>
                            <span className="user-activity-time">{documentsVerifiedDate}</span>
                          </div>
                          <p className="user-activity-desc">All submitted documents have been verified.</p>
                        </div>
                      </>
                    );
                  } else if (status === 'denied') {
                    return (
                      <>
                        <div className="user-activity-item">
                          <div className="user-activity-header">
                            <span className="user-activity-title">Application Status Updated</span>
                            <span className="user-activity-time">{statusUpdateDate}</span>
                          </div>
                          <p className="user-activity-desc">Your application status has been updated. Please contact support for details.</p>
                        </div>
                        <div className="user-activity-item">
                          <div className="user-activity-header">
                            <span className="user-activity-title">Documents Verified</span>
                            <span className="user-activity-time">{documentsVerifiedDate}</span>
                          </div>
                          <p className="user-activity-desc">All submitted documents have been verified.</p>
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <div className="user-activity-item">
                        <div className="user-activity-header">
                          <span className="user-activity-title">Application Under Review</span>
                          <span className="user-activity-time">{submissionDate}</span>
                        </div>
                        <p className="user-activity-desc">Your application is currently being reviewed by our team.</p>
                      </div>
                    );
                  }
                })()}

                <div className="user-activity-item">
                  <div className="user-activity-header">
                    <span className="user-activity-title">Application Submitted</span>
                    <span className="user-activity-time">
                      {new Date(userData.regDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="user-activity-desc">Your PWD application has been successfully submitted.</p>
                </div>
              </div>
            </>
          )}
        </main>
        {/* Confirm Change Password Modal */}
        <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Password Change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to change your password? This action will update your account credentials.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConfirmModal}>Cancel</Button>
            <Button variant="danger" onClick={performChangePassword} disabled={changingPassword}>
              {changingPassword ? 'Updating...' : 'Yes, change password'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Change Password Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Password Change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to change your password? Please make sure you enter your new password correctly.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConfirmModal}>Cancel</Button>
            <Button variant="primary" onClick={() => { handleCloseConfirmModal(); performChangePassword(); }}>
              Change Password
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Profile Confirmation Modal */}
        <Modal show={showEditConfirmModal} onHide={handleCloseEditConfirmModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Profile Changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to update your profile with the following changes?</p>
            <ul className="small">
              {editChanges.address && <li>Address updated</li>}
              {editChanges.contactNumber && <li>Contact number updated</li>}
              {editChanges.emergencyContact && <li>Emergency contact name updated</li>}
              {editChanges.emergencyNumber && <li>Emergency contact number updated</li>}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditConfirmModal}>Cancel</Button>
            <Button variant="primary" onClick={() => { handleCloseEditConfirmModal(); performEditProfile(); }}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Logout Confirmation Modal */}
        <Modal show={showLogoutModal} onHide={handleCloseLogoutModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to log out? You will be redirected to the login page.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseLogoutModal}>Cancel</Button>
            <Button variant="danger" onClick={() => { handleCloseLogoutModal(); handleLogout(); }}>
              Yes, Log Out
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Help Modal - Tried Using React-Bootstrap Modal */}
      <Modal show={showHelpModal} onHide={handleCloseHelpModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-question-circle me-2"></i>
            PWD Application Help
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="help-content">
            <h5>Application Status Guide</h5>
            <ul>
              <li><strong>Under Review:</strong> Your application is being processed by our team</li>
              <li><strong>Accepted:</strong> Your PWD ID has been accepted and will be issued</li>
              <li><strong>Denied:</strong> Your application was not accepted. Please contact support for details</li>
            </ul>

            <h5>Progress Tracking</h5>
            <p>The progress bar shows which stage your application is in:</p>
            <ul>
              <li><strong>Submitted:</strong> Application received</li>
              <li><strong>Verification:</strong> Documents are being verified</li>
              <li><strong>Review:</strong> Under final review</li>
              <li><strong>Approval:</strong> Final decision stage</li>
            </ul>

            <h5>Need More Help?</h5>
            <p>If you have questions about your application:</p>
            <ul>
              <li>Visit the local PWD office</li>
              <li>Call: (02) 1234-5678</li>
              <li>Email: pwd.support@localgov.ph</li>
            </ul>

            <div className="alert alert-info mt-3">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Note:</strong> Application processing typically takes 7-14 business days.
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseHelpModal}>Okay</Button>
        </Modal.Footer>
      </Modal>

      {/* Logging out spinner (non-closable) */}
      <Modal show={loggingOut} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center py-4">
          <div className="d-flex flex-column align-items-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Logging out...</span>
            </div>
            <div>Logging out... Please wait</div>
          </div>
        </Modal.Body>
      </Modal>



      </div>
    </div>
  );
}
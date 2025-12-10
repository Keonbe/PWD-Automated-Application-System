import PropTypes from 'prop-types';

/**
 * UserSidebar Component
 * 
 * @summary Reusable sidebar navigation component for the user dashboard.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.userData - User data object containing firstName, lastName, and status.
 * @param {number} props.activeNav - Currently active navigation item index (0=Dashboard, 1=Help, 2=Logout).
 * @param {boolean} props.isSidebarActive - Mobile sidebar visibility state.
 * @param {Function} props.onNavClick - Handler called when a nav item is clicked (index passed).
 * 
 * @remarks
 * Displays user profile info, navigation menu with Dashboard, Help, and Logout options.
 * Automatically closes on mobile when nav item is clicked.
 * Accepts isSidebarActive to control mobile sidebar visibility from parent.
 */
export default function UserSidebar({ userData, activeNav, isSidebarActive, onNavClick }) {
    /**
   * @summary Navigation items configuration for sidebar menu.
   * 
   * @remarks
   * Defines the structure and icons for the main navigation menu.
   * Used to generate the sidebar navigation links dynamically.
   */
    const navItems = [
    { icon: 'fas fa-home', text: 'Dashboard' },
    { icon: 'fas fa-user-edit', text: 'Edit Profile' },
    { icon: 'fas fa-key', text: 'Change Password' },
    { icon: 'fas fa-question-circle', text: 'Help' },
    { icon: 'fas fa-sign-out-alt', text: 'Logout' }
    ];

    return (
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
                onClick={() => onNavClick(index)}
                aria-pressed={activeNav === index}
                >
                <i className={item.icon} aria-hidden="true"></i>
                <span>{item.text}</span>
                </button>
            </li>
            ))}
        </ul>
        </aside>
    );
}

UserSidebar.propTypes = {
    userData: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    }).isRequired,
    activeNav: PropTypes.number.isRequired,
    isSidebarActive: PropTypes.bool.isRequired,
    onNavClick: PropTypes.func.isRequired,
};

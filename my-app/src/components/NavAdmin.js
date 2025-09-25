import { Outlet, NavLink, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { FaTachometerAlt, FaPlusSquare, FaHistory, FaUsers, FaTrashAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import logo from '../image/1000421632.jpg';

function NavAdmin() {
  const { adminName, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  if (adminName === '') {
    navigate('/admin');
    return null; // Return null to prevent rendering while redirecting
  }

  const navItems = [
    { to: "/manage", icon: <FaTachometerAlt />, label: "Available Exams" },
    { to: "/manage/add-exam", icon: <FaPlusSquare />, label: "Add Exam" },
    { to: "/manage/all-history", icon: <FaHistory />, label: "Exam Reports" },
    { to: "/manage/users", icon: <FaUsers />, label: "Students" },
    { to: "/manage/remove-exam", icon: <FaTrashAlt />, label: "Remove Exam" }
  ];

  return (
      <div style={styles.dashboardContainer}>
        {/* Sidebar Navigation */}
        <aside style={{ ...styles.sidebar, ...(isSidebarOpen ? styles.sidebarOpen : {}) }}>
          <div style={styles.sidebarHeader}>
            <img src={logo} alt="GUNCHU COACHING Logo" style={styles.logoImage} />
          </div>
          <nav style={styles.nav}>
            {navItems.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/manage"} // Ensures only "Available Exams" is active on its exact path
                    style={({ isActive }) => ({
                      ...styles.navLink,
                      ...(isActive ? styles.navLinkActive : {})
                    })}
                    onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after click
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          <header style={styles.topbar}>
            <button style={styles.menuButton} onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{adminName}</span>
              <button style={styles.logoutButton} onClick={handleLogout}>
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                Logout
              </button>
            </div>
          </header>
          <main style={styles.pageContent}>
            <Outlet />
          </main>
        </div>
      </div>
  );
}

const styles = {
  logoImage: {
    height: '50px',
    width: 'auto',
    margin: '10px 0'
  },
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100%',
    left: 0,
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000,
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: '1px solid #34495e',
    textAlign: 'center',
  },
  logo: {
    margin: 0,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  nav: {
    flexGrow: 1,
    padding: '20px 0',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    color: '#bdc3c7',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'background-color 0.2s, color 0.2s',
  },
  navLinkActive: {
    backgroundColor: '#3498db',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  navIcon: {
    marginRight: '15px',
    fontSize: '1.2rem',
  },
  mainContent: {
    marginLeft: '260px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: 'calc(100% - 260px)',
    position: 'fixed',
    zIndex: 999,
  },
  menuButton: {
    display: 'none', // Hidden on desktop
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  userName: {
    marginRight: '20px',
    fontWeight: '600',
    color: '#34495e',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  pageContent: {
    padding: '30px',
    marginTop: '70px', // Space for the fixed topbar
  },
  // Media queries would traditionally handle this, but for inline styles we need JS or a library.
  // For this example, we'll imagine a mobile-first approach with CSS.
  // Let's add responsive styles directly for clarity.
  '@media (max-width: 768px)': {
    sidebar: {
      transform: 'translateX(-100%)',
    },
    sidebarOpen: {
      transform: 'translateX(0)',
    },
    mainContent: {
      marginLeft: 0,
    },
    topbar: {
      width: '100%',
    },
    menuButton: {
      display: 'block',
    }
  }
};

// Applying responsive styles requires a bit more logic in React without a CSS-in-JS library,
// so let's adjust for that. This is a simplified approach. In a real app, use styled-components or similar.
const isMobile = window.innerWidth <= 768;

if (isMobile) {
  styles.sidebar = { ...styles.sidebar, ...styles['@media (max-width: 768px)'].sidebar };
  styles.sidebarOpen = { ...styles.sidebar, ...styles['@media (max-width: 768px)'].sidebarOpen };
  styles.mainContent = { ...styles.mainContent, ...styles['@media (max-width: 768px)'].mainContent };
  styles.topbar = { ...styles.topbar, ...styles['@media (max-width: 768px)'].topbar };
  styles.menuButton = { ...styles.menuButton, ...styles['@media (max-width: 768px)'].menuButton };
}


export default NavAdmin;

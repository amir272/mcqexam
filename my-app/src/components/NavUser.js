import { Outlet, NavLink, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { FaBookOpen, FaHistory, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../image/1000421632.jpg';

function Nav() {
  const { name, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Redirect if not logged in
  useEffect(() => {
    if (username === '') {
      navigate('/');
    }
  }, [username, navigate]);

  if (username === '') {
    return null; // Prevent rendering during redirect
  }

  const navItems = [
    { to: "/user", icon: <FaBookOpen />, label: "Available Exams" },
    { to: "/user/my-history", icon: <FaHistory />, label: "My History" }
  ];

  return (
      <div style={styles.pageContainer}>
        <header style={styles.topbar}>
          <div style={styles.topbarContent}>
            <NavLink to="/user" style={styles.logoLink}>
              <img src={logo} alt="GUNCHU COACHING Logo" style={styles.logoImage} />
            </NavLink>

            {/* Desktop Navigation */}
            <nav style={styles.desktopNav}>
              {navItems.map(item => (
                  <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/user"}
                      style={({ isActive }) => ({
                        ...styles.navLink,
                        ...(isActive ? styles.navLinkActive : {})
                      })}
                  >
                    <span style={styles.navIcon}>{item.icon}</span>
                    {item.label}
                  </NavLink>
              ))}
            </nav>

            {/* User Info and Logout */}
            <div style={styles.userInfo}>
              <span style={styles.userName}>Welcome, {name}</span>
              <button style={styles.logoutButton} onClick={handleLogout}>
                <FaSignOutAlt />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button style={styles.menuButton} onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
              <nav style={styles.mobileNav}>
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/user"}
                        style={({ isActive }) => ({
                          ...styles.mobileNavLink,
                          ...(isActive ? styles.mobileNavLinkActive : {})
                        })}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                      <span style={styles.navIcon}>{item.icon}</span>
                      {item.label}
                    </NavLink>
                ))}
              </nav>
          )}
        </header>

        <main style={styles.pageContent}>
          <Outlet />
        </main>
      </div>
  );
}

const styles = {
  logoImage: {
    height: '50px',
    width: 'auto',
    margin: '10px 0'
  },
  pageContainer: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  topbar: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 1020,
  },
  topbarContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    margin: 0,
    color: '#343a40',
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  desktopNav: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#495057',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '24px 0',
    borderBottom: '3px solid transparent',
    transition: 'color 0.2s, border-bottom-color 0.2s',
  },
  navLinkActive: {
    color: '#007bff',
    borderBottom: '3px solid #007bff',
  },
  navIcon: {
    marginRight: '8px',
    fontSize: '1.1rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  userName: {
    marginRight: '1rem',
    fontWeight: '500',
    color: '#495057',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  menuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  mobileNav: {
    display: 'none',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: '1rem 0',
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 2rem',
    color: '#495057',
    textDecoration: 'none',
  },
  mobileNavLinkActive: {
    backgroundColor: '#e9ecef',
    color: '#007bff',
  },
  pageContent: {
    padding: '1rem',
  },
};

// --- Basic Responsiveness ---
// A true solution would use CSS media queries or a CSS-in-JS library.
const isMobile = window.innerWidth <= 768;
if (isMobile) {
  styles.desktopNav = { display: 'none' };
  styles.userInfo = { display: 'none' };
  styles.menuButton = { display: 'block' };
  styles.mobileNav = {
    ...styles.mobileNav,
    display: 'flex',
  };
}

export default Nav;

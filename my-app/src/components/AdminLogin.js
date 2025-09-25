import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {AuthContext} from "./AuthProvider";
import logo from "../image/1000421632.jpg";

const FaUserShield = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm96 32h-3.8c-13.3 0-26-4.8-36.2-12.9L224 224.9l-56.1 48.2C157.8 280.2 145 288 132 288h-4c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64h215.5c-3.2-10-5.5-20.8-5.5-32V352c0-35.3-28.7-64-64-64zM624 288h-48c-35.3 0-64 28.7-64 64v32c0 11.2 2.3 22 5.5 32H624c13.3 0 24-10.7 24-24V312c0-13.3-10.7-24-24-24z"></path><path d="M480 288c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm-9.4 120.6l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0z"></path>
    </svg>
);

const FaLock = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path>
    </svg>
);

const FaArrowLeft = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 240H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 9.9 24.8 .4 34.3z"></path>
    </svg>
);


function AdminLogin() {
    // Re-integrate your AuthContext here
    const { adminName, admin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Mock Auth Check ---
    // In your real app, this would use `adminName` from context
    useEffect(() => {
        if (adminName !== '') navigate('/manage');
    }, [ adminName, navigate]);


    // --- Form Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        // Simulating a small delay for a better UX
        setTimeout(() => {
            if (formData.username === 'gunchu' && formData.password === 'gunchu@123') {
                // In your real app, you would call:
                admin(formData.username);
                setMsg("Login successful! Redirecting...");
                setTimeout(() => navigate('/manage'), 1000);
            } else {
                setMsg("Error: Incorrect username or password");
                setLoading(false);
            }
        }, 500);
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <img src={logo} alt="GUNCHU COACHING Logo" style={styles.logoImage} />
                <h2 style={styles.title}>Admin Portal</h2>
                <p style={styles.subtitle}>Please login to manage the institute dashboard.</p>

                {msg && (
                    <p style={{...styles.message, backgroundColor: msg.startsWith("Error") ? '#ffebee' : '#e8f5e9', color: msg.startsWith("Error") ? '#c62828' : '#2e7d32' }}>
                        {msg}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <span style={styles.inputIcon}><FaUserShield /></span>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            style={styles.inputField}
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Admin Username"
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <span style={styles.inputIcon}><FaLock /></span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            style={styles.inputField}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                </form>

                <div style={styles.linksContainer}>
                    <Link to="/" style={styles.link}>
                        <span style={{ marginRight: '5px' }}><FaArrowLeft /></span> Go to Student Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- Professional Styles (consistent with Login page) ---
const styles = {
    logoImage: {
        height: '50px',
        width: 'auto',
        margin: '10px 0'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#eef2f5',
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    },
    loginCard: {
        backgroundColor: '#ffffff',
        padding: '40px 50px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center',
    },
    title: {
        marginBottom: '10px',
        color: '#2c3e50',
        fontWeight: '600',
        fontSize: '2rem',
    },
    subtitle: {
        marginBottom: '30px',
        color: '#7f8c8d',
    },
    inputGroup: {
        position: 'relative',
        marginBottom: '20px',
    },
    inputIcon: {
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#bdc3c7',
        fontSize: '1em'
    },
    inputField: {
        width: '100%',
        padding: '15px 15px 15px 45px',
        border: '1px solid #dfe6e9',
        borderRadius: '8px',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    submitButton: {
        width: '100%',
        padding: '15px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#e67e22', // A distinct "admin" color
        color: '#ffffff',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px',
    },
    linksContainer: {
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
    },
    link: {
        color: '#3498db',
        textDecoration: 'none',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
    },
    message: {
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        fontWeight: '500',
    }
};

export default AdminLogin;

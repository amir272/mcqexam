import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa'; // Icons for a professional touch
import backgroundImage from "../image/1000421632.jpg";
import logo from "../image/1000421632.jpg";

function Login() {
    const { username, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // --- State Management ---
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Redirect if already logged in ---
    React.useEffect(() => {
        if (username) {
            navigate('/user');
        }
    }, [username, navigate]);

    // --- Handle login from registration redirect ---
    React.useEffect(() => {
        if (location.state?.userName) {
            login(location.state.userName, location.state.fullName, location.state.password);
            navigate('/user');
        }
    }, [location.state, login, navigate]);

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
        try {
            const response = await fetch(`api/user/${formData.username}/${formData.password}`);
            if (!response.ok) {
                throw new Error("Incorrect username or password");
            }
            const data = await response.json();
            setMsg("Successfully logged in! Redirecting...");
            login(data.userName, data.fullName, data.password);
            setTimeout(() => navigate('/user'), 1500);
        } catch (err) {
            setMsg("Error: Incorrect username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <img src={backgroundImage} alt="GUNCHU COACHING Logo" style={styles.logoImage} />
                <h2 style={styles.title}>Student Login</h2>

                {msg && (
                    <p style={{...styles.message, color: msg.startsWith("Error") ? '#e74c3c' : '#2ecc71' }}>
                        {msg}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <FaUser style={styles.inputIcon} />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            style={styles.inputField}
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <FaLock style={styles.inputIcon} />
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
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <div style={styles.linksContainer}>
                    <Link to="/register" style={styles.link}>Not registered yet? Sign Up</Link>
                    <Link to="/admin" style={styles.link}>
                        Admin Portal <FaArrowRight style={{ marginLeft: '5px' }} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- Professional Styles ---
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
    },
    inputField: {
        width: '100%',
        padding: '15px 15px 15px 45px',
        border: '1px solid #dfe6e9',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    submitButton: {
        width: '100%',
        padding: '15px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#3498db',
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
        justifyContent: 'space-between',
        alignItems: 'center',
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

export default Login;

import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "./AuthProvider";
import logo from '../image/1000421632.jpg';

const FaUser = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path></svg>);
const FaAt = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.9 0-208-93.1-208-208S141.1 48 256 48s208 93.1 208 208s-93.1 208-208 208zm51.2-132.8c-14.3-5.2-27.5-12.8-39.2-22.1c-1.3-1-3.3-1.1-4.7-.1c-14.7 9.8-31.5 15-49.3 15c-44.2 0-80-35.8-80-80s35.8-80 80-80c18.5 0 35.8 6.3 49.8 17.2c1.3 1 3.3.8 4.6-.3l23-20.2c2.1-1.8 2.5-4.9 1-7.4c-22-36.5-61.4-60.3-106.3-60.3c-70.7 0-128 57.3-128 128s57.3 128 128 128c50.5 0 94.8-29.4 115.8-71.2c1.3-2.6.1-5.8-2.3-6.8l-25.2-11.2z"></path></svg>);
const FaIdBadge = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M512 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h416c26.5 0 48 21.5 48 48zM192 160c0-17.7-14.3-32-32-32s-32 14.3-32 32 14.3 32 32 32 32-14.3 32-32zm-64 96c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm160 32c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm96-128c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z"></path></svg>);
const FaUsers = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.7 0-40.4 7.8-55.5 21.6l-6.3 5.8c-11.7 10.8-26.6 17.5-42.8 19.3-2.9 .3-5.8 .5-8.7 .5s-5.8-.2-8.7-.5c-16.2-1.8-31.1-8.5-42.8-19.3l-6.3-5.8C184.4 295.8 164.7 288 144 288h-8.3C51.1 288 0 339.1 0 416v32c0 17.7 14.3 32 32 32h576c17.7 0 32-14.3 32-32v-32c0-76.9-51.1-128-134.2-128z"></path></svg>);
const FaEnvelope = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M48 64C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm0 48h416v32L256 251.2 48 144v-32zm0 80l192 120 192-120v168H48V192z"></path></svg>);
const FaPhone = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"></path></svg>);
const FaLock = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>);
const FaVenusMars = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224 352c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80zm352-288c0-8.8-7.2-16-16-16h-48v-32c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v32h-48c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32h48c8.8 0 16-7.2 16-16v-32zm48.8-144.5l-42.4-42.4c-12.5-12.5-32.8-12.5-45.3 0L384 121.2V48c0-8.8-7.2-16-16-16h-48c-8.8 0-16 7.2-16 16v89.2L282.7 13.9c-12.5-12.5-32.8-12.5-45.3 0L195 56.4c-12.5 12.5-12.5 32.8 0 45.3L288.9 192H48c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h240.9L155 405.9c-12.5 12.5-12.5 32.8 0 45.3l42.4 42.4c12.5 12.5 32.8 12.5 45.3 0L384 352.4V464c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352.4l141.2 141.2c12.5 12.5 32.8 12.5 45.3 0l42.4-42.4c12.5-12.5 12.5-32.8 0-45.3L527.1 288H624c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16h-96.9l141.7-141.7c12.5-12.4 12.5-32.7 0-45.2z"></path></svg>);

function Register(){
    const { username } = useContext(AuthContext);
    const obj = {fullName: "", userName: "", contact: "", email: "", gender: "", batch: "", password: "", rollNo:"", repassword:""};
    const [formData, setFormData] = useState(obj);
    const [employee, setEmployee] = useState([]);
    const [registered, setRegistered] = useState(false);
    const [usernameExist, setUsernameExist] = useState(true);
    const [contactMsg, setContactMsg] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');

     let navigate = useNavigate();
    const routeLogin = () => {
        navigate(`/login`, {state: formData});
    }
    if(username !== '') routeLogin();
    function handleChange(e){
        e.preventDefault();
        resetValues()
        setFormData(prevData =>{
           return{
            ...prevData,
            [e.target.name]: e.target.value
           } 
        })
    }
    
    async function handleSubmit(e) {
        e.preventDefault();
        resetValues();
        if (formData.contact.match(/\d/g).length !== 10) {
            setContactMsg('Contact no. should be 10 digits long')
            return
        }
        if (validateEmail(formData.email) === false) {
            setEmailMsg('Email is not in proper format')
            return
        }
        try {
            const response = await fetch(`/api/user/${formData.userName}`);
            if (response.ok) {
                const body = await response.text();
                const data = body ? JSON.parse(body) : null;
                if (data && data.length !== 0) {
                    setUsernameMsg('Username already exists')
                } else {
                    setUsernameExist(false);
                }
            } else if (response.status === 204) {
                setUsernameExist(false);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            alert("Something went wrong with server")
        }

        if(usernameExist===false) finalSubmit();
    }

    function finalSubmit(){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
             fullName: formData.fullName.trim(), userName: formData.userName.trim(), email: formData.email.trim(),
            contact: formData.contact.trim(), gender: formData.gender, password: formData.password.trim(),
            batch: formData.batch.trim(), rollNo: formData.rollNo.trim()})
    };

          fetch('/api/adduser', requestOptions)
        .then(response => response.json())
        .then(data => {
            setEmployee(data);
            window.setTimeout(routeLogin, 5000);
        })
        .then(()=>setRegistered(true))
        .then(()=>setFormData(obj));
    }

    function validateEmail(email) {
        const validRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return !!email.match(validRegex);
      }

      function resetValues(){
          setUsernameMsg('');
          setEmailMsg('');
          setContactMsg('');
          setUsernameExist(true);
      }

    const SuccessModal = () => (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>Registration Successful!</h3>
                <p>Welcome, <strong>{employee.fullName}</strong>!</p>
                <p>Your account has been created. You can now log in with your credentials.</p>
                <p><strong>Username:</strong> {employee.userName}</p>
                <button style={styles.modalButton} onClick={() => navigate('/login', { state: formData })}>
                    Proceed to Login
                </button>
            </div>
        </div>
    );

    return (
        <div style={styles.container} >
            {registered && <SuccessModal />}
            <div style={styles.registerCard}>
                <img src={logo} alt="GUNCHU COACHING Logo" style={styles.logoImage} />
                <h2 style={styles.title}>Create Student Account</h2>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>
                        {renderInput('fullName', 'Full Name', FaUser, formData.fullName, handleChange)}
                        {renderInput('userName', 'Username', FaAt, formData.userName, handleChange, usernameMsg)}
                        {renderInput('rollNo', 'Roll Number', FaIdBadge, formData.rollNo, handleChange)}
                        {renderSelect('gender', 'Gender', FaVenusMars, formData.gender, handleChange, [{label: 'Select Gender', value: ''}, {label: 'Male', value: 'M'}, {label: 'Female', value: 'F'}])}
                        {renderSelect('batch', 'Batch', FaUsers, formData.batch, handleChange, [
                            {label: 'Select Batch', value: ''}, {label: 'Batch 1', value: 'Batch1'}, {label: 'Batch 2', value: 'Batch2'},
                            {label: 'Batch 3', value: 'Batch3'}, {label: 'Batch 4', value: 'Batch4'}, {label: 'Batch 5', value: 'Batch5'}, {label: 'Batch 6', value: 'Batch6'}
                        ])}
                        {renderInput('email', 'Email Address', FaEnvelope, formData.email, handleChange, emailMsg, 'email')}
                        {renderInput('contact', 'Contact Number', FaPhone, formData.contact, handleChange, contactMsg, 'tel')}
                        {renderInput('password', 'Password', FaLock, formData.password, handleChange, passwordMsg, 'password')}
                        {renderInput('repassword', 'Confirm Password', FaLock, formData.repassword, handleChange, '', 'password')}
                    </div>
                    <button type="submit" style={styles.submitButton}>Create Account</button>
                </form>

                <div style={styles.linksContainer}>
                    <Link to="/login" style={styles.link}>Already have an account? Login</Link>
                    <Link to="/admin" style={styles.link}>Admin Portal</Link>
                </div>
            </div>
        </div>
    );
}

// Helper function to render styled inputs, reducing repetition
const renderInput = (name, placeholder, Icon, value, onChange, errorMsg = '', type = 'text') => (
    <div style={styles.inputGroup}>
        <span style={styles.inputIcon}><Icon /></span>
        <input type={type} id={name} name={name} style={styles.inputField} value={value} onChange={onChange} placeholder={placeholder} required />
        {errorMsg && <small style={styles.errorMessage}>{errorMsg}</small>}
    </div>
);

const renderSelect = (name, placeholder, Icon, value, onChange, options) => (
    <div style={styles.inputGroup}>
        <span style={styles.inputIcon}><Icon /></span>
        <select id={name} name={name} style={styles.inputField} value={value} onChange={onChange} required>
            {options.map(opt => <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>)}
        </select>
    </div>
);

// --- Professional Styles ---
const styles = {
    logoImage: {
        height: '50px',
        width: 'auto',
        margin: '10px 0'
    },
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#eef2f5', fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif", padding: '2rem 0' },
    registerCard: { backgroundColor: '#ffffff', padding: '40px 50px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '800px', textAlign: 'center' },
    title: { marginBottom: '10px', color: '#2c3e50', fontWeight: '600', fontSize: '2rem' },
    subtitle: { marginBottom: '30px', color: '#7f8c8d' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' },
    inputGroup: { position: 'relative', marginBottom: '20px', textAlign: 'left' },
    inputIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#bdc3c7', fontSize: '1em' },
    inputField: { width: '100%', padding: '15px 15px 15px 45px', border: '1px solid #dfe6e9', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' },
    submitButton: { width: '100%', padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: '#27ae60', color: '#ffffff', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s', marginTop: '10px' },
    linksContainer: { marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    link: { color: '#3498db', textDecoration: 'none', fontSize: '0.9rem' },
    errorMessage: { color: '#e74c3c', fontSize: '0.8rem', marginTop: '5px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', padding: '30px 40px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', maxWidth: '400px' },
    modalTitle: { color: '#27ae60', marginBottom: '15px' },
    modalButton: { padding: '10px 25px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', fontSize: '1rem' }
};

export default Register;

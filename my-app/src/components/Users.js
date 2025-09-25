import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import axios from 'axios';
import { Spinner } from "react-bootstrap";
import { FiTrash2 } from 'react-icons/fi'; // Icon for delete button

function Users() {
    const { adminName } = useContext(AuthContext);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect to redirect if a non-admin user tries to access the page
    useEffect(() => {
        if (!adminName) {
            navigate('/');
        }
    }, [adminName, navigate]);

    // Effect to fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/users");
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Could not load users. Please ensure the backend is running.");
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if admin is logged in
        if (adminName) {
            fetchUsers();
        }
    }, [adminName]); // Dependency on adminName ensures we fetch only when logged in

    const handleDelete = async (userId) => {
        // Confirmation dialog before deleting
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await axios.delete(`/api/delete-user/${userId}`);
                // Filter out the deleted user from the state for an immediate UI update
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            } catch (err) {
                alert("Failed to delete user. Please try again.");
                console.error("Delete error:", err);
            }
        }
    };

    // Conditional rendering logic for the table body
    const renderTableBody = () => {
        if (isLoading) {
            return <tr><td colSpan="7" style={styles.centeredMessage}><Spinner animation="border" /> <span style={{marginLeft: '10px'}}>Loading Users...</span></td></tr>;
        }
        if (error) {
            return <tr><td colSpan="7" style={styles.errorMessage}>{error}</td></tr>;
        }
        if (users.length === 0) {
            return <tr><td colSpan="7" style={styles.centeredMessage}>No users found.</td></tr>;
        }
        return users.map((user, index) => (
            <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.gender}</td>
                <td>{user.rollNo}</td>
                <td>{user.batch}</td>
                <td>{user.contact}</td>
                <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                        <FiTrash2 />
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="container mt-4">
            <div className="panel" style={styles.panel}>
                <h3 style={styles.header}>Manage Students</h3>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Roll No.</th>
                            <th scope="col">Batch</th>
                            <th scope="col">Contact</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableBody()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- Styles ---
const styles = {
    panel: { padding: '2rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
    header: { textAlign: 'center', marginBottom: '2rem', color: '#333' },
    centeredMessage: { textAlign: 'center', padding: '2rem', color: '#666' },
    errorMessage: { textAlign: 'center', padding: '2rem', color: 'red' },
};

export default Users;

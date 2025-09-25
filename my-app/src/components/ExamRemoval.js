import React, { useEffect, useState, useCallback } from "react";
import axios from 'axios';

const FaTrash = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM56 464a48 48 0 0 0 48 48h240a48 48 0 0 0 48-48V128H56v336z"></path></svg>);
const FaExclamationTriangle = () => (<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-60.035-39.993-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>);

const ConfirmationModal = ({ show, onCancel, onConfirm, quizTitle }) => {
    if (!show) return null;
    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                    <span style={styles.modalIcon}><FaExclamationTriangle /></span>
                    <h4 style={styles.modalTitle}>Confirm Deletion</h4>
                </div>
                <p style={styles.modalText}>Are you sure you want to permanently delete: <strong>"{quizTitle}"</strong>?</p>
                <p style={styles.modalWarning}>This action cannot be undone.</p>
                <div style={styles.modalActions}>
                    <button onClick={onCancel} style={styles.cancelButton}>Cancel</button>
                    <button onClick={onConfirm} style={styles.confirmButton}>Yes, Delete</button>
                </div>
            </div>
        </div>
    );
};

function ExamRemoval() {
    const [exams, setExams] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [quizToDelete, setQuizToDelete] = useState(null);

    const fetchExams = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get("/api/admin-quizes");
            setExams(response.data);
        } catch (err) {
            setError("Could not load quizzes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    const handleDeleteClick = (index, id, title) => {
        setQuizToDelete({ index, id, title });
    };

    const confirmDelete = async () => {
        if (!quizToDelete) return;
        const { id, index } = quizToDelete;
        try {
            await axios.delete(`/api/quizzes/${id}`);
            const newExams = [...exams];
            newExams.splice(index, 1);
            setExams(newExams);
        } catch (err) {
            setError("Failed to remove the quiz.");
        } finally {
            setQuizToDelete(null);
        }
    };

    const cancelDelete = () => {
        setQuizToDelete(null);
    };

    return (
        <>
            <ConfirmationModal
                show={!!quizToDelete}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
                quizTitle={quizToDelete?.title}
            />
            <div style={styles.container}>
                <div style={styles.panel}>
                    <h3 style={styles.pageTitle}>Remove Quizzes</h3>
                    {error && <p style={styles.errorMessage}>{error}</p>}
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Quiz Title</th>
                                <th style={styles.th}>Questions</th>
                                <th style={styles.th}>Correct Mark</th>
                                <th style={styles.th}>Wrong Mark</th>
                                <th style={styles.th}>Duration</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
                            ) : exams.length > 0 ? (
                                exams.map((exam, index) => (
                                    <tr key={exam.id}>
                                        <td style={styles.td}>{index + 1}</td>
                                        <td style={styles.td}>{exam.title}</td>
                                        <td style={styles.td}>{exam.total}</td>
                                        <td style={styles.td}>{exam.correct}</td>
                                        <td style={styles.td}>{exam.wrong}</td>
                                        <td style={styles.td}>{exam.time} mins</td>
                                        <td style={styles.td}>
                                            <button style={styles.removeButton} onClick={() => handleDeleteClick(index, exam.id, exam.title)}>
                                                <FaTrash /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No quizzes found.</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

// Styles...
const styles = {
    container: { padding: '2rem', backgroundColor: '#f4f7f9', minHeight: '100vh', fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif" },
    panel: { backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' },
    pageTitle: { textAlign: 'center', color: '#2c3e50', marginBottom: '2rem', fontWeight: '600' },
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', },
    th: { backgroundColor: '#34495e', color: 'white', padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', borderBottom: '2px solid #2c3e50' },
    td: { padding: '12px 15px', borderBottom: '1px solid #ecf0f1', color: '#34495e' },
    removeButton: {
        backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'background-color 0.3s'
    },
    errorMessage: { color: '#d93025', backgroundColor: '#fbe9e7', border: '1px solid #f8a99e', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', padding: '25px', borderRadius: '10px', width: '90%', maxWidth: '450px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', textAlign: 'center' },
    modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' },
    modalIcon: { color: '#f39c12', fontSize: '1.5rem' },
    modalTitle: { margin: 0, color: '#2c3e50', fontSize: '1.2rem', fontWeight: 600 },
    modalText: { color: '#34495e', marginBottom: '10px' },
    modalWarning: { color: '#e74c3c', fontSize: '0.9rem', fontWeight: 'bold' },
    modalActions: { marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
    cancelButton: { padding: '10px 20px', border: '1px solid #bdc3c7', borderRadius: '5px', backgroundColor: 'transparent', cursor: 'pointer' },
    confirmButton: { padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#e74c3c', color: 'white', cursor: 'pointer' }
};

export default ExamRemoval;


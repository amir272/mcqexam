import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider"; // Assuming this is the correct path
import { Spinner } from "react-bootstrap";
import QuizQuestionsModal from "../utils/QuizQuestionsModal";

function AdminExams() {
    const { adminName } = useContext(AuthContext);
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // for question modal
    const [showModal, setShowModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);


    // Effect to redirect if a non-admin user tries to access the page
    useEffect(() => {
        if (!adminName) {
            navigate('/');
        }
    }, [adminName, navigate]);

    // Fetch all quizzes on component mount
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get("/api/admin-quizes");
                setExams(response.data);
            } catch (err) {
                console.error("Failed to fetch quizzes:", err);
                setError("Could not load quizzes. Please ensure the backend is running.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchExams();
    }, []); // Empty dependency array ensures this runs only once

    const handleStatusChange = async (id, newStatus) => {
        try {
            // Make API call to update the status
            const response = await axios.put(`/api/quizzes/${id}/status`, { status: newStatus });
            const updatedQuiz = response.data;

            // Update the state with the returned quiz data for a responsive UI
            setExams(prevExams =>
                prevExams.map(exam => (exam.id === id ? updatedQuiz : exam))
            );
        } catch (err) {
            alert("Failed to update quiz status. Please try again.");
            console.error(err);
        }
    };


    const handleViewQuestions = (quiz) => {
        setSelectedQuiz(quiz);
        setShowModal(true);
    };

    // Conditional rendering logic for the table body
    const renderTableBody = () => {
        if (isLoading) {
            return <tr><td colSpan="7" style={styles.centeredMessage}><Spinner animation="border" /> <span style={{marginLeft: '10px'}}>Loading Quizzes...</span></td></tr>;
        }
        if (error) {
            return <tr><td colSpan="7" style={styles.errorMessage}>{error}</td></tr>;
        }
        if (exams.length === 0) {
            return <tr><td colSpan="7" style={styles.centeredMessage}>No quizzes found.</td></tr>;
        }
        return exams.map((exam, index) => (
            <tr key={exam.id}>
                <td>{index + 1}</td>
                <td>{exam.title}</td>
                <td>{exam.total}</td>
                <td style={{color: 'green'}}>{exam.correct}</td>
                <td style={{color: 'red'}}>-{exam.wrong}</td>
                <td>
                    <span style={exam.status === 'enabled' ? styles.enabledStatus : styles.disabledStatus}>
                        {exam.status}
                    </span>
                </td>
                <td>
                    {exam.status === "enabled" ? (
                        <button className="btn btn-sm btn-danger" onClick={() => handleStatusChange(exam.id, 'disabled')}>Disable</button>
                    ) : (
                        <button className="btn btn-sm btn-success" onClick={() => handleStatusChange(exam.id, 'enabled')}>Enable</button>
                    )}
                </td>
                <td>
                    <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleViewQuestions(exam)}
                    >
                        View Questions
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="container mt-4">
            <div className="panel" style={styles.panel}>
                <h3 style={styles.header}>Manage Exams</h3>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Quiz Title</th>
                            <th scope="col">Questions</th>
                            <th scope="col">Correct</th>
                            <th scope="col">Wrong</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                            <th scope="col">View</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableBody()}
                        </tbody>
                    </table>
                    <QuizQuestionsModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        quiz={selectedQuiz}
                    />
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
    enabledStatus: {
        color: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        padding: '4px 12px',
        borderRadius: '12px',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    disabledStatus: {
        color: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        padding: '4px 12px',
        borderRadius: '12px',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    }
};

export default AdminExams;

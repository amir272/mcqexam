import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { Spinner } from "react-bootstrap";
import axios from 'axios';

function ExamList() {
    const { username } = useContext(AuthContext);
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [error, setError] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Effect to redirect if not logged in
    useEffect(() => {
        if (username === "") {
            navigate('/');
        }
    }, [username, navigate]);

    // Effect to fetch available exams on component mount
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get("/api/enabled-quizzes");
                setExams(response.data);
            } catch (err) {
                setError("Failed to load exams. Please ensure the backend server is running and try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (username) {
            fetchExams();
        }
    }, [username]); // Dependency on username ensures we only fetch when logged in

    const handleStartExam = async (quizId) => {
        setIsRedirecting(true);
        try {
            const response = await axios.get(`/api/quiz/${quizId}`);
            // Navigate to the exam page with the full quiz data
            navigate(`/user/exam`, { state: response.data });
        } catch (err) {
            console.error(err);
            alert("Failed to start the exam. Please try again.");
            setIsRedirecting(false);
        }
    };

    // Conditional rendering logic for the table body
    const renderTableBody = () => {
        if (isLoading) {
            return <tr><td colSpan="7" style={styles.centeredMessage}><Spinner animation="border" /> <span style={{marginLeft: '10px'}}>Loading Exams...</span></td></tr>;
        }
        if (error) {
            return <tr><td colSpan="7" style={styles.errorMessage}>{error}</td></tr>;
        }
        if (exams.length === 0) {
            return <tr><td colSpan="7" style={styles.centeredMessage}>No exams are available at the moment.</td></tr>;
        }
        return exams.map((exam, index) => (
            <tr key={exam.id}>
                <td>{index + 1}</td>
                <td>{exam.title}</td>
                <td>{exam.total}</td>
                <td style={{color: 'green'}}>{exam.correct}</td>
                <td style={{color: 'red'}}>-{exam.wrong}</td>
                <td>{exam.time} mins</td>
                <td>
                    <button className="btn btn-success" onClick={() => handleStartExam(exam.id)}>
                        Start Exam
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <>
            {isRedirecting && (
                <div style={styles.modalBackdrop}>
                    <div style={styles.modalContent}>
                        <h5>Redirecting to Your Exam</h5>
                        <div style={styles.modalBody}>
                            <Spinner animation="border" />
                            <p className="mt-3">Please wait...</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="container mt-4">
                <div className="panel" style={styles.panel}>
                    <h3 style={styles.header}>Available Exams</h3>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Quiz Title</th>
                                <th scope="col">Questions</th>
                                <th scope="col">Correct</th>
                                <th scope="col">Wrong</th>
                                <th scope="col">Duration</th>
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
        </>
    );
}

// --- Styles ---
const styles = {
    panel: { padding: '2rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
    header: { textAlign: 'center', marginBottom: '2rem', color: '#333' },
    centeredMessage: { textAlign: 'center', padding: '2rem', color: '#666' },
    errorMessage: { textAlign: 'center', padding: '2rem', color: 'red' },
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 },
    modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' },
    modalBody: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '1.5rem 0 0' }
};

export default ExamList;


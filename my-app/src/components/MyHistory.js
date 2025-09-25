import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { Spinner } from "react-bootstrap";

function MyHistory() { // Renamed component to match file name
    const { username } = useContext(AuthContext);
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect to redirect if not logged in
    useEffect(() => {
        if (!username) {
            navigate('/');
        }
    }, [username, navigate]);

    // Effect to fetch user's history
    useEffect(() => {
        // Do not fetch if username is not available yet
        if (!username) return;

        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/history-user/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to retrieve your exam history.');
                }
                const data = await response.json();
                setHistory(data);
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [username]); // Dependency on username ensures this runs when username is available

    const renderTableBody = () => {
        if (isLoading) {
            return <tr><td colSpan="7" style={styles.centeredMessage}><Spinner animation="border" /> <span style={{marginLeft: '10px'}}>Loading History...</span></td></tr>;
        }
        if (error) {
            return <tr><td colSpan="7" style={styles.errorMessage}>{error}</td></tr>;
        }
        if (history.length === 0) {
            return <tr><td colSpan="7" style={styles.centeredMessage}>You have not taken any exams yet.</td></tr>;
        }
        return history.map((exam, index) => (
            <tr key={exam.id || index}>
                <td>{index + 1}</td>
                <td>{exam.quizId}</td>
                <td>{exam.score}</td>
                <td style={{color: 'green'}}>{exam.correct}</td>
                <td style={{color: 'red'}}>{exam.wrong}</td>
                <td>{exam.unanswered}</td>
                <td>{exam.shift}</td>
            </tr>
        ));
    };

    return (
        <div className="container mt-4">
            <div className="panel" style={styles.panel}>
                <h3 style={styles.header}>My Exam History</h3>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Quiz Title</th>
                            <th scope="col">Score</th>
                            <th scope="col">Correct</th>
                            <th scope="col">Wrong</th>
                            <th scope="col">Unanswered</th>
                            <th scope="col">Shift</th>
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

export default MyHistory; // Renamed export to match component name

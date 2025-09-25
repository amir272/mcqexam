import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { FiSearch, FiPrinter } from 'react-icons/fi'; // Using react-icons for a cleaner look

function AllHistory() {
    const { adminName } = useContext(AuthContext);
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [shift, setShift] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false); // To track if a search has been performed

    // Effect to redirect if not logged in as admin
    useEffect(() => {
        if (!adminName) {
            navigate('/');
        }
    }, [adminName, navigate]);

    // Async function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shift.trim()) {
            setError("Please enter a shift to search.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSearched(true); // Mark that a search has been attempted

        try {
            const response = await fetch(`/api/history-shift/${shift}`);
            if (!response.ok) {
                throw new Error('No data found for this shift.');
            }
            const data = await response.json();
            // Sort data by score in descending order for ranking
            const sortedData = data.sort((a, b) => b.score - a.score);
            setHistory(sortedData);
        } catch (err) {
            setError(err.message);
            setHistory([]); // Clear previous results on error
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle printing the results table
    const handlePrint = () => {
        const printContent = document.getElementById("results-table-section");
        const windowUrl = 'about:blank';
        const uniqueName = new Date();
        const windowName = 'Print' + uniqueName.getTime();
        const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

        printWindow.document.write('<html><head><title>Print Results</title>');
        // Optional: Add bootstrap for better print styles
        printWindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    // Render logic for the table body
    const renderTableBody = () => {
        if (isLoading) {
            return <tr><td colSpan="8" style={styles.centeredMessage}>Searching...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan="8" style={styles.errorMessage}>{error}</td></tr>;
        }
        if (history.length === 0 && searched) {
            return <tr><td colSpan="8" style={styles.centeredMessage}>No history found for the shift: "{shift}"</td></tr>;
        }
        if (history.length > 0) {
            return history.map((exam, index) => (
                <tr key={exam.id || index}>
                    <td>{index + 1}</td>
                    <td>{exam.quizId}</td>
                    <td>{exam.score}</td>
                    <td>{exam.correct}</td>
                    <td>{exam.wrong}</td>
                    <td>{exam.unanswered}</td>
                    <td>{exam.shift}</td>
                    <td>{exam.userName}</td>
                </tr>
            ));
        }
        return <tr><td colSpan="8" style={styles.centeredMessage}>Enter a shift and click Search to see results.</td></tr>;
    };

    return (
        <div className="container mt-4">
            <div className="panel" style={styles.panel}>
                <h3 style={styles.header}>Exam History by Shift</h3>
                <form onSubmit={handleSubmit} style={styles.searchForm}>
                    <div style={styles.searchInputWrapper}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            onChange={(event) => setShift(event.target.value)}
                            className="form-control form-control-lg"
                            type="search"
                            placeholder="Enter shift to get report"
                            style={styles.searchInput}
                        />
                    </div>
                    <button className="btn btn-lg btn-success" type="submit" disabled={isLoading}>
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                <div id="results-table-section">
                    <table className="table table-striped table-hover mt-4">
                        <thead className="thead-dark">
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col">Quiz Title</th>
                            <th scope="col">Score</th>
                            <th scope="col">Correct</th>
                            <th scope="col">Wrong</th>
                            <th scope="col">Unanswered</th>
                            <th scope="col">Shift</th>
                            <th scope="col">User</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableBody()}
                        </tbody>
                    </table>
                </div>
                {history.length > 0 && (
                    <div style={styles.printButtonContainer}>
                        <button onClick={handlePrint} className="btn btn-info">
                            <FiPrinter style={{ marginRight: '8px' }} />
                            Print Results
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Styles ---
const styles = {
    panel: { padding: '2rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
    header: { textAlign: 'center', marginBottom: '2rem', color: '#333' },
    searchForm: { display: 'flex', gap: '1rem', alignItems: 'center' },
    searchInputWrapper: { flex: 1, position: 'relative' },
    searchIcon: { position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)', color: '#aaa' },
    searchInput: { paddingLeft: '40px', borderRadius: '0.5rem' },
    centeredMessage: { textAlign: 'center', padding: '2rem', color: '#666' },
    errorMessage: { textAlign: 'center', padding: '2rem', color: 'red' },
    printButtonContainer: { textAlign: 'center', marginTop: '1.5rem' }
};

export default AllHistory;

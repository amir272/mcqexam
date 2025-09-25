import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import axios from 'axios';
import { Spinner } from "react-bootstrap";
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi'; // Icons for buttons

function AddSections() {
    const navigate = useNavigate();
    const location = useLocation();
    const { adminName } = useContext(AuthContext);

    const [quizId, setQuizId] = useState(null);
    const [sections, setSections] = useState([{ title: "", start: "", end: "" }]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Effect to check for admin login and valid quizId from location state
    useEffect(() => {
        if (!adminName) {
            navigate('/');
            return;
        }
        if (location.state) {
            setQuizId(location.state);
        } else {
            // If no quizId is passed, redirect to the management page
            navigate('/manage');
        }
    }, [adminName, location.state, navigate]);

    const handleSectionInputChange = (e, index) => {
        const { name, value } = e.target;
        const newSections = [...sections];
        newSections[index][name] = value;
        setSections(newSections);
    };

    const handleAddSection = () => {
        setSections([...sections, { title: "", start: "", end: "" }]);
    };

    const handleRemoveSection = (index) => {
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (sections.some(s => !s.title || !s.start || !s.end)) {
            setError("All fields for each section are required.");
            return;
        }

        setIsLoading(true);
        try {
            const payload = sections.map(s => ({ ...s, quizId }));
            await axios.post(`/api/quizzes/${quizId}/sections`, payload);
            navigate('/manage'); // Navigate back to the management page on success
        } catch (err) {
            setError("Failed to save sections. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!quizId) {
        // Render a loading state or null while we verify the quizId
        return <div style={styles.centeredMessage}><Spinner animation="border" /></div>;
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="panel" style={styles.panel}>
                        <h3 style={styles.header}>Add Sections to Quiz</h3>
                        <form onSubmit={handleSubmit}>
                            {sections.map((section, index) => (
                                <div key={index} style={styles.sectionBox}>
                                    <h5>Section {index + 1}</h5>
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control"
                                            placeholder="e.g., General Knowledge"
                                            value={section.title}
                                            onChange={(e) => handleSectionInputChange(e, index)}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <label>Start Question No.</label>
                                            <input
                                                type="number"
                                                name="start"
                                                className="form-control"
                                                placeholder="e.g., 1"
                                                value={section.start}
                                                onChange={(e) => handleSectionInputChange(e, index)}
                                            />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label>End Question No.</label>
                                            <input
                                                type="number"
                                                name="end"
                                                className="form-control"
                                                placeholder="e.g., 10"
                                                value={section.end}
                                                onChange={(e) => handleSectionInputChange(e, index)}
                                            />
                                        </div>
                                    </div>
                                    {sections.length > 1 && (
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveSection(index)}>
                                            <FiTrash2 /> Remove Section
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button type="button" className="btn btn-secondary mt-3" onClick={handleAddSection}>
                                <FiPlusCircle /> Add Another Section
                            </button>

                            <hr style={{ margin: '2rem 0' }} />

                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="text-center">
                                <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                                    {isLoading ? <><Spinner as="span" animation="border" size="sm" /> Saving...</> : 'Submit Sections'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Styles ---
const styles = {
    panel: { padding: '2rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
    header: { textAlign: 'center', marginBottom: '2rem', color: '#333' },
    sectionBox: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#f9f9f9' },
    centeredMessage: { textAlign: 'center', padding: '2rem', color: '#666' }
};

export default AddSections;

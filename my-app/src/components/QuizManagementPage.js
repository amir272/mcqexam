import React, {useState, useCallback, useEffect, useRef, useContext} from "react";
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {AuthContext} from "./AuthProvider";
import {RichContentRenderer} from "../utils/RichContentRenderer";

// --- Main Page Component ---
function QuizManagementPage() {const { adminName} = useContext(AuthContext);
    let navigate = useNavigate();
    if(adminName === "")  navigate('/');

    useEffect(() => {
        const katexStylesheetId = 'katex-stylesheet';
        if (!document.getElementById(katexStylesheetId)) {
            const link = document.createElement('link');
            link.id = katexStylesheetId;
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
            document.head.appendChild(link);
        }
    }, []);

    // State Management
    const [quizData, setQuizData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // New state for quiz metadata
    const [quizTitle, setQuizTitle] = useState('');
    const [quizTime, setQuizTime] = useState(60);
    const [quizCorrect, setQuizCorrect] = useState(1);
    const [quizWrong, setQuizWrong] = useState(0);
    const [quizUnanswered, setQuizUnanswered] = useState(0);
    const [quizStatus, setQuizStatus] = useState('disabled');

    // --- File Upload Logic ---
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        setFileName(file.name);
        setQuizData(null);
        setQuizTitle(file.name.replace(/\.docx$/, ''));

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8092/api/extract-quiz', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (response.data.error) {
                setError(response.data.error);
            } else {
                console.log(response.data);
                setQuizData(response.data);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setError('Upload failed. Check backend connection and file format.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- Save Quiz Logic ---
    const handleSaveQuiz = async () => {
        if (!quizTitle || !quizTime) {
            setError("Please provide a title and duration before saving.");
            return;
        }
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        const payload = {
            title: quizTitle,
            time: quizTime,
            correct: quizCorrect,
            wrong: quizWrong,
            unanswered: quizUnanswered,
            status: quizStatus,
            questions: quizData.questions
        };

        try {
            const response = await axios.post('http://localhost:8092/api/save-quiz', payload);
            const savedQuiz = response.data; // The backend now returns the saved quiz with its ID
            setSuccessMessage(`Quiz "${quizTitle}" was saved successfully!`);

            // Clear the form and redirect
            setQuizData(null);
            setFileName('');
            setQuizTitle('');

            // Redirect to AddSections page, passing the quizId
            navigate('/manage/add-sections', { state: savedQuiz.quizId });

        } catch (err) {
            console.error("Failed to save quiz:", err);
            setError("Failed to save the quiz. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartQuiz = (quizId) => {
        alert(`Starting quiz with ID: ${quizId}. (Navigation not implemented yet)`);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }, multiple: false });

    return (
        <div className="container">
            <div className="panel" style={{padding: '2rem'}}>
                <h3 style={{textAlign: 'center', marginBottom: '1rem'}}>Create New Quiz</h3>
                <div {...getRootProps()} style={{...styles.dropzone, ...(isDragActive ? styles.dropzoneActive : {})}}>
                    <input {...getInputProps()} />
                    <p>{isDragActive ? "Drop the file here ..." : "Drag 'n' drop a .docx quiz file, or click to select"}</p>
                </div>

                {fileName && <p style={{marginTop: '1rem'}}><strong>File:</strong> {fileName}</p>}
                {isLoading && <p style={styles.loadingMessage}>Processing...</p>}
                {error && <p style={styles.errorMessage}>{error}</p>}
                {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

                {quizData && (
                    <div style={styles.reviewSection}>
                        <h4 style={{textAlign: 'center', color: '#007bff'}}>Quiz Preview & Details</h4>

                        <div style={styles.formGrid}>
                            <input type="text" placeholder="Quiz Title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} style={{...styles.inputField, gridColumn: 'span 2'}}/>
                            <input type="number" placeholder="Duration (mins)" value={quizTime} onChange={(e) => setQuizTime(parseInt(e.target.value, 10))} style={styles.inputField}/>
                            <input type="number" placeholder="Correct Score" value={quizCorrect} onChange={(e) => setQuizCorrect(parseFloat(e.target.value))} style={styles.inputField}/>
                            <input type="number" placeholder="Wrong Score" value={quizWrong} onChange={(e) => setQuizWrong(parseFloat(e.target.value))} style={styles.inputField}/>
                            <input type="number" placeholder="Unanswered Score" value={quizUnanswered} onChange={(e) => setQuizUnanswered(parseFloat(e.target.value))} style={styles.inputField}/>
                            <select value={quizStatus} onChange={(e) => setQuizStatus(e.target.value)} style={styles.inputField}>
                                <option value="enabled">ENABLED</option>
                                <option value="disabled">DISABLED</option>
                            </select>
                            <button onClick={handleSaveQuiz} disabled={isLoading} style={{...styles.saveButton, gridColumn: 'span 2'}}>
                                {isLoading ? 'Saving...' : 'Save & Add Sections'}
                            </button>
                        </div>

                        {quizData.questions.map((question) => (
                            <div key={question.questionNumber} style={styles.questionContainer}>
                                <h5 style={styles.questionTitle}>Question {question.questionNumber}</h5>
                                <div style={styles.questionContent}><RichContentRenderer content={question.questionContent} /></div>
                                <div style={styles.optionsList}>
                                    {question.options.map((option, oIndex) => {
                                        const isCorrect = oIndex === question.correctAnswerIndex;
                                        return (
                                            <div key={oIndex} style={{ ...styles.option, ...(isCorrect ? styles.correctOption : {}) }}>
                                                <strong>{String.fromCharCode(65 + oIndex)}. </strong>
                                                <RichContentRenderer content={option} />
                                                {isCorrect && <span style={styles.correctBadge}>✔ Correct</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Inline Styles ---
const styles = {
    dropzone: { border: '2px dashed #ccc', borderRadius: '8px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', transition: 'border .24s ease-in-out, background-color .24s ease-in-out', backgroundColor: '#fafafa' },
    dropzoneActive: { borderColor: '#007bff', backgroundColor: '#f0f8ff' },
    errorMessage: { color: '#d93025', backgroundColor: '#fbe9e7', border: '1px solid #f8a99e', padding: '15px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' },
    successMessage: { color: '#2a6b2e', backgroundColor: '#e7f4e8', border: '1px solid #a0d8a4', padding: '15px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' },
    loadingMessage: { textAlign: 'center', color: '#007bff', fontSize: '1.1rem', marginTop: '20px' },
    questionContainer: { marginBottom: '2rem', padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    questionTitle: { borderBottom: '2px solid #007bff', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#333' },
    questionContent: { marginBottom: '1rem', lineHeight: '1.6' },
    optionsList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    option: { padding: '0.75rem', border: '1px solid #eee', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
    correctOption: { backgroundColor: '#e7f4e8', borderColor: '#a0d8a4', color: '#2a6b2e', fontWeight: 'bold' },
    correctBadge: { marginLeft: 'auto', backgroundColor: '#28a745', color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '0.8em' },
    image: { maxWidth: '100%', height: 'auto', margin: '1rem 0', borderRadius: '8px', display: 'block' },
    table: { width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', boxShadow: '0 0 5px rgba(0,0,0,0.05)' },
    tableCell: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', verticalAlign: 'top' },
    sectionTitle: { borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
    savedQuizzesContainer: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' },
    quizList: { listStyle: 'none', padding: 0 },
    quizListItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' },
    startButton: { padding: '5px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    reviewSection: { marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '2rem' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', alignItems: 'center' },
    inputField: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
    saveButton: { padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }
};

export default QuizManagementPage;

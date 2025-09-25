import React, {useContext, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthProvider";
import LoadingModal from "../utils/LoadingModal";
import katex from 'katex';
import axios from "axios";
import {RichContentRenderer} from "../utils/RichContentRenderer";

// --- Helper Component for Shift Input Modal ---
function ShiftModal({ onSubmit }) {
    const [shiftInput, setShiftInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (shiftInput.trim()) {
            onSubmit(shiftInput.trim());
        } else {
            alert("Please enter a shift to start the exam.");
        }
    };

    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent}>
                <h5>Enter Exam Shift</h5>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        value={shiftInput}
                        onChange={(e) => setShiftInput(e.target.value)}
                        placeholder="e.g., Morning Shift 1"
                        style={styles.inputField}
                        autoFocus
                    />
                    <button type="submit" className="btn btn-success">Start Exam</button>
                </form>
            </div>
        </div>
    );
}

// --- Main Exam Page Component ---
function ExamPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = useContext(AuthContext);

    // --- State Management ---
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [time, setTime] = useState({ minutes: 0, seconds: 0 });
    const [shift, setShift] = useState('');
    const [showShiftModal, setShowShiftModal] = useState(true);

    // --- Simplified Data Sanitization ---
    // This function now only cleans up options by removing empty parts,
    // avoiding the previous issue of incorrectly merging the first option with the question.
    const sanitizeQuizData = (data) => {
        if (!data || !data.questions) {
            return data;
        }

        const sanitizedQuestions = data.questions.map(q => {
            const newQuestion = { ...q };

            // Clean up options - remove empty or whitespace-only text elements at the start
            if (newQuestion.options) {
                newQuestion.options = newQuestion.options.map(option => {
                    if (!option) return option;

                    // Remove leading whitespace-only elements
                    while (option.length > 0) {
                        const firstEl = option[0];
                        if (firstEl && firstEl.type === 'text') {
                            const trimmed = firstEl.content.trim();
                            if (trimmed === '') {
                                option.shift(); // Remove empty element
                            } else {
                                // Update the first element with trimmed content
                                option[0] = { ...firstEl, content: trimmed };
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    return option;
                }).filter(option => option && option.length > 0); // Remove completely empty options
            }

            return newQuestion;
        });

        return { ...data, questions: sanitizedQuestions };
    };


    // --- Initial Setup from Location State ---
    useEffect(() => {
        if (location.state) {
            const data = location.state;
            console.log("Original data:", data);
            const sanitizedData = sanitizeQuizData(data);
            console.log("Sanitized data:", sanitizedData);
            setQuizData(sanitizedData);
            setTime({ minutes: sanitizedData.time || 0, seconds: 0 });
            // Initialize answers array with null for each question
            if (sanitizedData && sanitizedData.questions) {
                setAnswers(new Array(sanitizedData.questions.length).fill(null));
            }
        } else {
            // If no data is passed, redirect to the exam list
            navigate('/user/exams');
        }
    }, [location.state, navigate]);

    const answersRef = useRef(answers);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);
    // --- Timer Logic ---
    useEffect(() => {
        // Don't start timer until data is loaded AND shift modal is closed
        if (!quizData || showShiftModal) return;

        const timer = setInterval(() => {
            setTime(prevTime => {
                if (prevTime.seconds > 0) {
                    return { ...prevTime, seconds: prevTime.seconds - 1 };
                } else if (prevTime.minutes > 0) {
                    return { minutes: prevTime.minutes - 1, seconds: 59 };
                } else {
                    clearInterval(timer);
                    countAndSubmit(answersRef.current); // Use latest answers
                    return prevTime;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizData, showShiftModal]);

    // --- Event Handlers ---
    const handleShiftSubmit = (submittedShift) => {
        setShift(submittedShift);
        setShowShiftModal(false);
    };

    const handleOptionSelect = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleResetClick = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = null;
        setAnswers(newAnswers);
    };

    const countAndSubmit = (answersToUse = answers) => {
        if (!quizData) return;

        let correctCount = 0;
        let wrongCount = 0;

        answersToUse.forEach((selectedOptionIndex, questionIndex) => {
            if (selectedOptionIndex !== null) {
                if (selectedOptionIndex === quizData.questions[questionIndex].correctAnswerIndex) {
                    correctCount++;
                } else {
                    wrongCount++;
                }
            }
        });

        const unansweredCount = quizData.total - correctCount - wrongCount;
        const totalScore = (correctCount * quizData.correct) - (wrongCount * quizData.wrong);

        handleSubmit(correctCount, wrongCount, unansweredCount, totalScore);
    };


    async function handleSubmit(correct, wrong, unanswered, score) {
        setLoading(true);
        const payload = {
            userName: username,
            correct,
            wrong,
            unanswered,
            score,
            quizId: quizData.quizId,
            date: new Date().toISOString(),
            shift: shift
        };
        await axios.post('/api/add-history', payload);
        setTimeout(() => navigate("/user"), 3000);
    }

    // --- Rendering Logic ---
    if (!quizData) {
        return <div>Loading Exam...</div>;
    }

    const currentQuestionData = quizData.questions[currentQuestion];
    const answeredQuestionsCount = answers.filter(a => a !== null).length;

    // Additional check to ensure we have valid options
    const hasValidOptions = currentQuestionData.options &&
        currentQuestionData.options.length > 0 &&
        currentQuestionData.options.some(opt => opt && opt.length > 0);

    return (
        <>
            {showShiftModal && <ShiftModal onSubmit={handleShiftSubmit} />}
            {loading && <LoadingModal message="Submitting your exam..." />}

            {!showShiftModal && (
                <div className="container-fluid mt-3">
                    <div className="row">
                        {/* Left Column: Question and Options */}
                        <div className="col-md-8">
                            <div className="panel" style={styles.examPanel}>
                                <div className="card-header d-flex justify-content-between">
                                    <h5>Question {currentQuestion + 1} of {quizData.total}</h5>
                                    <div><strong>Quiz:</strong> {quizData.title}</div>
                                </div>
                                <div className="card-body" style={styles.scrollableCardBody}>
                                    <div style={styles.questionContent}>
                                        <RichContentRenderer content={currentQuestionData.questionContent} />
                                    </div>
                                    <div style={styles.optionsList}>
                                        {hasValidOptions ? (
                                            currentQuestionData.options.map((option, index) => {
                                                const isSelected = answers[currentQuestion] === index;
                                                return (
                                                    <div
                                                        key={index}
                                                        style={{ ...styles.option, ...(isSelected ? styles.selectedOption : {}) }}
                                                        onClick={() => handleOptionSelect(index)}
                                                    >
                                                        <strong>{String.fromCharCode(65 + index)}.</strong>
                                                        <RichContentRenderer content={option} />
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="alert alert-warning">
                                                No valid options available for this question.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-between fixed-bottom">
                                    <button className="btn btn-secondary" style={styles.marginLeft} onClick={handleResetClick}>Clear Answer</button>
                                    <div>
                                        <button className="btn btn-primary me-2" onClick={() => setCurrentQuestion(q => q - 1)} disabled={currentQuestion === 0}>Previous</button>
                                        <button className="btn btn-primary" onClick={() => setCurrentQuestion(q => q + 1)} disabled={currentQuestion === quizData.questions.length - 1}>Next</button>
                                    </div>
                                    <button style={styles.marginRight} className="btn btn-success" onClick={() => countAndSubmit(answersRef.current)}>Submit Exam</button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Navigation and Timer */}
                        <div className="col-md-4">
                            <div className="panel" style={styles.sidePanel}>
                                <div className="card-body">
                                    <div style={styles.timer}>
                                        Time Remaining: <span>{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}</span>
                                    </div>
                                    <hr/>
                                    <div>
                                        <h6>Sections</h6>
                                        {quizData.sections.map((section, index) => (
                                            <button key={index} onClick={() => setCurrentQuestion(section.start - 1)} className="btn btn-sm btn-info me-1 mb-1">
                                                {section.title}
                                            </button>
                                        ))}
                                    </div>
                                    <hr/>
                                    <h6>Question Navigator</h6>
                                    <div style={styles.questionGrid}>
                                        {quizData.questions.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`btn ${index === currentQuestion ? 'btn-primary' : answers[index] !== null ? 'btn-success' : 'btn-outline-secondary'}`}
                                                style={styles.questionBox}
                                                onClick={() => setCurrentQuestion(index)}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-3">
                                        <strong>Answered:</strong> {answeredQuestionsCount} / {quizData.total}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// --- Styles ---
const styles = {
    marginLeft: {marginLeft: '180px'},
    marginRight: {marginRight: '180px'},
    image: { maxWidth: '100%', height: 'auto', margin: '1rem 0', borderRadius: '8px', display: 'block' },
    table: { width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', boxShadow: '0 0 5px rgba(0,0,0,0.05)' },
    tableCell: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', verticalAlign: 'top' },
    questionContent: { marginBottom: '1.5rem', lineHeight: '1.7', fontSize: '1.0rem' },
    optionsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    option: {
        padding: '0.75rem 1.25rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, border-color 0.2s',
    },
    selectedOption: {
        backgroundColor: '#cfe4ce',
        borderColor: '#007bff',
        fontWeight: 'bold',
        color: '#0056b3',
    },
    examPanel: {
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 85px)', // Adjust 85px as needed for your header/margin height
    },
    scrollableCardBody: {
        flex: '1 1 auto',
        overflowY: 'auto',
    },
    sidePanel: {
        height: 'calc(100vh - 85px)', // Match the height of the exam panel
        overflowY: 'auto', // Allow this panel to scroll internally
    },
    timer: { fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: '#d93025', marginBottom: '1rem' },
    questionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))', gap: '5px', maxHeight: '400px', overflowY: 'auto' },
    questionBox: { width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 },
    modalContent: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center', minWidth: '300px' },
    inputField: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }
};

export default ExamPage;


import React from "react";
import { Modal, Button } from "react-bootstrap";
import { RichContentRenderer } from "./RichContentRenderer";

function QuizQuestionsModal({ show, onHide, quiz }) {
    if (!quiz) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Questions for: {quiz.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {quiz.questions && quiz.questions.length > 0 ? (
                    quiz.questions.map((q, idx) => (
                        <div key={idx} style={{ marginBottom: "2rem" }}>
                            <h5>
                                Q{idx + 1}: <RichContentRenderer content={q.questionContent} />
                            </h5>
                            <div style={{ marginLeft: "1.5rem" }}>
                                {q.options.map((opt, oIdx) => (
                                    <div
                                        key={oIdx}
                                        style={{
                                            padding: "0.5rem",
                                            border: "1px solid #eee",
                                            borderRadius: "6px",
                                            marginBottom: "0.5rem",
                                            background: oIdx === q.correctAnswerIndex ? "#e7f4e8" : "#fff",
                                        }}
                                    >
                                        <RichContentRenderer content={opt} />
                                        {oIdx === q.correctAnswerIndex && (
                                            <span style={{ color: "#28a745", fontWeight: "lighter", marginLeft: "0.5rem" }}>
                                                ✓ Correct
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No questions available for this quiz.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default QuizQuestionsModal;
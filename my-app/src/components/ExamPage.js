import React, { useState } from 'react';

const questionData = [  {
    question: 'What is your favorite color?',
    options: [
        { answer: 'Red' },
        { answer: 'Blue' },
        { answer: 'Green' },
        { answer: 'Yellow' },
    ],
    answerKey: 1,
},
    {
        question: 'What is your favorite food?',
        options: [
            { answer: 'Pizza' },
            { answer: 'Burger' },
            { answer: 'Sushi' },
            { answer: 'Tacos' },
        ],
        answerKey: 2,
    },
    {
        question: 'What is your favorite hobby?',
        options: [
            { answer: 'Reading' },
            { answer: 'Gardening' },
            { answer: 'Playing video games' },
            { answer: 'Sports' },
        ],
        answerKey: 3,
    },
];

function ExamPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);

    const handleOptionSelect = (e) => {
        const { value: answer } = e.target;

        const newAnswers = [...answers];
        const currentAnswerIndex = newAnswers.findIndex(
            (answer) => answer.question === currentQuestion
        );

        if (currentAnswerIndex >= 0) {
            newAnswers[currentAnswerIndex] = {
                question: currentQuestion,
                answer,
            };
        } else {
            newAnswers.push({
                question: currentQuestion,
                answer,
            });
        }

        setAnswers(newAnswers);
    };

    const handleResetClick = () => {
        const newAnswers = [...answers];
        const currentAnswerIndex = newAnswers.findIndex(
            (answer) => answer.question === currentQuestion
        );

        if (currentAnswerIndex >= 0) {
            newAnswers.splice(currentAnswerIndex, 1);
            setAnswers(newAnswers);
        }
    };

    const handlePreviousClick = () => {
        setCurrentQuestion((prevQuestion) => prevQuestion - 1);
    };

    const handleNextClick = () => {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    };

    function countCorrectAnswers() {
        let correctCount = 0;
        let wrongCount = 0;

        answers.forEach((answer, index) => {
            const answerKey = questionData[index].answerKey;
            const correctAnswer = questionData[index].options[answerKey].answer
            const userAnswer = answer && answer.answer;

            if (userAnswer === correctAnswer) {
                correctCount++;
            } else if (userAnswer !== undefined) {
                wrongCount++;
            }
        });

        const unansweredCount = questionData.length - correctCount - wrongCount;

        console.log({ correctCount, wrongCount, unansweredCount });
    }


    const currentQuestionData = questionData[currentQuestion];

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card my-12">
                        <div className="card-body">
                            <h2 className="card-title">{currentQuestionData.question}</h2>
                            <form>
                                {currentQuestionData.options.map((option, index) => (
                                    <div key={index} className="form-check my-2 funkyradio" style={{width: "100%"}}>
                                        <input
                                            className="form-check-input "
                                            type="radio"
                                            name="option"
                                            id={`option-${index}`}
                                            value={option.answer}
                                            checked={
                                                answers[currentQuestion] &&
                                                answers[currentQuestion].question === currentQuestion &&
                                                answers[currentQuestion].answer === option.answer
                                            }
                                            onChange={handleOptionSelect}
                                        />
                                        <label className="form-check-label" htmlFor={`option-${index}`}>
                                            {option.answer}
                                        </label>
                                    </div>
                                ))}
                            </form>
                            <div  style={{ display: 'flex' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleResetClick}
                                    disabled={!answers[currentQuestion]}
                                >
                                    Reset
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handlePreviousClick}
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNextClick}
                                    disabled={currentQuestion === questionData.length - 1}
                                >
                                    Next
                                </button>
                                <button className="btn btn-success" disabled={currentQuestion !== questionData.length - 1} onClick={countCorrectAnswers}>
                                    Submit Answer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ExamPage;

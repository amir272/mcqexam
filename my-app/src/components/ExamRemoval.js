import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function ExamList(){

    const [exams, setData] = useState([]);
    let navigate = useNavigate();
    useEffect(()=>{
            fetch("/api/get-quizes")
                .then((response) => response.json())
                .then((data) => {
                    setData(data) //this should be immediately after the data is declared. {console.log; setData} won't work
                })
                .catch((err) => alert(err))
    }, [])

    const handleClick = (index) => {
        const linkQId = exams[index].quizId;
        fetch(`/api/get-exam/${linkQId}`)
            .then((response) => response.json())
            .then((data) => {
            window.setTimeout(() => navigate(`/user/exam`, {state: data}, 2000));
            })
            .catch((err) => alert(err))
    };
    const showExams = ()=>{
        console.log(exams)
        return exams.map((exam, index)=>{
            return(
                <tr key={index}>
                    <td>{exam.id}</td>
                    <td>{exam.title}</td>
                    <td>{exam.total}</td>
                    <td>{exam.correct}</td>
                    <td>{exam.wrong}</td>
                    <td>{exam.time}</td>
                    {exam.status === "enabled" && <td><button className="btn btn-success" onClick={() =>handleClick(index)}>Start Exam</button></td>}
                </tr>
            )

        })
    }

    return (
        <>
            <div className="container">
                <div className="panel">
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Sl. no</th>
                    <th scope="col">Quiz Title</th>
                    <th scope="col">No. of Questions</th>
                    <th scope="col">Correct</th>
                    <th scope="col">Wrong Answer</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Status</th>
                </tr>
                </thead>
                <tbody>
                {showExams()}
                </tbody>
            </table>
            </div>
            </div>
        </>
    )
}

export default ExamList
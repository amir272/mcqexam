import React from "react";
import { useNavigate } from "react-router-dom";
import {makeid} from "../utils/RandString";
export default function AddQuiz(){
    const obj = {quizId: makeid(10), title: "", correct: 0, wrong: 0, unanswered: 0, total: 0, time: 0};
    const [formData, setFormData] = React.useState(obj);

    let navigate = useNavigate();
    const routeLogin = () => {
        navigate(`add-questions`, {state: formData.quizId});
    }
    function handleChange(e){
        e.preventDefault();
        setFormData(prevData =>{
            return{
                ...prevData,
                [e.target.name]: e.target.value
            }
        })
        console.log(formData)
    }

    async function handleSubmit(e){
        e.preventDefault();
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId: formData.quizId, correct: formData.correct, wrong: formData.wrong, unanswered: formData.unanswered,
                    time: formData.time, title: formData.title, total: formData.total, status: "disabled", date: Date
                })
            };

            await fetch('/api/addquiz', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    // setEmployee(data);
                    window.setTimeout(routeLogin, 5000);})
                .then(()=>setFormData(obj));
        }


    return (
        <section className="h-100 h-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-8 col-xl-6">
                        <div className="card rounded-3">
                            <div className="card-body p-4 p-md-5">
                                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Enter your exam details</h3>
<div className="row">
        <form className="form-horizontal title1" onSubmit={handleSubmit} method="POST">
            <fieldset>
                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="name">Enter Quiz title</label>
                    <div className="col-md-12">
                        <input id="name" name="title" value={formData.title} onChange={handleChange} placeholder="Enter Quiz title" className="form-control input-md"
                               type="text" />

                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="total">Enter total number of questions</label>
                    <div className="col-md-12">
                        <input id="total" name="total" value={formData.total} onChange={handleChange} placeholder="Enter total number of questions"
                               className="form-control input-md" type="number"/>

                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="right">Enter marks on right answer</label>
                    <div className="col-md-12">
                        <input id="right" name="correct" value={formData.correct} onChange={handleChange} placeholder="Enter marks on right answer"
                               className="form-control input-md" min="0" type="number"/>

                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="wrong">Enter minus marks on wrong answer without sign</label>
                    <div className="col-md-12">
                        <input id="wrong" name="wrong" value={formData.wrong} onChange={handleChange} placeholder="Enter minus marks on wrong answer without sign"
                               className="form-control input-md" min="0" type="number"/>

                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="unanswered">Enter minus marks on unanswered without sign</label>
                    <div className="col-md-12">
                        <input id="unanswered" name="unanswered" value={formData.unanswered} onChange={handleChange} placeholder="Enter minus marks on unanswered without sign"
                               className="form-control input-md" min="0" type="number"/>

                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor="time">Enter time limit for test in minute</label>
                    <div className="col-md-12">
                        <input id="time" name="time" value={formData.time} onChange={handleChange} placeholder="Enter time limit for test in minute"
                               className="form-control input-md" min="1" type="number"/>

                    </div>
                </div>


                <div className="form-group">
                    <label className="col-md-12 control-label" htmlFor=""></label>
                    <div className="col-md-12">
                        <input type="submit" className="btn btn-primary" value="Submit"
                               className="btn btn-primary"/>
                    </div>
                </div>

            </fieldset>
        </form>
</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

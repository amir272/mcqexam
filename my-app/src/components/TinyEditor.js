import React, {useRef, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {image_upload_handler_callback} from "../utils/XHR";
import {useNavigate} from "react-router-dom";
import LoadingModal from "../utils/LoadingModal";
import ExtractAndReturn from "../extractandcreatetools/QuestionsOptionsAnswerKeysProvider";

export default function TinyEditor(props) {
    const navigate = useNavigate();
    const quizId = props.quizid;
    const totalQuestion = props.total;
    const questionList = props.questionList;
    const optionsList = props.optionsList;
    const answerKeysList = props.answerKeysList;
    const { currentQuestion, setCurrentQuestion } = props;
    const [loading, setLoading] = useState(false)
    let added = true
    const routeLogin = () => {
        navigate(`/manage/add-sections`, {state: quizId});
    }
    const setCurrentQuestionNo = () => {
        if (currentQuestion <= totalQuestion) {
            setCurrentQuestion(currentQuestion + 1);
        }
    }
    function postQuestionsOptionsAnswers(questions, options, answers){
        postData("http://localhost:8092/api/add-questions", questions)
        postData("http://localhost:8092/api/add-options", options)
        postData("http://localhost:8092/api/add-answers", answers)
        window.setTimeout(()=> setLoading(true))
        window.setTimeout(()=> routeLogin(), 3000)
    }
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            const questionAndOptions = ExtractAndReturn(editorRef.current.getContent(), quizId, totalQuestion, questionList, optionsList, answerKeysList);
            const questions = questionAndOptions.questionList;
            const options = questionAndOptions.optionsList
            const answers = questionAndOptions.keyList
            added = questionAndOptions.added
            if(!added) return
            console.log("questionList:",questions)
            console.log("optionList:", options)
            console.log("answerKeys:", answers)
            console.log("totalQuestion:", totalQuestion)
            console.log("questionListLength:", questions.length)
            console.log("optionListLength:", options.length)
            console.log("answerKeysLength:", answers.length)

            if(questions.length === answers.length && options.length === answers.length && questions.length > 0 ){
                postQuestionsOptionsAnswers(questions, options, answers)
            }
            setCurrentQuestionNo()
        } else   alert("incorrect data format, please check the data and try again.")
    };

    function postData(link, data){
        fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => console.error(error));
        return data;
    }
    return (
        <>
            {
                loading && <LoadingModal message="Heading to add sections"/>
            }
            <div className="row">
                <div className="col-lg-1"></div>
                <div className="col-lg-10">
                    <p>
                        {currentQuestion <= totalQuestion ?
                            `Enter question ${currentQuestion} and options` :
                            'Enter answer keys'}
                    </p>
                    <Editor
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue=""
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'anchor autolink charmap codesample emoticons image link lists media ' +
                                'searchreplace table visualblocks wordcount checklist mediaembed casechange export ' +
                                'formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen ' +
                                'powerpaste advtable advcode editimage imagetools'
                            ],
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough |' +
                                ' link image media table mergetags | addcomment showcomments | spellcheckdialog ' +
                                'a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | ' +
                                'emoticons charmap | removeformat',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            images_upload_handler: image_upload_handler_callback
                        }}
                    />
                    <button onClick={log} className="btn-sm btn-outline-dark">Submit questions and answer keys</button>
                </div>
                <div className="col-lg-1"></div>
            </div>
        </>
    );
}

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {image_upload_handler_callback} from "../utils/XHR";
import EditAndSave from "../utils/ContentManipulator";

export default function TinyEditor(props) {
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent())
            const questionAndOptions = EditAndSave(editorRef.current.getContent(), props.quizid);
            const questionList = questionAndOptions.questionList;
            const optionsList = questionAndOptions.optionsList
            const answerKeys = questionAndOptions.keyList
            postData("http://localhost:8092/api/add-questions", questionList)
            postData("http://localhost:8092/api/add-options", optionsList)
            postData("http://localhost:8092/api/add-answers", answerKeys)
        } else   alert("nothing available")
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
            <div className="row">
                <div className="col-lg-1"></div>
                <div className="col-lg-10">
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
                        'powerpaste advtable advcode editimage tinycomments tableofcontents footnotes ' +
                        'mergetags autocorrect typography inlinecss'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough |' +
                        ' link image media table mergetags | addcomment showcomments | spellcheckdialog ' +
                        'a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | ' +
                        'emoticons charmap | removeformat',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    images_upload_handler: image_upload_handler_callback
                }}
            />
            <button onClick={log}>Log editor content</button>
                </div>
                <div className="col-lg-1"></div>
            </div>
        </>
    );
}

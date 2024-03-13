import TinyEditor from "./TinyEditor";
import {useLocation} from "react-router-dom";

function AddQuestions(){
    const location = useLocation();
    var quizid = '';
    console.log(location.state)
    if(location.state != null){
        quizid = location.state
    }
    return (
        <>
            <TinyEditor quizid={quizid}></TinyEditor>
        </>
    )
}

export default AddQuestions
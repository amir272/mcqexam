import {makeid} from "./RandString";
import {purify} from "./Dompurify";
import {closeUnclosedTags} from "./CloseUnclosedTags";

export default function EditAndSave(withTags, quizid){
    let questionList = [];
    let optionsList = [];
    let keyList = [];
    console.log(withTags);
    var arrayStr = explodeString(withTags, "Gunchques");
    arrayStr.shift();
    console.log(arrayStr);
    for (let i = 0; i < arrayStr.length; i++) {
        var quesAndOptStr = explodeString(arrayStr[i], "Gunchopts");
        var questionText = quesAndOptStr[0];
        let questionObject = createQuestionObject(quizid, questionText);
        questionList.push(questionObject);
        var optionsAndKeyStr = quesAndOptStr[1];
        var optionsAndKey = explodeString(optionsAndKeyStr, "Gunchkey");
        var options = optionsAndKey[0];
        var answerKey = optionsAndKey[1];
        optionsList.push(createOptionObject(questionObject.questionId, options));
        keyList.push(createAnswerObject(questionObject.questionId, answerKey))
    }
    function explodeString(inputString, delimiter) {
        return inputString.split(delimiter);
    }

    function createQuestionObject(quizId, questionText) {
        return {
            quizId: quizId,
            questionId: makeid(8),
            question: closeUnclosedTags(questionText).replace(/(\r\n|\n|\r)/gm, "")
        };
    }


    function createAnswerObject( questionId, correctOption) {
        return {
            questionId: questionId,
            correctOption: purify(correctOption).replace(/(\r\n|\n|\r)/gm, "").trim()
        };
    }

    function createOptionObject(questionId, optionsString){
        const optionsArr = optionsString.split("Option");
        const options = {};
        options['questionId'] = questionId;
        options['option5'] = '';

        for (let i = 0; i < optionsArr.length-1; i ++) {
            const key = 'option'+(i+1);
            const value = optionsArr[i + 1];
            options[key] = purify(value).replace(/(\r\n|\n|\r)/gm, "");
        }

        console.log(options);
        return options;
    }

    return {questionList, optionsList, keyList};

}
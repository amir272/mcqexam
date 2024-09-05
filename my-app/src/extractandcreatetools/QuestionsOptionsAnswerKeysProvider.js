import {createAnswerObject} from "./AnswerObjectCreator";
import {explodeString, explodeStringWithRegex} from "./StringExploder";
import {createQuestionObject} from "./QuestionObjectCreator";
import {createAnswerKeyMapping} from "./AnswerKeyMapper";
import {extractOptions} from "./ExtractOptions";
import {extractQuestions} from "./ExtractQuestions";
import {regexPatternForQuestionAndOptions} from "./RegexPatterns";

export default function ExtractAndReturn(withTags, quizid){
    let questionList = [];
    let optionsList = [];
    let keyList = [];
    console.log(withTags);
    // Replace <p> with an empty space, </p> and <br> with a newline
    let cleanedString = withTags.replace(/<p>/g, '').replace(/<\/p>|<br>/g, '\n');
    const questionOptionsAndKeys = explodeString(cleanedString, "AnswerKeys");
    const questionAndOptionsArray = extractQuestions(questionOptionsAndKeys[0]);
    for(let i = 0; i < questionAndOptionsArray.length; i++){
        console.log([i]+ "th element: " + questionAndOptionsArray[i]);
    }
    const answerKeysString = questionOptionsAndKeys[1];
    let answerKeysMap = createAnswerKeyMapping(answerKeysString);
    console.log("questionAndOptionsArray: " + questionAndOptionsArray);
    compareQuestionArrayAndKeysArraySize(questionAndOptionsArray, answerKeysMap);
    createQuestionAndOptionsList(questionAndOptionsArray, questionList, optionsList);
    createAnswerKeysList(answerKeysMap, questionList);
    function createOptionObject(questionId, optionsArr){
        const options = {};
        options['questionId'] = questionId;
        options['option5'] = '';

        for (let i = 0; i < optionsArr.length; i ++) {
            const key = 'option'+(i+1);
            const value = optionsArr[i];
            options[key] = value;
        }
        console.log(options);
        return options;
    }

    function createQuestionAndOptionsList(questionAndOptionsArray, questionList, optionsList){
        for (let i = 0; i < questionAndOptionsArray.length; i++) {
            const questionAndOptionsString = explodeStringWithRegex(questionAndOptionsArray[i], regexPatternForQuestionAndOptions);
            let questionText = questionAndOptionsString[0];
            const optionsString = questionAndOptionsString[1];
            const optionsArray= extractOptions(optionsString);
            console.log("question for no. " + (i+1) + ": " + questionText);
            console.log("options: " + (i+1) + " : " + optionsArray);
            if(optionsArray.length > 1 && optionsArray.length < 6){
                if (questionText.length < 1) {
                    questionText = " ";
                }
            }
            const questionObject = createQuestionObject(quizid, questionText);
            questionList.push(questionObject);
            optionsList.push(createOptionObject(questionObject.questionId, optionsArray));
        }
    }

    function createAnswerKeysList(answerKeysMap, questionList){
        for(let i = 0; i < questionList.length; i++){
            const answerKey = answerKeysMap.get((i+1).toString());
            keyList.push(createAnswerObject(questionList[i].questionId, answerKey));
        }
    }
    function compareQuestionArrayAndKeysArraySize(questionAndOptionsArray, answerKeysMap){
        if(questionAndOptionsArray.length !== answerKeysMap.size) {
            alert(questionAndOptionsArray.length + "is no. of Ques and key total no. is"+ answerKeysMap.size);
            throw new Error(`Answer keys number and questions number are not equal`);
        }
    }
    return {questionList, optionsList, keyList};
}

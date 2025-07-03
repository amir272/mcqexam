import {createAnswerObject} from "./AnswerObjectCreator";
import {explodeString, explodeStringWithRegex} from "./StringExploder";
import {createQuestionObject} from "./QuestionObjectCreator";
import {createAnswerKeyMapping} from "./AnswerKeyMapper";
import {extractOptions} from "./ExtractOptions";
import {extractQuestions} from "./ExtractQuestions";
import {regexPatternForQuestionAndOptions} from "./RegexPatterns";
import {useState} from "react";

export default function ExtractAndReturn(withTags, quizid, totalQuestion, questionList, optionsList, keyList){
    let added = false
    console.log(withTags);
    // Replace <p> with an empty space, </p> and <br> with a newline
    let cleanedString = withTags
        .replace(/<\/p>|<br>/g, '\n')
        .replace(/<strong>|<\/strong>/g, '')
        .replace(/<span[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ');
    // const questionOptionsAndKeys = explodeString(cleanedString, "AnswerKeys");
    // const questionAndOptionsArray = extractQuestions(questionOptionsAndKeys[0]);
    // for(let i = 0; i < questionAndOptionsArray.length; i++){
    //     console.log([i]+ "th element: " + questionAndOptionsArray[i]);
    // }
    // const answerKeysString = questionOptionsAndKeys[1];
    // let answerKeysMap = createAnswerKeyMapping(answerKeysString);
    // console.log("questionAndOptionsArray: " + questionAndOptionsArray);
    // compareQuestionArrayAndKeysArraySize(questionAndOptionsArray, answerKeysMap);
    // createQuestionAndOptionsList(questionAndOptionsArray, questionList, optionsList);
    // createAnswerKeysList(answerKeysMap, questionList);

    if (cleanedString.includes("AnswerKeys")) {
        const answerKeysString = cleanedString.split("AnswerKeys")[1]
        let answerKeysMap = createAnswerKeyMapping(answerKeysString);
        if (!compareQuestionArrayAndKeysArraySize(questionList, answerKeysMap)) {
            added = false
            return {questionList, optionsList, keyList, added};
        }
        if(questionList.length === keyList.length){
            alert("Questions and keys are already added")
            added = true
            return {questionList, optionsList, keyList, added};
        }
        createAnswerKeysList(answerKeysMap, questionList);
        added = true
    } else {
        createQuestionAndOptionsList(cleanedString, questionList, optionsList);
    }

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
        // for (let i = 0; i < questionAndOptionsArray.length; i++) {
            const questionAndOptionsString = explodeStringWithRegex(questionAndOptionsArray, regexPatternForQuestionAndOptions);
            let questionText = questionAndOptionsString[0];
            const optionsString = questionAndOptionsString[1];
            const optionsArray= extractOptions(optionsString);
            console.log("question", questionText);
            console.log("options: ", optionsArray);
            if(optionsArray.length > 3 && optionsArray.length < 6){
                if (questionText.length < 1) {
                    questionText = " ";
                }
                added = true
            } else {
                alert("Question and options are not properly formatted")
                added = false
                return
            }
            const questionObject = createQuestionObject(quizid, questionText);
            questionList.push(questionObject);
            optionsList.push(createOptionObject(questionObject.questionId, optionsArray));
        // }
    }

    function createAnswerKeysList(answerKeysMap, questionList){
        for(let i = 0; i < questionList.length; i++){
            const answerKey = answerKeysMap.get((i+1).toString());
            keyList.push(createAnswerObject(questionList[i].questionId, answerKey));
        }
    }
    function compareQuestionArrayAndKeysArraySize(questionAndOptionsArray, answerKeysMap){
        if(questionAndOptionsArray.length !== answerKeysMap.size) {
            alert(questionAndOptionsArray.length + "is the no. of Ques and key total no. is"+ answerKeysMap.size);
            return false;
        }
        return true;
    }
    return {questionList, optionsList, keyList, added};
}

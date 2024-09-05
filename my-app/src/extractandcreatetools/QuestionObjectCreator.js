import {makeid} from "./RandString";

export function createQuestionObject(quizId, questionText) {
    return {
        quizId: quizId,
        questionId: makeid(8),
        question: questionText
    };
}
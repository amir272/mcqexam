import {purify} from "./Dompurify";

export function createAnswerObject( questionId, correctOption) {
    return {
        questionId: questionId,
        correctOption: purify(correctOption).replace(/(\r\n|\n|\r)/gm, "").trim()
    };
}
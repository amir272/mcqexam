export function extractQuestions(questionsString) {
    // Find the index of the first question
    // const firstQuestionIndex = questionsString.search(/Q\d+\.|\d+\./);
    // if (firstQuestionIndex === -1) {
    //     alert("No questions found");
    //     return []; // No questions found
    // }
    // // Slice the string from the first question
    // questionsString = questionsString.slice(firstQuestionIndex);

    let currentQuestion = '';
    let questions = [];
    for (let i = 0; i < questionsString.length; i++) {
        let c = questionsString[i];
        if (c === 'Q') {
            let nextChars = questionsString.slice(i, i + 6); // Increased the slice length to 6 to accommodate multiple digits
            if (/^Q\.\d+|^Q\d+\./.test(nextChars)) {
                if (currentQuestion.trim()) {
                    questions.push(currentQuestion.trim());
                    currentQuestion = '';
                }
                i += nextChars.indexOf('.') + 1; // Skip the question number
            } else {
                currentQuestion += c;
            }
        } else {
            currentQuestion += c;
        }
    }
    if (currentQuestion.trim()) {
        questions.push(currentQuestion.trim());
    }
    return questions;
}

let questionsString = `>p>Q1. In question select the related letter
number
from the given Alternatives.
8 : 9 : : 64 : ?
Options
(A) 87
(B) 25
(C) 36
(D) 46
Q2. In question select the related letter
number
from the given Alternatives.
DFHj : WUSQ : : CEGi : ?
Options
(A) XWTR
(B) XURT
(C) XVTR
(D) XYZR
Q3. In question select the related letter
number
from the given Alternatives.
9, 81, 9 : 3, 9, 3 : : 4, 16, 4 : ?
Options
(A) 8, 32, 8
(B) 6, 9, 6
(C) 2, 8, 2
(D) 2, 4, 2
Q4. In question select the related letter
number
from the given Alternatives.
RAJASTHAN : JODHPUR : : PUNJAB : ?
Options
(A) JALANDHAR
(B) LUDHIANA
(C) CHANDIGARH
(D) AMRITSHAR
Q5. In question select the related letter
number
from the given Alternatives.
Nephew : ? : : Niece : Daughter
Options
(A) Son (B) Brother
(C) Sister
(D) Mother

Q6. In question select the related letter
number
from the given Alternatives.
B2Y25 : D4W23 : : C3X24 : ?
Options
(A) AIZ26
(B) F6U21
(C) E5U22
(D) E5V22
Q7. In question select the related letter
number
from the given Alternatives.1710487458308mceclip0.png">
Cripps Mission : 1942 : : Cabinet Mission : ?
Options
(A) 1946
(B) 1949
(C) 1944
(D) 1947
Q8. In question find the odd
Word/Number/Letter/ Number pair from the
given alternatives.
Choose the right options.
Options
(A) Gujarat
(B) Kerala
(C) Orissa
(D) Meghalaya
Q9. In question find the odd
Word/Number/Letter/ Number pair from the
given alternatives.
Choose the right options-
Options
(A) Atal Behari Vajpayi
(B) Dr. A.P.J. Abdul Kalam
(C) Charan Singh
(D) Manmohan Singh
Q10. In question find the odd
Word/Number/Letter/ Number pair from the
given alternatives.
Choose the right options-
Options
(A) 289
(B) 361
(C) 484
(D) 441
`;

let questions = extractQuestions(questionsString);
console.log(questions); // Output: [ '1. In question select the related letter\nnumber\nfrom the given Alternatives.\n8 : 9 : : 64 : ?\nOptions\n(A) 87\n(B) 25\n(C) 36\n(D) 46', '2. In question select the related letter\nnumber\nfrom the given Alternatives.\nDFHj : WUSQ : : CEGi : ?\nOptions\n(A) XWTR\n(B) XURT\n(C) XVTR\n(D) XYZR' ]
// Define individual regex for each pattern
export const regexPatternsForOptions = {
    "(A)": /\([A-E]\)/g,
    "A.": /[A-E]\./g,
    "(A).": /\([A-E]\)\./g,
    "(1)": /\([1-5]\)/g,
    "1.": /[1-5]\./g,
    "(1).": /\([1-5]\)\./g
};

export const regexPatternForQuestionAndOptions = /([\s\S]*?)(?:(?:\(A\)\s|A\.\s|\(1\)\s|1\.\s))/;
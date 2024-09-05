export function explodeString(inputString, delimiter) {
    return inputString.split(delimiter);
}

export function explodeStringWithRegex(inputString, regex) {
    console.log("inputString: " + inputString);
    const match = inputString.match(regex);

    if (match) {
        console.log([match[1], inputString.slice(match[1].length)]);
        return [match[1], inputString.slice(match[1].length)];
    } else {
        return [inputString, ''];
    }
}
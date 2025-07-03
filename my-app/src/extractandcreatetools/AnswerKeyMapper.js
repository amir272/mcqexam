export function createAnswerKeyMapping(answerKeys) {
    console.log(answerKeys);
    answerKeys = answerKeys.replace(/<p>|<br>/g, '\n')
    console.log(answerKeys);
    const lines = answerKeys.split('\n');
    let keys= new Map();

    for (let line of lines) {
        console.log("line: " + line);
        const parts = line.trim().split(' ');
        if(line === " " || line === "" || line === '\n') continue;
        for (let i = 0; i < parts.length; i += 2) {
            let questionNumber = parts[i];
            let key = parts[i + 1];

            // Validate the key
            if (!isValidKey(key)) {
                alert(`Invalid key: ${key}`)
                throw new Error(`Invalid key: ${key}`);
            }

            // If the key is alphanumeric or alphanumeric inside parentheses
            if (/^[A-Za-z0-9]$|^\([A-Za-z0-9]\)$/.test(key)) {
                // Remove parentheses if any and convert to upper case
                key = key.replace(/\(|\)/g, '').toUpperCase();
            } else {
                key = parseInt(key);
            }

            keys.set(questionNumber, key);
        }
    }
    console.log(keys);
    return keys;
}

function isValidKey(key) {
    // Check if the key is alphanumeric or alphanumeric inside parentheses
    return /^[A-Za-z0-9]$|^\([A-Za-z0-9]\)$/.test(key);
}
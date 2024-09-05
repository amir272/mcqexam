import {regexPatternsForOptions} from './RegexPatterns';
export function extractOptions(optionsString) {
    if (typeof optionsString !== 'string') {
        alert(optionsString + ' is not in proper format of options');
        throw new Error('Invalid input: optionsString must be a string');
    }

    // Trim the optionsString and get the first 6 characters
    let trimmedString = optionsString.substring(0, 6);
    // Find the first matched pattern
    let firstMatchedPattern = null;
    for (let pattern in regexPatternsForOptions) {
        if (trimmedString.includes(pattern)) {
            firstMatchedPattern = pattern;
            break;
        }
    }

    // If no pattern is matched, return an empty array
    if (!firstMatchedPattern) {
        return [];
    }

    // Load the regex dynamically according to the first matched pattern
    let regex = regexPatternsForOptions[firstMatchedPattern];

    // Extract the options using the loaded regex
    // let options = [];
    // let match;
    // while ((match = regex.exec(optionsString)) !== null) {
    //     options.push(match[1].trim());
    // }
    let parts = optionsString.split(regex).filter(Boolean);

    // Remove the parts that match the regex
    let otherParts = parts.filter(part => !regex.test(part));

    // Trim each part to remove leading and trailing whitespace
    otherParts = otherParts.map(part => part.trim());
    console.log("array of options: "+ optionsString);

    return otherParts;
    // let currentOption = '';
    // let options = [];
    // for (let c of optionsString) {
    //     if (/\([A-Ea-e1-5]\)|[A-Ea-e1-5]\./.test(currentOption + c)) {
    //         if (currentOption) {
    //             options.push(currentOption.trim());
    //             currentOption = '';
    //         }
    //     } else if (/\([A-Ea-e1-5]\)|[A-Ea-e1-5]\./.test(currentOption + c) || c === ')' || c === '.') {
    //         continue;
    //     } else {
    //         currentOption += c;
    //     }
    // }
    // if (currentOption) {
    //     options.push(currentOption.trim());
    // }
    // return options;
}
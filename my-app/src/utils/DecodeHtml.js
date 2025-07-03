import he from 'he';

export function decodeHtml(html) {
    // Decode HTML entities
    const decodedHtml = he.decode(html);

    // Create a new DOM parser
    const parser = new DOMParser();

    // Parse the decoded HTML string into a DOM
    const dom = parser.parseFromString(decodedHtml, 'text/html');

    // Extract the text content of specific elements
    const textContent = dom.body.textContent;

    return textContent;
}
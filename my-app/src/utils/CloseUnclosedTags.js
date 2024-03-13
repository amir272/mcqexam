export function closeUnclosedTags(html) {
    const regex = /<([a-z]+)([^>]*)(?<!\/)>/gi;
    const tags = [];

    // Find all opening tags in the HTML string
    let match;
    while ((match = regex.exec(html)) !== null) {
        const tagName = match[1];
        const attributes = match[2];

        // Add the tag to the stack
        tags.push(tagName);

        // Replace the opening tag with a self-closing tag
        html = html.substring(0, match.index) + `<${tagName}${attributes} />` + html.substring(regex.lastIndex);
    }

    // Close any remaining unclosed tags
    while (tags.length > 0) {
        const tagName = tags.pop();

        // Add the closing tag to the end of the HTML string
        html += `</${tagName}>`;
    }

    return html;
}

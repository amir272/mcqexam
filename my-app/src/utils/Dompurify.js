import DOMPurify from 'dompurify';

export function purify(unsanitized) {
    const cleanHtml = DOMPurify.sanitize(unsanitized, { FORBID_TAGS: ['div', 'p', 'br', 'b', 'i', 'pre'] });

    return cleanHtml;
}

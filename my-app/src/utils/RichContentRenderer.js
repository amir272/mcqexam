// --- Helper Component for Rendering Rich Content ---
import React, {useEffect, useRef} from "react";
import katex from "katex";

export const RichContentRenderer = ({ content }) => {
    if (!content || content.length === 0) return null;
    return content.map((element, index) => {
        if (!element) return null;
        switch (element.type) {
            case 'text':
                return <span key={index}>{element.content}</span>;
            case 'image':
                if (element.format === 'image/wmf' || element.format === 'image/x-wmf') {
                    return (
                        <div key={index} style={{
                            border: '2px dashed #ccc',
                            padding: '15px',
                            margin: '10px 0',
                            textAlign: 'center',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '5px'
                        }}>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                                Mathematical Expression (WMF)
                            </p>
                            <small style={{ color: '#666' }}>
                                WMF format detected - may not display properly in browser
                            </small>
                            {/* Still try to display the image, but with fallback */}
                            <img
                                src={`data:${element.format};base64,${element.content}`}
                                alt="Mathematical expression"
                                style={{ ...styles.image, display: 'block', margin: '10px auto' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    );
                } else {
                    // Handle regular images (PNG, JPG, etc.)
                    const imageUrl = `data:${element.format};base64,${element.content}`;
                    return (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Extracted content ${index}`}
                            style={styles.image}
                            onError={(e) => {
                                console.error('Image failed to load:', element.format);
                                e.target.alt = 'Failed to load image';
                                e.target.style.border = '1px solid red';
                            }}
                        />
                    );
                }
            case 'formula':
                return <FormulaRenderer key={index} latex={element.content} />;
            case 'table':
                return (
                    <table key={index} style={styles.table}>
                        <tbody>
                        {element.content.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} style={styles.tableCell}><RichContentRenderer content={cell} /></td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                );
            default:
                return null;
        }
    });
};


// --- Helper Component for Rendering Formulas ---
const FormulaRenderer = ({ latex }) => {
    const containerRef = useRef();
    useEffect(() => {
        try {
            katex.render(latex, containerRef.current, { throwOnError: false, displayMode: false });
        } catch (e) { console.error('Error rendering KaTeX:', e); }
    }, [latex]);
    return <span ref={containerRef} />;
};

const styles = {
    image: { maxWidth: '100%', height: 'auto', margin: '1rem 0', borderRadius: '0px', display: 'inline' },
    table: { width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', boxShadow: '0 0 5px rgba(0,0,0,0.05)' },
    tableCell: { border: '1px solid #ddd', padding: '12px', textAlign: 'left', verticalAlign: 'top' },
};
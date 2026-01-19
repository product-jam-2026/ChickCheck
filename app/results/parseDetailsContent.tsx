import React from "react";
import styles from "./page.module.css";

/**
 * Parses detail content with special formatting:
 * - Converts <u>text</u> to bold text (font-weight: 700)
 * - Adds a line break after each bold headline
 * - Splits content by double line breaks into separate paragraphs
 */
export function parseDetailsContent(content: string): React.ReactNode {
  if (!content) return null;

  // Split content by double line breaks (paragraph breaks)
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());

  // If there's only one paragraph with no underlined text, return as plain text
  if (paragraphs.length <= 1 && !content.includes('<u>')) {
    return <p className={styles.detailSingleText}>{content}</p>;
  }

  return (
    <div className={styles.detailContent}>
      {paragraphs.map((paragraph, index) => {
        // Parse the paragraph to handle <u> tags
        const parts = parseUnderlineToStrong(paragraph.trim());
        
        return (
          <div key={index} className={styles.detailParagraph}>
            {parts}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Converts <u>text</u> tags to bold (font-weight: 700) spans with line break after
 */
function parseUnderlineToStrong(text: string): React.ReactNode {
  // Split by <u> tags
  const parts: React.ReactNode[] = [];
  const regex = /<u>(.*?)<\/u>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the <u> tag (light weight)
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      parts.push(
        <span key={`before-${lastIndex}`} className={styles.detailText}>
          {beforeText}
        </span>
      );
    }

    // Check if there's a colon immediately after </u>
    const afterMatch = text.substring(regex.lastIndex);
    const hasColonAfter = afterMatch.startsWith(':');
    
    // Add the underlined text as bold
    parts.push(
      <React.Fragment key={`bold-${match.index}`}>
        <span className={styles.detailHeadline}>
          {match[1]}
          {hasColonAfter ? ':' : ''}
        </span>
        <br />
      </React.Fragment>
    );

    // Skip the colon if we already included it
    if (hasColonAfter) {
      lastIndex = regex.lastIndex + 1;
    } else {
      lastIndex = regex.lastIndex;
    }
  }

  // Add remaining text after the last <u> tag
  if (lastIndex < text.length) {
    parts.push(
      <span key={`after-${lastIndex}`} className={styles.detailText}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  // If no <u> tags were found, return the text with light weight
  if (parts.length === 0) {
    return <span className={styles.detailText}>{text}</span>;
  }

  return <>{parts}</>;
}

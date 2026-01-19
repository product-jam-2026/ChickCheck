import React from "react";
import styles from "./page.module.css";

/**
 * Parses detail content with special formatting:
 * - Converts <u>text</u> to bold text (font-weight: 700)
 * - Adds a line break after each bold headline
 * - Splits content by double line breaks into separate paragraphs
 */
/* app/results/parseDetailsContent.tsx */

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
        // 1. Check if the paragraph starts with a number (e.g., "1. ")
        const numberMatch = paragraph.match(/^(\d+\.)\s*/);
        
        let numberNode = null;
        let textToProcess = paragraph;

        if (numberMatch) {
          // 2. Create the bold number element using the headline style
          numberNode = (
            <span className={styles.detailHeadline}>
              {numberMatch[1]}{" "}
            </span>
          );
          
          // 3. Remove the number from the text so it isn't rendered twice
          textToProcess = paragraph.substring(numberMatch[0].length);
        }

        // 4. Parse the rest of the text for <u> tags as before
        const parts = parseUnderlineToStrong(textToProcess);
        
        return (
          <div key={index} className={styles.detailParagraph}>
            {numberNode}
            {parts}
          </div>
        );
      })}
    </div>
  );
}

function parseUnderlineToStrong(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /<u>(.*?)<\/u>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 1. Handle text BEFORE the headline
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      parts.push(
        <span key={`before-${lastIndex}`} className={styles.detailText}>
          {beforeText}
        </span>
      );
    }

    // Check for colon
    const afterMatch = text.substring(regex.lastIndex);
    const hasColonAfter = afterMatch.startsWith(':');
    
    // 2. Push the Headline (Bold) + The Manual Break
    parts.push(
      <React.Fragment key={`bold-${match.index}`}>
        <span className={styles.detailHeadline}>
          {match[1]}
          {hasColonAfter ? ':' : ''}
        </span>
        <br /> 
      </React.Fragment>
    );

    // Update index to skip the colon if needed
    if (hasColonAfter) {
      lastIndex = regex.lastIndex + 1;
    } else {
      lastIndex = regex.lastIndex;
    }
  }

  // 3. Handle text AFTER the headline
  if (lastIndex < text.length) {
    // --- THE FIX IS HERE ---
    // We use .trimStart() to remove the hidden "new line" character
    // that creates the extra gap.
    const remainingText = text.substring(lastIndex).trimStart();
    
    if (remainingText) {
        parts.push(
        <span key={`after-${lastIndex}`} className={styles.detailText}>
            {remainingText}
        </span>
        );
    }
  }

  if (parts.length === 0) {
    return <span className={styles.detailText}>{text}</span>;
  }

  return <>{parts}</>;
}
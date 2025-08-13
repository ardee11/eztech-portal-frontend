import { CSSProperties } from 'react';

/**
 * Utility functions to ensure consistent text sizing across branch switches
 * These provide backup styling when CSS classes fail to load properly
 */

export const text2xsStyle: CSSProperties = {
  fontSize: '0.625rem', // 10px
  lineHeight: '0.875rem',
};

export const getText2xsClassName = (baseClass: string = '') => {
  // Return the base class with text-2xs, plus a fallback utility class
  return `${baseClass} text-2xs text-2xs-utility`.trim();
};

export const getText2xsInlineStyle = (additionalStyles: CSSProperties = {}) => {
  return {
    ...text2xsStyle,
    ...additionalStyles,
  };
};

// Helper to apply text-2xs to existing className strings
export const ensureText2xs = (className: string) => {
  if (className.includes('text-2xs')) {
    return className;
  }
  return `${className} text-2xs`.trim();
};

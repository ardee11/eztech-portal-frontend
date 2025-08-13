import React from 'react';

/**
 * Debug component to check if text-2xs is working properly
 * Use this temporarily to diagnose text sizing issues after branch switches
 */
export const TextSizeDebugger: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-bold mb-2">Text Size Debugger</h3>
      <div className="space-y-2 text-xs">
        <div>Default text (text-xs): <span className="text-xs">Sample text</span></div>
        <div>Small text (text-2xs): <span className="text-2xs">Sample text</span></div>
        <div>Fallback text: <span className="text-2xs-fallback">Sample text</span></div>
        <div>Utility text: <span className="text-2xs-utility">Sample text</span></div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        If text-2xs looks bigger than text-xs, there's a CSS loading issue.
      </div>
    </div>
  );
};

export default TextSizeDebugger;

# Text-2xs Fix for Branch Switching Issues

## Problem
When switching between git branches, the `text-2xs` CSS utility class would sometimes fail to apply properly, causing text that should be 10px to appear much larger.

## Root Cause
The issue was likely caused by:
1. CSS custom utilities not loading properly after branch switches
2. Tailwind CSS v4 configuration conflicts
3. CSS caching issues between branches

## Solution Implemented

### 1. Fortified CSS Classes
- Moved `text-2xs` to the `@layer base` for more robust loading
- Added `!important` declarations to ensure consistent sizing
- Created multiple fallback classes: `text-2xs-fallback` and `text-2xs-utility`

### 2. CSS Selector Overrides
- Added specific selectors for common `text-2xs` usage patterns
- Ensured table headers maintain proper sizing
- Added attribute selectors to catch any element with `text-2xs` in class

### 3. Utility Functions
- Created `src/utils/textSizeUtils.tsx` with backup styling approaches
- Provides inline styles as fallback when CSS classes fail
- Helper functions to ensure `text-2xs` is always applied

### 4. Debug Component
- Added `TextSizeDebugger` component to diagnose sizing issues
- Shows comparison between different text size approaches
- Temporarily added to Inventory page for testing

## Usage

### Normal Usage (Recommended)
Continue using `text-2xs` as before - it should now work consistently:

```tsx
<span className="text-2xs font-semibold">Small text</span>
```

### Fallback Usage (If issues persist)
Use the fallback classes:

```tsx
<span className="text-2xs-fallback font-semibold">Small text</span>
<span className="text-2xs-utility font-semibold">Small text</span>
```

### Inline Styles (Last resort)
Use the utility functions for guaranteed sizing:

```tsx
import { text2xsStyle, getText2xsInlineStyle } from '../utils/textSizeUtils';

<span style={text2xsStyle}>Small text</span>
<span style={getText2xsInlineStyle({ color: 'red' })}>Red small text</span>
```

## Files Modified

1. `src/index.css` - Fortified CSS classes and added fallbacks
2. `src/utils/textSizeUtils.tsx` - New utility functions
3. `src/components/elements/TextSizeDebugger.tsx` - Debug component
4. `src/pages/Inventory/index.tsx` - Added debug component temporarily
5. `clear-css-cache.ps1` - PowerShell script to clear CSS cache

## Testing

1. **After implementing the fix:**
   - Switch to another branch and back
   - Check if `text-2xs` elements maintain 10px sizing
   - Use the debug component to verify all text sizes

2. **If issues persist:**
   - Run `clear-css-cache.ps1` to clear CSS cache
   - Check browser dev tools for CSS conflicts
   - Use fallback classes or inline styles

## Removing Debug Components

After confirming the fix works:
1. Remove `TextSizeDebugger` import from Inventory page
2. Remove `<TextSizeDebugger />` component
3. Delete `TextSizeDebugger.tsx` file
4. Delete `clear-css-cache.ps1` if no longer needed

## Prevention

The fortified CSS classes should prevent this issue from occurring in the future. The `!important` declarations ensure that `text-2xs` sizing takes precedence over any conflicting styles that might be introduced when switching branches.

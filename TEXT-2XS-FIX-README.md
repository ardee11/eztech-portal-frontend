# Text-2xs Fix for Branch Switching Issues

## Problem
When switching between git branches or performing `git pull`, the `text-2xs` CSS utility class would sometimes fail to apply properly, causing text that should be 10px to appear much larger.

## Root Cause
The issue was likely caused by:
1. CSS custom utilities not loading properly after branch switches
2. Tailwind CSS v4 configuration conflicts
3. CSS caching issues between branches
4. **Git pull operations overwriting local CSS changes**

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

### 4. **NEW: Automated Fix Script**
- Created `fix-text-2xs.ps1` PowerShell script to automatically restore the fix
- **Run this script after every `git pull`** to ensure the fix persists
- Automatically creates missing CSS files and adds imports

## **IMPORTANT: After Git Pull Workflow**

### **Step 1: Run the Fix Script**
After every `git pull`, run this command to restore the text-2xs fix:

```powershell
.\fix-text-2xs.ps1
```

### **Step 2: Restart Dev Server**
Restart your development server to ensure the CSS changes take effect:

```bash
npm run dev
```

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
2. `src/styles/text-2xs-fix.css` - **NEW: Dedicated fix CSS file**
3. `src/utils/textSizeUtils.tsx` - New utility functions
4. `fix-text-2xs.ps1` - **NEW: Automated fix script**
5. `clear-css-cache.ps1` - PowerShell script to clear CSS cache

## **NEW: Automated Fix Process**

The `fix-text-2xs.ps1` script will:

1. Check if the fix CSS file exists
2. Create it if missing
3. Verify the main CSS imports the fix
4. Add the import if missing
5. Provide clear feedback on what was fixed

## Testing

1. **After implementing the fix:**
   - Switch to another branch and back
   - Check if `text-2xs` elements maintain 10px sizing
   - Use the debug component to verify all text sizes

2. **After git pull:**
   - **Run `.\fix-text-2xs.ps1`**
   - Restart dev server
   - Check if `text-2xs` elements maintain 10px sizing

3. **If issues persist:**
   - Run `clear-css-cache.ps1` to clear CSS cache
   - Check browser dev tools for CSS conflicts
   - Use fallback classes or inline styles

## **Git Workflow Best Practices**

### **Before Pulling:**
```bash
git stash  # Save any local changes
git pull   # Pull latest changes
```

### **After Pulling:**
```powershell
.\fix-text-2xs.ps1  # Restore text-2xs fix
npm run dev          # Restart dev server
```

### **Alternative: Commit the Fix**
To make the fix permanent across all pulls:

```bash
git add src/styles/text-2xs-fix.css
git add src/index.css
git commit -m "Add permanent text-2xs fix for consistent sizing"
git push
```

## Prevention

The fortified CSS classes should prevent this issue from occurring in the future. The `!important` declarations ensure that `text-2xs` sizing takes precedence over any conflicting styles that might be introduced when switching branches or pulling changes.

**Remember: Always run `.\fix-text-2xs.ps1` after `git pull` operations!**

# Text-2xs Fix Script for EZTech Portal Frontend
# Run this script after git pull to ensure text-2xs sizing is consistent

Write-Host "🔧 Applying text-2xs fix..." -ForegroundColor Yellow

# Check if the fix CSS file exists
if (Test-Path "src/styles/text-2xs-fix.css") {
    Write-Host "✅ Text-2xs fix CSS file found" -ForegroundColor Green
} else {
    Write-Host "❌ Text-2xs fix CSS file not found - creating it..." -ForegroundColor Red
    
    # Create the styles directory if it doesn't exist
    if (!(Test-Path "src/styles")) {
        New-Item -ItemType Directory -Path "src/styles" -Force
    }
    
    # Create the fix CSS file
    $fixCSS = @"
/*
 * Text-2xs Fix CSS - Import this file to ensure consistent text sizing
 * This file contains the fortified CSS classes to prevent text-2xs sizing issues
 * when switching between git branches or performing git pulls.
 */

/* Base layer for more robust custom utilities */
@layer base {
  .text-2xs {
    font-size: 0.625rem !important; /* 10px - smaller than text-xs which is 0.75rem (12px) */
    line-height: 0.875rem !important;
  }
  
  /* Fallback for when text-2xs fails */
  .text-2xs-fallback {
    font-size: 0.625rem !important;
    line-height: 0.875rem !important;
  }
  
  /* Force reset for text-2xs elements to prevent branch switch issues */
  [class*="text-2xs"] {
    font-size: 0.625rem !important;
    line-height: 0.875rem !important;
  }
  
  /* Specific selectors for common text-2xs usage to prevent branch switch issues */
  th.text-2xs,
  .text-2xs.font-semibold,
  .text-2xs.font-medium,
  .text-2xs.font-bold {
    font-size: 0.625rem !important;
    line-height: 0.875rem !important;
  }
  
  /* Ensure table headers maintain proper sizing */
  table th.text-2xs {
    font-size: 0.625rem !important;
    line-height: 0.875rem !important;
  }
}

@layer utilities {
  /* Keep the original utility as backup */
  .text-2xs-utility {
    font-size: 0.625rem;
    line-height: 0.875rem;
  }
}
"@
    
    Set-Content -Path "src/styles/text-2xs-fix.css" -Value $fixCSS
    Write-Host "✅ Text-2xs fix CSS file created" -ForegroundColor Green
}

# Check if main CSS imports the fix
$mainCSS = Get-Content "src/index.css" -Raw
if ($mainCSS -match "text-2xs-fix\.css") {
    Write-Host "✅ Main CSS imports text-2xs fix" -ForegroundColor Green
} else {
    Write-Host "⚠️  Main CSS doesn't import text-2xs fix - adding import..." -ForegroundColor Yellow
    
    # Add the import if it's missing
    $newCSS = $mainCSS -replace '@import "preline/variants\.css";', '@import "preline/variants.css";' + "`n@import `"./styles/text-2xs-fix.css`";"
    Set-Content -Path "src/index.css" -Value $newCSS
    Write-Host "✅ Import added to main CSS" -ForegroundColor Green
}

Write-Host "🎯 Text-2xs fix applied successfully!" -ForegroundColor Green
Write-Host "💡 Tip: Run this script after every git pull to ensure the fix persists" -ForegroundColor Cyan

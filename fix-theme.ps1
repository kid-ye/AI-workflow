# Fix theme colors in all stitch HTML files
$files = @(
    "d:\try_2\src\data\stitch\logs.html",
    "d:\try_2\src\data\stitch\workflow.html"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # Replace old background colors
    $content = $content -replace '#0b1326', '#0a0a0a'
    $content = $content -replace '#c0c1ff', '#ff3d00'
    $content = $content -replace 'bg-slate-900', 'bg-[#0a0a0a]'
    $content = $content -replace 'dark:bg-\[#0b1326\]', 'bg-[#0a0a0a]'
    $content = $content -replace 'border-slate-800', 'border-[#262626]'
    $content = $content -replace 'dark:border-none', 'border-[#262626]'
    $content = $content -replace 'text-indigo-100 dark:text-\[#c0c1ff\]', 'text-[#ff3d00]'
    $content = $content -replace 'text-indigo-400 dark:text-\[#c0c1ff\]', 'text-[#ff3d00]'
    
    Set-Content $file $content -NoNewline
    Write-Host "Updated $file"
}

Write-Host "Theme fix complete!"

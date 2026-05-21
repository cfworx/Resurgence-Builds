# update_docx_anarchy_fix.ps1
# Corrects the Anarchy talent values in game_knowledge.docx
# Based on the corrected in-game tooltip post Patch 1.2.1:
# - 2.40% WD (was 100%)
# - 4.50 seconds (was 10s)  
# - 12 meters transfer (was 25m)

Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$docxPath = Resolve-Path (Join-Path $PSScriptRoot '..\game_knowledge\game_knowledge.docx')

Write-Output "Reading: $docxPath"

$zipBytes = [System.IO.File]::ReadAllBytes($docxPath)
$memStream = New-Object System.IO.MemoryStream
$memStream.Write($zipBytes, 0, $zipBytes.Length)
$memStream.Position = 0

$archive = New-Object System.IO.Compression.ZipArchive($memStream, [System.IO.Compression.ZipArchiveMode]::Update, $true)

$docEntry = $archive.GetEntry('word/document.xml')
$docStream = $docEntry.Open()
$docReader = New-Object System.IO.StreamReader($docStream, [System.Text.Encoding]::UTF8)
$docXml = $docReader.ReadToEnd()
$docReader.Dispose()
$docStream.Dispose()

Write-Output "Loaded XML, length: $($docXml.Length)"

$changesMade = 0

# Replace all instances of the old Anarchy values
# Pattern 1: "100% WD" or "100% Weapon Damage"
$replacements = @(
    @{ Old = '100% Weapon Damage over 10 seconds'; New = '2.40% Weapon Damage over 4.50 seconds' },
    @{ Old = '100% Weapon Damage over 10s'; New = '2.40% Weapon Damage over 4.50s' },
    @{ Old = '100% WD DoT over 10s'; New = '2.40% WD DoT over 4.50s' },
    @{ Old = 'within 25 meters'; New = 'within 12 meters' },
    @{ Old = 'within 25m'; New = 'within 12m' },
    @{ Old = 'within 25 m'; New = 'within 12 m' }
)

foreach ($r in $replacements) {
    $count = ([regex]::Matches($docXml, [regex]::Escape($r.Old))).Count
    if ($count -gt 0) {
        $docXml = $docXml.Replace($r.Old, $r.New)
        Write-Output "REPLACED ($count occurrences): '$($r.Old)' -> '$($r.New)'"
        $changesMade++
    } else {
        Write-Output "NOT FOUND: '$($r.Old)'"
    }
}

# Also fix any "100% WD" patterns specific to Anarchy context
# Look for patterns near "Anarchy" keyword  
$anarchyPattern = '100% WD DoT'
$count2 = ([regex]::Matches($docXml, [regex]::Escape($anarchyPattern))).Count
if ($count2 -gt 0) {
    $docXml = $docXml.Replace($anarchyPattern, '2.40% WD DoT')
    Write-Output "REPLACED ($count2): '$anarchyPattern' -> '2.40% WD DoT'"
    $changesMade++
} else {
    Write-Output "NOT FOUND: '$anarchyPattern'"
}

if ($changesMade -eq 0) {
    Write-Output "`nNo changes needed."
    $archive.Dispose()
    $memStream.Dispose()
    exit 0
}

Write-Output "`nWriting $changesMade update(s) back to docx..."

$docEntry.Delete()
$newEntry = $archive.CreateEntry('word/document.xml')
$newStream = $newEntry.Open()
$writer = New-Object System.IO.StreamWriter($newStream, [System.Text.Encoding]::UTF8)
$writer.Write($docXml)
$writer.Flush()
$writer.Dispose()
$newStream.Dispose()

$archive.Dispose()

$memStream.Position = 0
$outBytes = $memStream.ToArray()
[System.IO.File]::WriteAllBytes($docxPath, $outBytes)
$memStream.Dispose()

Write-Output "SUCCESS. Saved to: $docxPath"

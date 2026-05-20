Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$docxPath = Resolve-Path (Join-Path $PSScriptRoot '..\game_knowledge\game_knowledge.docx')

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

# ==========================================
# Find exact paragraph boundaries
# ==========================================

# The body occurrence of "18.28 Patches" is at 1760026
# Find the <w:p at or before that position - search backwards
$bodyPos1828 = 1760026
$paraStart1828 = $docXml.LastIndexOf('<w:p ', $bodyPos1828)
Write-Output "Para start for 18.28 body heading: $paraStart1828"

# Find the body occurrence of "18.29 Beginner Myth"
$search1829 = '18.29 Beginner Myth'
$idx1829a = $docXml.IndexOf($search1829)
$idx1829b = $docXml.IndexOf($search1829, $idx1829a + 1)
$bodyPos1829 = if ($idx1829b -gt 0) { $idx1829b } else { $idx1829a }
$paraStart1829 = $docXml.LastIndexOf('<w:p ', $bodyPos1829)
Write-Output "Para start for 18.29 body heading: $paraStart1829"

# Find the body occurrence of "18.28" last bullet (just before 18.29)
# to insert the new 1.2.1 entry
# Show what's between the two
Write-Output "`n--- Content between 18.28 and 18.29 (last 500 chars before 18.29 para) ---"
$snippet = $docXml.Substring($paraStart1828, $paraStart1829 - $paraStart1828)
Write-Output "Length of 18.28 section: $($snippet.Length)"
# Show last 800 chars of the 18.28 section
$snippetEnd = $snippet.Substring([Math]::Max(0, $snippet.Length - 800))
Write-Output $snippetEnd

# Also check Strawberry Milkshake in XML
$smSearch = 'Contagion DoT'
$smIdx = $docXml.IndexOf($smSearch)
Write-Output "`nStrawberry Milkshake 'Contagion DoT' at: $smIdx"
if ($smIdx -gt 0) {
    Write-Output $docXml.Substring([Math]::Max(0,$smIdx-100), [Math]::Min(600, $docXml.Length - $smIdx + 100))
}

$archive.Dispose()
$memStream.Dispose()

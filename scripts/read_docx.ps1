Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = Join-Path $PSScriptRoot '..\game_knowledge\game_knowledge.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Dispose()
$stream.Dispose()
$zip.Dispose()

# Strip XML tags to get plain text
$text = [regex]::Replace($xml, '<[^>]+>', ' ')
$text = [regex]::Replace($text, '\s+', ' ')

# Find the SECOND occurrence of 18.27 (body, not TOC)
$idx1 = $text.IndexOf('18.27 Confirmed Bugs')
$idx2 = $text.IndexOf('18.27 Confirmed Bugs', $idx1 + 1)

$targetIdx = if ($idx2 -gt 0) { $idx2 } else { $idx1 }
Write-Output "18.27 body at: $targetIdx"

# Find 18.28 body
$idx1b = $text.IndexOf('18.28 Patches')
$idx2b = $text.IndexOf('18.28 Patches', $idx1b + 1)
$targetIdx2 = if ($idx2b -gt 0) { $idx2b } else { $idx1b }
Write-Output "18.28 body at: $targetIdx2"

# Find Section 12 Exotic Weapons body
$idx12a = $text.IndexOf('12. Exotic Weapons')
$idx12b = $text.IndexOf('12. Exotic Weapons', $idx12a + 1)
$target12 = if ($idx12b -gt 0) { $idx12b } else { $idx12a }
Write-Output "Section 12 body at: $target12"

if ($targetIdx -gt 0) {
    Write-Output "`n--- 18.27 BUGS BODY ---"
    Write-Output $text.Substring($targetIdx, [Math]::Min(4000, $text.Length - $targetIdx))
}

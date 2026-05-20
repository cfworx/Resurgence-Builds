Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$docxPath = Resolve-Path (Join-Path $PSScriptRoot '..\game_knowledge\game_knowledge.docx')
$backupPath = $docxPath.Path -replace '\.docx$', '_backup_pre1.2.1.docx'

# Backup first
Copy-Item $docxPath $backupPath -Force
Write-Output "Backup created: $backupPath"

# Read the zip in memory
$zipBytes = [System.IO.File]::ReadAllBytes($docxPath)
$memStream = New-Object System.IO.MemoryStream
$memStream.Write($zipBytes, 0, $zipBytes.Length)
$memStream.Position = 0

$archive = New-Object System.IO.Compression.ZipArchive($memStream, [System.IO.Compression.ZipArchiveMode]::Update, $true)

# Read document.xml
$docEntry = $archive.GetEntry('word/document.xml')
$docStream = $docEntry.Open()
$docReader = New-Object System.IO.StreamReader($docStream, [System.Text.Encoding]::UTF8)
$docXml = $docReader.ReadToEnd()
$docReader.Dispose()
$docStream.Dispose()

Write-Output "Original XML length: $($docXml.Length)"

# ==========================================
# HELPER: Build a styled paragraph element
# ==========================================
function MakePara {
    param([string]$text, [string]$style = 'Normal', [bool]$bold = $false)
    $b = if ($bold) { '<w:b/><w:bCs/>' } else { '' }
    return @"
<w:p><w:pPr><w:pStyle w:val="$style"/></w:pPr><w:r><w:rPr>$b</w:rPr><w:t xml:space="preserve">$text</w:t></w:r></w:p>
"@
}

function MakeBullet {
    param([string]$text)
    # Use a simple indented paragraph with bullet character
    return @"
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; $text</w:t></w:r></w:p>
"@
}

# ==========================================
# UPDATE 1: Section 18.27 — Add new 1.2.1 bugs
# ==========================================
$new1827Bugs = @"
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [PATCH 1.2.1 - May 20, 2026] Inventory item disappearance when full - FIXED in 1.2.1. Edge cases may still exist; submit ticket if recurring.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [PATCH 1.2.1 - May 20, 2026] Vendor sell function broken for 3+ days post-Phase 2 - FIXED in 1.2.1 (fixed vendors not showing sellable items; fixed ability to sell locked/favored items).</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [PATCH 1.2.1 - May 20, 2026] Dark Zone vendor missing item-name text - FIXED in 1.2.1.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [PATCH 1.2.1 - May 20, 2026] Classified Ops Pass purchase not delivered; pass levels overcharged - FIXED in 1.2.1. Affected players must contact support via in-game button with transaction ID.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [PATCH 1.2.1 - May 20, 2026] Lone Wolf Challenge reset broken (wasn't refreshing every 3 weeks) - FIXED in 1.2.1.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [STILL ACTIVE as of 1.2.1] Gamepad support issues on iOS - Under investigation.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [STILL ACTIVE as of 1.2.1] Tactical Augmentation reward from Dark Zone quest cannot be claimed - Under investigation.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [STILL ACTIVE as of 1.2.1] Weapon proficiency blocked in some cases - Under investigation.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; [STILL ACTIVE as of 1.2.1] Some purchases still not received in-game - Under investigation; contact support.</w:t></w:r></w:p>
"@

# Find the 18.28 heading in the body (not TOC) to insert before it
# We look for the second occurrence of 18.28
$marker1828 = '18.28 Patches and Nerfs Timeline'
$idx1 = $docXml.IndexOf($marker1828)
$idx2 = $docXml.IndexOf($marker1828, $idx1 + 1)
$insertPoint1 = if ($idx2 -gt 0) { $idx2 } else { $idx1 }

# Walk back to find the start of the paragraph containing this text
$paraStart = $docXml.LastIndexOf('<w:p>', $insertPoint1)

Write-Output "Inserting new 18.27 bugs before position: $insertPoint1 (para at $paraStart)"

$docXml = $docXml.Substring(0, $paraStart) + $new1827Bugs + $docXml.Substring($paraStart)

# ==========================================
# UPDATE 2: Section 18.28 — Add Patch 1.2.1 to timeline
# ==========================================
$new1828Entry = @"
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Patch 1.2.1 (May 20, 2026): Hotfix targeting Phase 2 damage. Fixed: inventory disappearance, vendor sell bug, DZ vendor missing names, locked/favored item sell bug, Classified Ops Pass delivery failure, pass tier overcharging, Lone Wolf reset schedule, Anarchy talent description (Strawberry Milkshake), Weekly mission Exotic Manual/Booklet now drops SM recalibration material. Compensation: 500,000 Basic Credits + 750 Phoenix Credits mailed to all accounts. STILL BROKEN: Outpost Annihilation, iOS gamepad, some purchase delivery, DZ Tactical Aug reward, weapon proficiency block.</w:t></w:r></w:p>
"@

# Find 18.29 heading body (second occurrence) to insert before it
$marker1829 = '18.29 Beginner Myth Busts'
$idx1c = $docXml.IndexOf($marker1829)
$idx2c = $docXml.IndexOf($marker1829, $idx1c + 1)
$insertPoint2 = if ($idx2c -gt 0) { $idx2c } else { $idx1c }
$paraStart2 = $docXml.LastIndexOf('<w:p>', $insertPoint2)

Write-Output "Inserting 18.28 patch entry before position: $insertPoint2 (para at $paraStart2)"

$docXml = $docXml.Substring(0, $paraStart2) + $new1828Entry + $docXml.Substring($paraStart2)

# ==========================================
# UPDATE 3: Section 12 — Update Strawberry Milkshake entry
# ==========================================
# Find and update the Strawberry Milkshake row
$smOldNote = 'Contagion DoT - vampire tank synergy with Happy Survival'
$smNewNote = 'Contagion DoT - vampire tank synergy with Happy Survival. BUFF PENDING (1.2.1 confirmed Ubisoft reviewing underwhelming perks). Community-reported numbers: ~7,900 base bullet damage; Anarchy DoT ~38/tick (u/N43n1r4, May 17-18). Do NOT burn recalibration mats until buff lands. Acquisition: free Classified Ops Pass 1.2 track; TAM sold at DZ Vendor. Anarchy description bug fixed in 1.2.1. Weekly mission Exotic Manual now correctly drops SM recalibration material.'
$docXml = $docXml.Replace($smOldNote, $smNewNote)

# ==========================================
# UPDATE 4: Add Phase 2 Economy changes to a new section 18.37
# (append before end of body)
# ==========================================
$new1837Section = @"
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t>18.37 Patch 1.2.1 and Phase 2 Economy Updates (May 2026)</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr><w:r><w:t xml:space="preserve">Source: Official Patch Note 1.2.1 (May 20, 2026) and Phase 2 Launch Notes (May 12, 2026).</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t>Phase 2 Economy Changes (still active)</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Dark Zone Credits on skill mod dismantle buffed: Blue 10->15, Purple 50->75, Yellow 450->750 DZ Credits.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Tactical Augmentation Modules (weapon, gear, exotic) now dismantle into Encrypted Data instead of Clan Credits. Significant long-term economy upgrade for grinders.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Warlord added to Dark Zone Vendor (reliable acquisition path). CRITICAL: Switch to Vanguard or intended Firepower spec BEFORE purchasing to ensure rolls land on Firepower, not Engineering.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Strawberry Milkshake TAM added to DZ Vendor.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; +1 Exotic Weapon Enhancement Kit added to DZ Vendor stock.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Weekly Random Tactical Augmentation Module Crate added to DZ Vendor.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; +1 copy of regular Weapon and Gear TAMs added to Clan Vendor.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; 60 FPS support enabled on high-end devices (Snapdragon 8 Elite class and PC). PC can be uncapped via GameUserSettings.ini (FrameRateLimit=240.000000 already documented in 18.28).</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Brain Over Brawns OS bug fixed: was scaling off wrong stats. Now correctly applies.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t>Patch 1.2.1 Compensation (May 20, 2026)</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr><w:r><w:t xml:space="preserve">Universal compensation mailed to all accounts automatically (no claim button required):</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; 500,000 Basic Credits</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; 750 Phoenix Credits</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr><w:r><w:t xml:space="preserve">This is the largest blanket payout issued by Ubisoft Mobile for Division Resurgence to date.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t>Roadmap Confirmed (April 28, 2026)</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Content cadence: New Phase every 6 weeks; New Season every 4 months.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Phase 3 (June 2026): Scorpio exotic weapon (free on Classified Ops Pass 1.3), Freemen apparel set, Boombox weapon skin.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Season 2 (August 2026): Full PC launch on Ubisoft Connect; cross-progression from early access preserved; cross-platform play confirmed.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Season 3 (Winter 2026): Major story expansion. No mission/exotic/spec details released yet.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t>Phase 2 Active Events (for reference)</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Dark Zone Quest: May 12 - June 7, 2026</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Speedrun - OW Nest Derelict Store: May 29 - June 2, 2026</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Normal"/><w:ind w:left="720"/></w:pPr><w:r><w:t xml:space="preserve">&#x2022; Speedrun - MM06 Take the Castle: June 12 - June 16, 2026</w:t></w:r></w:p>
"@

# Insert before </w:body>
$bodyClose = '</w:body>'
$insertPoint3 = $docXml.LastIndexOf($bodyClose)
Write-Output "Inserting Section 18.37 at position: $insertPoint3"

$docXml = $docXml.Substring(0, $insertPoint3) + $new1837Section + $docXml.Substring($insertPoint3)

# ==========================================
# Write back to the zip
# ==========================================
$docEntry.Delete()
$newEntry = $archive.CreateEntry('word/document.xml')
$newStream = $newEntry.Open()
$writer = New-Object System.IO.StreamWriter($newStream, [System.Text.Encoding]::UTF8)
$writer.Write($docXml)
$writer.Flush()
$writer.Dispose()
$newStream.Dispose()

$archive.Dispose()

# Write to file
$memStream.Position = 0
$outBytes = $memStream.ToArray()
[System.IO.File]::WriteAllBytes($docxPath, $outBytes)
$memStream.Dispose()

Write-Output "SUCCESS: game_knowledge.docx updated with Patch 1.2.1 data"
Write-Output "New XML length: $($docXml.Length)"

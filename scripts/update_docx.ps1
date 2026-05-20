Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$docxPath = Resolve-Path (Join-Path $PSScriptRoot '..\game_knowledge\game_knowledge.docx')
$backupPath = $docxPath.Path -replace '\.docx$', '_backup_pre1.2.1.docx'

# Only backup if not already backed up
if (-not (Test-Path $backupPath)) {
    Copy-Item $docxPath $backupPath -Force
    Write-Output "Backup created: $backupPath"
} else {
    Write-Output "Backup already exists, skipping."
}

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

# ==========================================
# Helper: Build a bullet paragraph matching doc style
# Uses the same indent style as existing bullets: w:left="360" w:hanging="360"
# ==========================================
function BulletPara {
    param([string]$label, [string]$body)
    $labelXml = if ($label) {
        "<w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t xml:space=`"preserve`">$label </w:t></w:r>"
    } else { '' }
    return "<w:p><w:pPr><w:ind w:left=`"360`" w:hanging=`"360`"/></w:pPr><w:r><w:t xml:space=`"preserve`">&#x2022; </w:t></w:r>$labelXml<w:r><w:t xml:space=`"preserve`">$body</w:t></w:r></w:p>"
}

# ==========================================
# UPDATE 1: Add Patch 1.2.1 entry to end of Section 18.28
# Insert BEFORE the 18.29 heading paragraph (at position 1763023 in ORIGINAL)
# NOTE: After section 18.37 was already appended at end, 18.29 position shifted.
# We need to re-find 18.29 fresh.
# ==========================================

$search1829 = '18.29 Beginner Myth'
$idx1829a = $docXml.IndexOf($search1829)
$idx1829b = $docXml.IndexOf($search1829, $idx1829a + 1)
$bodyPos1829 = if ($idx1829b -gt 0) { $idx1829b } else { $idx1829a }
$paraStart1829 = $docXml.LastIndexOf('<w:p ', $bodyPos1829)
Write-Output "18.29 para start: $paraStart1829"

$patch121Entry = (BulletPara 'Patch 1.2.1 (May 20, 2026):' 'Hotfix. FIXED: inventory item disappearance when full (edge cases may still exist - submit ticket); vendor not showing sellable items; selling locked/favored items; DZ vendor missing item names; Classified Ops Pass not delivered after purchase; pass tiers costing more than listed price (affected players contact in-game support with transaction ID); Lone Wolf Challenge reset schedule (now refreshes every 3 weeks as intended); Anarchy talent description on Strawberry Milkshake (was showing wrong effect value); Weekly Mission Exotic Manual/Booklet now correctly drops SM recalibration material. STILL BROKEN (confirmed by Ubisoft in patch notes): Outpost Annihilation side mission (bugged since launch, low priority), iOS gamepad support, some purchases still not received, DZ Tactical Augmentation quest reward unclaimmable, weapon proficiency blocked in some cases. COMPENSATION: 500,000 Basic Credits + 750 Phoenix Credits mailed to all accounts automatically (no claim required). Largest blanket payout in game history.')

$docXml = $docXml.Substring(0, $paraStart1829) + $patch121Entry + $docXml.Substring($paraStart1829)
Write-Output "Inserted Patch 1.2.1 timeline entry before 18.29"

# ==========================================
# UPDATE 2: Add new bugs to Section 18.27
# Insert BEFORE the 18.28 heading paragraph. Re-find after previous insert shifted positions.
# ==========================================

$search1828 = '18.28 Patches and Nerfs Timeline'
$idx1828a = $docXml.IndexOf($search1828)
$idx1828b = $docXml.IndexOf($search1828, $idx1828a + 1)
$bodyPos1828 = if ($idx1828b -gt 0) { $idx1828b } else { $idx1828a }
$paraStart1828 = $docXml.LastIndexOf('<w:p ', $bodyPos1828)
Write-Output "18.28 para start (after prior insert): $paraStart1828"

$newBugs1827 = `
    (BulletPara '[1.2.1 FIXED]' 'Inventory item disappearance when inventory full - resolved in Patch 1.2.1. Edge cases possible; screenshot your inventory regularly and submit a ticket if it recurs.') +
    (BulletPara '[1.2.1 FIXED]' 'Vendor sell function broken (3+ days post-Phase 2) - vendors now correctly show sellable items; selling locked/favored items blocked properly.') +
    (BulletPara '[1.2.1 FIXED]' 'Dark Zone vendor missing item-name text - resolved.') +
    (BulletPara '[1.2.1 FIXED]' 'Classified Ops Pass purchase not delivered / pass levels overcharged - resolved. If still affected: contact in-game support with your transaction ID.') +
    (BulletPara '[1.2.1 FIXED]' 'Lone Wolf Challenge reset broken (was not refreshing every 3 weeks) - resolved.') +
    (BulletPara '[STILL ACTIVE 1.2.1]' 'iOS gamepad support issues - under investigation. Do not recommend iOS gamepad builds.') +
    (BulletPara '[STILL ACTIVE 1.2.1]' 'Dark Zone Tactical Augmentation quest reward cannot be claimed - under investigation.') +
    (BulletPara '[STILL ACTIVE 1.2.1]' 'Weapon proficiency blocked in some cases - under investigation. Workaround: log into PC client once if on iOS (see existing 18.27 entry).') +
    (BulletPara '[STILL ACTIVE 1.2.1]' 'Some purchases still not received in-game - under investigation; contact support with transaction ID.')

$docXml = $docXml.Substring(0, $paraStart1828) + $newBugs1827 + $docXml.Substring($paraStart1828)
Write-Output "Inserted new 1.2.1 bug entries before 18.28"

# ==========================================
# UPDATE 3: Update Strawberry Milkshake table cell
# The exact string we target is inside a <w:t> element
# ==========================================

$smOld = '<w:t>Contagion DoT - vampire tank synergy with Happy Survival</w:t>'
$smNew = '<w:t xml:space="preserve">Contagion DoT - vampire tank synergy with Happy Survival. BUFF PENDING (Patch 1.2.1 - Ubisoft officially confirmed perks are underwhelming and under review for buff). Community-reported stats (u/N43n1r4, May 17-18, unverified): base bullet ~7,900 dmg; Anarchy DoT ~38 dmg/tick. Do NOT spend recalibration materials until buff lands. Acquisition: free Classified Ops Pass 1.2 track (Tier 5 free track); Tactical Augmentation Module available at DZ Vendor. Anarchy description bug fixed in 1.2.1 (was showing wrong effect value).</w:t>'

if ($docXml.Contains($smOld)) {
    $docXml = $docXml.Replace($smOld, $smNew)
    Write-Output "Updated Strawberry Milkshake entry in Section 12 table"
} else {
    Write-Output "WARNING: Could not find exact SM string to replace - manual check needed"
}

# ==========================================
# UPDATE 4: Add Section 18.37 (new section) BEFORE </w:body>
# ==========================================

# Check if 18.37 already exists from previous run
if ($docXml.Contains('18.37 Patch 1.2.1')) {
    Write-Output "Section 18.37 already exists, skipping."
} else {
    $section1837 = @"
<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>18.37 Patch 1.2.1 and Phase 2 Economy Updates (May 2026)</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>Phase 2 Economy Changes (Active Since May 12, 2026)</w:t></w:r></w:p>
$(BulletPara 'DZ Credit dismantle buff:' 'Skill mod dismantle DZ Credits increased: Blue 10->15, Purple 50->75, Yellow 450->750.')
$(BulletPara 'TAM dismantle economy:' 'Weapon, Gear, and Exotic Tactical Augmentation Modules now dismantle into Encrypted Data (not Clan Credits). Significant long-term buff for grinders.')
$(BulletPara 'Warlord in DZ Vendor:' 'Reliable acquisition path for the Warlord exotic AR. CRITICAL RULE: Switch to Vanguard or your target Firepower spec BEFORE purchasing. Buy while in wrong spec = Engineering rolls, not Firepower. See Section 18.36.6 for full acquisition rule.')
$(BulletPara 'SM TAM in DZ Vendor:' 'Strawberry Milkshake Tactical Augmentation Module available at Dark Zone Vendor.')
$(BulletPara '+1 Exotic Weapon Enhancement Kit:' 'Added to DZ Vendor stock (Phase 2 onwards).')
$(BulletPara 'Weekly Random TAM Crate:' 'Added to DZ Vendor - weekly crate with random Tactical Augmentation Module.')
$(BulletPara 'Clan Vendor:' '+1 copy of regular Weapon and Gear TAMs added to Clan Vendor stock.')
$(BulletPara '60 FPS unlock:' 'High-end devices (Snapdragon 8 Elite class) and PC can now run at up to 60 FPS via expanded graphics settings. PC can be uncapped to 240fps via GameUserSettings.ini (FrameRateLimit=240.000000 under [/Script/TheDivision.TDGameUserSettings]).')
$(BulletPara 'Brain Over Brawns OS fix:' 'Was scaling off the wrong stats in some situations. Now correctly applies. Rebuild any BoB builds that were previously benchmarked - numbers may differ.')
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>Patch 1.2.1 Compensation (May 20, 2026)</w:t></w:r></w:p>
<w:p><w:r><w:t xml:space="preserve">All accounts receive automatically via in-game mail (no claim button required):</w:t></w:r></w:p>
$(BulletPara '500,000 Basic Credits' '')
$(BulletPara '750 Phoenix Credits' '')
<w:p><w:r><w:t xml:space="preserve">This is the largest blanket compensation issued in Division Resurgence to date.</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>Classified Ops Pass 1.2 Content (Phase 2)</w:t></w:r></w:p>
$(BulletPara 'Strawberry Milkshake:' 'Free Exotic LMG on the pass track (Tier 5 free track). BUFF PENDING - see Section 12 update.')
$(BulletPara 'Hot Rod:' 'Superior weapon skin included in the pass.')
$(BulletPara 'Pyromaniac:' 'Apparel set included in the pass.')
$(BulletPara 'Cosmetic Draw Sets added:' 'Eradication Exotic Weapon Skin + Battle-worn Metal Skin Set; Special Forces Apparel + Battle-Hardened Weapon Skin Set; Ken Ito Apparel + Rikers Unchained Weapon Skin Set.')
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>Confirmed Roadmap (April 28, 2026)</w:t></w:r></w:p>
$(BulletPara 'Cadence:' 'New Phase every 6 weeks; New Season every 4 months.')
$(BulletPara 'Phase 3 (June 2026):' 'Scorpio exotic weapon (free on Classified Ops Pass 1.3); Freemen apparel set; Boombox weapon skin. Build posts will follow on Scorpio once numbers are known.')
$(BulletPara 'Season 2 (August 2026):' 'Full PC launch on Ubisoft Connect. Cross-progression from early access preserved. Cross-platform play confirmed.')
$(BulletPara 'Season 3 (Winter 2026):' 'Major story expansion. No mission, exotic, or spec details released yet.')
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>Phase 2 Active Event Schedule</w:t></w:r></w:p>
$(BulletPara 'Dark Zone Quest:' 'May 12 - June 7, 2026.')
$(BulletPara 'Speedrun - OW Nest Derelict Store:' 'May 29 - June 2, 2026.')
$(BulletPara 'Speedrun - MM06 Take the Castle:' 'June 12 - June 16, 2026.')
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>Strawberry Milkshake Build Guidance (Hold Until Buff)</w:t></w:r></w:p>
<w:p><w:r><w:t xml:space="preserve">Do NOT spend recalibration materials on Strawberry Milkshake until the buff lands. Farm Weekly Mission Exotic Manuals/Booklets to stockpile SM recalibration material now (fixed in 1.2.1 to correctly drop). When buff numbers are confirmed, we will publish a dedicated SM build post.</w:t></w:r></w:p>
<w:p><w:r><w:t xml:space="preserve">Community-reported base stats (unverified, u/N43n1r4 May 17-18): one bullet ~7,900 dmg; Anarchy DoT ~38 dmg/tick; DoT reportedly spreads to nearby enemies on kill (similar to Division 2 Pestilence). These numbers are DIRECTIONAL only - do not base a build on them until official buff values are published.</w:t></w:r></w:p>
"@

    $bodyClose = '</w:body>'
    $insertPoint = $docXml.LastIndexOf($bodyClose)
    $docXml = $docXml.Substring(0, $insertPoint) + $section1837 + $docXml.Substring($insertPoint)
    Write-Output "Added Section 18.37"
}

# ==========================================
# Write back
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

$memStream.Position = 0
$outBytes = $memStream.ToArray()
[System.IO.File]::WriteAllBytes($docxPath, $outBytes)
$memStream.Dispose()

Write-Output "SUCCESS. Final XML length: $($docXml.Length)"
Write-Output "Saved to: $docxPath"

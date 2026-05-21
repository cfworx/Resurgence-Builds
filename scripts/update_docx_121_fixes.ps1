# update_docx_121_fixes.ps1
# Adds Patch 1.2.1 information to game_knowledge.docx
# - Section 18.27: Bug fix status updates
# - Section 18.28: Patch 1.2.1 timeline entry
# - Section 12:    Strawberry Milkshake table cell update + Scorpio placeholder
# All operations are idempotent (safe to re-run)

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

# ==========================================
# Helper: Build a bullet paragraph matching doc style
# ==========================================
function BulletPara {
    param([string]$label, [string]$body)
    $labelXml = if ($label) {
        "<w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t xml:space=`"preserve`">$label </w:t></w:r>"
    } else { '' }
    return "<w:p><w:pPr><w:ind w:left=`"360`" w:hanging=`"360`"/></w:pPr><w:r><w:t xml:space=`"preserve`">&#x2022; </w:t></w:r>$labelXml<w:r><w:t xml:space=`"preserve`">$body</w:t></w:r></w:p>"
}

# ==========================================
# UPDATE 1: Add Patch 1.2.1 entry to Section 18.28 (before 18.29)
# Guard: Check if already added
# ==========================================

if ($docXml.Contains('Patch 1.2.1 (May 20, 2026)')) {
    Write-Output "SKIP: Patch 1.2.1 timeline entry already exists in 18.28"
} else {
    $search1829 = '18.29 Beginner Myth'
    $idx1829a = $docXml.IndexOf($search1829)
    if ($idx1829a -lt 0) {
        Write-Output "WARNING: Could not find 18.29 heading - skipping 18.28 update"
    } else {
        $idx1829b = $docXml.IndexOf($search1829, $idx1829a + 1)
        $bodyPos1829 = if ($idx1829b -gt 0) { $idx1829b } else { $idx1829a }
        $paraStart1829 = $docXml.LastIndexOf('<w:p ', $bodyPos1829)

        $patch121Entry = (BulletPara 'Patch 1.2.1 (May 20, 2026):' 'Hotfix. FIXED: inventory item disappearance when full (edge cases may still exist); vendor not showing sellable items; selling locked/favored items; DZ vendor missing item names; Classified Ops Pass not delivered after purchase; pass tiers overcharged (affected players contact in-game support with transaction ID); Lone Wolf Challenge reset schedule (now refreshes every 3 weeks); Anarchy talent description on Strawberry Milkshake (was showing wrong effect value); Weekly Mission Exotic Manual/Booklet now correctly drops SM recalibration material. STILL BROKEN: Outpost Annihilation (since launch), iOS gamepad support, some purchases not received, DZ TAM quest reward unclaimable, weapon proficiency blocked in some cases. COMPENSATION: 500,000 Basic Credits + 750 Phoenix Credits mailed to all accounts (largest blanket payout in game history).')

        $docXml = $docXml.Substring(0, $paraStart1829) + $patch121Entry + $docXml.Substring($paraStart1829)
        Write-Output "ADDED: Patch 1.2.1 timeline entry to 18.28"
        $changesMade++
    }
}

# ==========================================
# UPDATE 2: Add 1.2.1 bug status updates to Section 18.27 (before 18.28)
# Guard: Check if already added
# ==========================================

if ($docXml.Contains('[1.2.1 FIXED]')) {
    Write-Output "SKIP: 1.2.1 bug entries already exist in 18.27"
} else {
    $search1828 = '18.28 Patches and Nerfs Timeline'
    $idx1828a = $docXml.IndexOf($search1828)
    if ($idx1828a -lt 0) {
        Write-Output "WARNING: Could not find 18.28 heading - skipping 18.27 update"
    } else {
        $idx1828b = $docXml.IndexOf($search1828, $idx1828a + 1)
        $bodyPos1828 = if ($idx1828b -gt 0) { $idx1828b } else { $idx1828a }
        $paraStart1828 = $docXml.LastIndexOf('<w:p ', $bodyPos1828)

        $newBugs1827 = `
            (BulletPara '[1.2.1 FIXED]' 'Inventory item disappearance when inventory full - resolved in Patch 1.2.1. Edge cases possible; screenshot your inventory regularly and submit a ticket if it recurs.') +
            (BulletPara '[1.2.1 FIXED]' 'Vendor sell function broken (3+ days post-Phase 2) - vendors now correctly show sellable items; selling locked/favored items blocked properly.') +
            (BulletPara '[1.2.1 FIXED]' 'Dark Zone vendor missing item-name text - resolved.') +
            (BulletPara '[1.2.1 FIXED]' 'Classified Ops Pass purchase not delivered / pass levels overcharged - resolved. If still affected: contact in-game support with your transaction ID.') +
            (BulletPara '[1.2.1 FIXED]' 'Lone Wolf Challenge reset broken (was not refreshing every 3 weeks) - resolved.') +
            (BulletPara '[1.2.1 FIXED]' 'Anarchy talent description on Strawberry Milkshake was showing wrong effect value - now displays correct numbers.') +
            (BulletPara '[STILL ACTIVE 1.2.1]' 'iOS gamepad support issues - under investigation. Do not recommend iOS gamepad builds.') +
            (BulletPara '[STILL ACTIVE 1.2.1]' 'Dark Zone Tactical Augmentation quest reward cannot be claimed - under investigation.') +
            (BulletPara '[STILL ACTIVE 1.2.1]' 'Weapon proficiency blocked in some cases - under investigation.') +
            (BulletPara '[STILL ACTIVE 1.2.1]' 'Some purchases still not received in-game - under investigation; contact support with transaction ID.') +
            (BulletPara '[STILL ACTIVE 1.2.1]' 'Warlord proficiency wiping on some accounts (iOS especially) - community-reported, under investigation.')

        $docXml = $docXml.Substring(0, $paraStart1828) + $newBugs1827 + $docXml.Substring($paraStart1828)
        Write-Output "ADDED: 1.2.1 bug status entries to 18.27"
        $changesMade++
    }
}

# ==========================================
# UPDATE 3: Update Strawberry Milkshake table cell in Section 12
# Guard: Check if already updated
# ==========================================

$smOld = '<w:t>Contagion DoT - vampire tank synergy with Happy Survival</w:t>'
$smNew = '<w:t xml:space="preserve">Contagion DoT - vampire tank synergy with Happy Survival. BUFF PENDING (Patch 1.2.1 confirmed perks are underwhelming, under review). Community stats (u/N43n1r4, May 17-18, unverified): base bullet ~7,900 dmg; Anarchy DoT ~38 dmg/tick (effectively non-functional as DPS contribution). DoT reportedly spreads to nearby enemies on kill (Pestilence-style contagion). Do NOT spend recalibration materials until buff lands. Farm Weekly Mission Exotic Manuals now to stockpile SM recal mats (fixed in 1.2.1 to correctly drop). Friendly fire bug: SM DoT also applies to teammates when healing them - do not use on healers.</w:t>'

if ($docXml.Contains($smOld)) {
    $docXml = $docXml.Replace($smOld, $smNew)
    Write-Output "UPDATED: Strawberry Milkshake entry in Section 12 table"
    $changesMade++
} elseif ($docXml.Contains('BUFF PENDING')) {
    Write-Output "SKIP: Strawberry Milkshake already updated (contains BUFF PENDING)"
} else {
    Write-Output "WARNING: Could not find Strawberry Milkshake table cell text - manual check needed"
}

# ==========================================
# UPDATE 4: Add Scorpio exotic placeholder to Section 12 table
# Guard: Check if already exists
# ==========================================

if ($docXml.Contains('Scorpio')) {
    Write-Output "SKIP: Scorpio entry already exists in document"
} else {
    # Find the Section 13 heading to insert before it
    $search13 = '13. Spec Talents'
    $idx13a = $docXml.IndexOf($search13)
    if ($idx13a -lt 0) {
        Write-Output "WARNING: Could not find Section 13 heading - skipping Scorpio insert"
    } else {
        $idx13b = $docXml.IndexOf($search13, $idx13a + 1)
        $bodyPos13 = if ($idx13b -gt 0) { $idx13b } else { $idx13a }
        $paraStart13 = $docXml.LastIndexOf('<w:p ', $bodyPos13)

        # Build a simple text block for Scorpio (not a table row, but a paragraph note)
        $scorpioNote = "<w:p><w:pPr><w:ind w:left=`"360`" w:hanging=`"360`"/></w:pPr><w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t xml:space=`"preserve`">Scorpio (INCOMING Phase 3 - June 2026): </w:t></w:r><w:r><w:t xml:space=`"preserve`">Free exotic on Classified Ops Pass 1.3. No talent/stat data available yet. Community notes: was S-tier in Division 2 (stagger king). Watch for data on release. Will be the 4th confirmed exotic.</w:t></w:r></w:p>"

        $docXml = $docXml.Substring(0, $paraStart13) + $scorpioNote + $docXml.Substring($paraStart13)
        Write-Output "ADDED: Scorpio exotic placeholder to Section 12"
        $changesMade++
    }
}

# ==========================================
# UPDATE 5: Add build-relevant insight about Warlord DZ vendor spec-switching
# to Section 16 (What's Been Built So Far) area
# Guard: Check if already exists
# ==========================================

if ($docXml.Contains('switch to Vanguard or your intended Firepower spec BEFORE buying')) {
    Write-Output "SKIP: Warlord DZ vendor spec-switching tip already exists"
} else {
    # Add after 18.37 section or at end - find the right place
    # Actually this is already in 18.37. Let's add a build note after Section 16 instead.
    $search17 = '17. Final Checklist'
    $idx17a = $docXml.IndexOf($search17)
    if ($idx17a -lt 0) {
        Write-Output "WARNING: Could not find Section 17 heading - skipping Warlord tip"
    } else {
        $idx17b = $docXml.IndexOf($search17, $idx17a + 1)
        $bodyPos17 = if ($idx17b -gt 0) { $idx17b } else { $idx17a }
        $paraStart17 = $docXml.LastIndexOf('<w:p ', $bodyPos17)

        $warlordTip = `
            (BulletPara 'Warlord acquisition tip (Phase 2+):' 'Warlord exotic AR is now available at the Dark Zone Vendor. CRITICAL: switch to Vanguard or your intended Firepower spec BEFORE buying so the rolls land on Firepower, not Engineering. If you buy while in an Engineering spec, you get Engineering-rolled Warlord. This cannot be recalibrated away.') +
            (BulletPara 'Strawberry Milkshake recalibration farming:' 'Weekly Mission Exotic Manual/Booklet drops now correctly award SM recalibration material (fixed in 1.2.1). Farm these now and stockpile. When the buff lands, you want to be ready to recalibrate immediately.') +
            (BulletPara 'DZ economy note (Phase 2):' 'Skill mod dismantle DZ Credits buffed (Blue 10->15, Purple 50->75, Yellow 450->750). TAM dismantle now gives Encrypted Data instead of Clan Credits. Both are significant long-term economy improvements for regular DZ grinders.')

        $docXml = $docXml.Substring(0, $paraStart17) + $warlordTip + $docXml.Substring($paraStart17)
        Write-Output "ADDED: Warlord acquisition tip, SM farming note, and DZ economy note after Section 16"
        $changesMade++
    }
}

# ==========================================
# Write back (only if changes were made)
# ==========================================

if ($changesMade -eq 0) {
    Write-Output "`nNo changes needed - document is already up to date."
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

Write-Output "SUCCESS. Final XML length: $($docXml.Length)"
Write-Output "Saved to: $docxPath"

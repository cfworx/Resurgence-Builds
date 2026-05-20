# Append Build Authoring Rules to game_knowledge.docx via Word COM
$docPath = "C:\Users\cfwor\OneDrive\Documents\projects\resurgence-builds\game_knowledge\game_knowledge.docx"

$word = New-Object -ComObject Word.Application
$word.Visible = $false

try {
    $doc = $word.Documents.Open($docPath)
    $range = $doc.Content
    $range.Collapse([Microsoft.Office.Interop.Word.WdCollapseDirection]::wdCollapseEnd)

    # --- Section header ---
    $range.InsertParagraphAfter()
    $range = $doc.Content
    $range.Collapse(0) # wdCollapseEnd

    $range.InsertParagraphAfter()
    $range = $doc.Content; $range.Collapse(0)
    $range.Text = "Build Authoring Rules (AI Content Standards)"
    $range.Style = $doc.Styles.Item("Heading 1")
    $range.InsertParagraphAfter()

    # Helper function to add a normal paragraph
    function Add-Para($text) {
        $r = $doc.Content; $r.Collapse(0)
        $r.Text = $text
        $r.Style = $doc.Styles.Item("Normal")
        $r.InsertParagraphAfter()
    }

    function Add-Heading2($text) {
        $r = $doc.Content; $r.Collapse(0)
        $r.Text = $text
        $r.Style = $doc.Styles.Item("Heading 2")
        $r.InsertParagraphAfter()
    }

    function Add-Heading3($text) {
        $r = $doc.Content; $r.Collapse(0)
        $r.Text = $text
        $r.Style = $doc.Styles.Item("Heading 3")
        $r.InsertParagraphAfter()
    }

    Add-Para "These rules are derived from errors discovered during the 2026-05-19 audit of all published build guides. They are mandatory checks before any build post is written or published."

    # Rule 8
    Add-Heading2 "Rule 8 - Gear Set Bonus Tier Verification (added 2026-05-19)"
    Add-Para "Every gear set bonus cited in a build post must match the piece count actually slotted in that build's Full Loadout table."
    Add-Para "Gear set bonuses are tiered: 2pc, 3pc, and 4pc unlock sequentially."
    Add-Para "If a build slots 2pc, only the 2pc bonus is active. The 3pc and 4pc bonuses DO NOT apply."
    Add-Para "If a build slots 4pc, all three tier bonuses are active (2pc + 3pc + 4pc). You may cite all of them, but LABEL EACH BONUS WITH ITS CORRECT TIER (e.g., 'Jackpot 3pc: +10.8% Skill CHC' not 'Jackpot 4pc: +10.8% Skill CHC')."

    Add-Heading3 "Errors found in 2026-05-19 audit:"
    Add-Para "1. Demolitionist Explosive Chaos: Cited Jackpot 3pc bonus (+10.8% Skill CHC) as 'the 4pc bonus' with wrong value (+10%). Corrected to separate 3pc/4pc labels."
    Add-Para "2. Legendary Healer: Labeled Captain Cow 3pc bonus (+14.4% Skill Duration) as 'Captain Cow 4pc'. Corrected label."
    Add-Para "3. Tech Op Flashbang Salesman: Lumped Jackpot 3pc and 4pc bonuses under a single '4pc' label. Split into correct per-tier labels."

    # Rule 9
    Add-Heading2 "Rule 9 - Talent Value Accuracy (added 2026-05-19)"
    Add-Para "All talent bonus values cited in build posts must match the exact numbers in the data files (src/data/body-armor-talents.json, backpack-talents.json, weapon-talents.json, os-protocols.json, gear-set-effects.json)."

    Add-Heading3 "Error found in 2026-05-19 audit:"
    Add-Para "Cover Shooter Sniper: Glass Cannon cited as '+25% Weapon Damage / -30% DR'. Correct value: +20% Damage / -10% Damage Reduction."

    # Reference table header
    Add-Heading2 "Reference: Complete Gear Set Bonus Table"
    Add-Para "This table is the ground truth for all gear set bonus claims in build posts. Source: src/data/gear-set-effects.json"

    # Build the table: 17 rows (1 header + 16 sets), 4 columns
    $tableRange = $doc.Content
    $tableRange.Collapse(0)
    $table = $doc.Tables.Add($tableRange, 17, 4)
    $table.Borders.Enable = $true
    $table.Style = "Table Grid"

    # Header row
    $table.Cell(1,1).Range.Text = "Set"
    $table.Cell(1,2).Range.Text = "2pc"
    $table.Cell(1,3).Range.Text = "3pc"
    $table.Cell(1,4).Range.Text = "4pc"
    $table.Rows.Item(1).Range.Bold = $true

    # Data rows
    $sets = @(
        @("Fury Strike", "+10% Optimal Range", "+10.8% WCHC", "+24% WCHD"),
        @("Quick Draw", "+12% Reload Speed", "+27% Mag Size", "+28.8% HSD"),
        @("Phalanx Attack", "+18% Mag Size", "+18% Rate of Fire", "+12% Multi-Shot"),
        @("One Shot One Kill", "+24% Accuracy", "+21.6% HSD", "+18% Firepower"),
        @("Gunny Johnny", "+12% Rate of Fire", "+18% Reload Speed", "+12% Weapon Damage"),
        @("Mechanical Enemy", "+7.2% WCHC", "+15% Optimal Range", "-12% Skill CDR"),
        @("Jackpot", "+12% Skill Radius", "+10.8% Skill CHC", "+24% Skill CHD"),
        @("Long-term Effect", "+12% Skill Health", "+14.4% Skill Duration", "+18% Engineering"),
        @("Dr. Medic", "+10% Healing Intensity", "+9% Skill Intensity", "+20% Release Extra Protection"),
        @("Boom-Shakalaka", "-6% Skill CDR", "+18% Skill Radius", "+12% Skill Intensity"),
        @("Fire Cycle", "+12% Skill CHD", "+18% SAC Efficiency", "+12% Skill Multi-Shot"),
        @("Mechanical Expert", "+9.6% Skill Duration", "-9% Skill CDR", "+24% SAC Efficiency"),
        @("Captain Cow", "+3.6% Move Speed", "+14.4% Skill Duration", "+20% Healing Intensity"),
        @("Healing Elites", "+14.4% Received Healing", "+15% Release Extra Prot.", "+28% Armor"),
        @("Self-Propelled Shield", "+14% Armor", "+5.4% Move Speed", "+24% Max Health"),
        @("Fearless Warrior", "+6% Damage Reduction", "+9% Damage Bonus", "+18% Toughness")
    )

    for ($i = 0; $i -lt $sets.Count; $i++) {
        $row = $i + 2
        $table.Cell($row, 1).Range.Text = $sets[$i][0]
        $table.Cell($row, 2).Range.Text = $sets[$i][1]
        $table.Cell($row, 3).Range.Text = $sets[$i][2]
        $table.Cell($row, 4).Range.Text = $sets[$i][3]
    }

    $doc.Save()
    Write-Host "Successfully appended Build Authoring Rules to game_knowledge.docx"
}
catch {
    Write-Host "ERROR: $_"
}
finally {
    if ($doc) { $doc.Close() }
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}

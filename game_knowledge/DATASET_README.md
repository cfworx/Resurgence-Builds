# Division Resurgence Community Knowledge Base
## Dataset README & AI Ingestion Guide

**Source:** r/thedivisionresurgence (Reddit)  
**Date Range:** February 16, 2026 – May 18, 2026 (~90 days)  
**Compiled:** 2026-05-19  
**Game:** Tom Clancy's The Division Resurgence (mobile)

---

## Contents

| File | Description | Size |
|------|-------------|------|
| `division_resurgence_threads.jsonl` | Full structured data — every post + all comments, one JSON object per line | ~9.5 MB |
| `division_resurgence_kb.md` | Human + AI readable Markdown — organized by topic/flair, top threads per category | ~0.5 MB |
| `division_resurgence_qa.md` | Distilled Q&A — top 500 high-engagement threads with best community answers | ~0.9 MB |

---

## Dataset Statistics

| Metric | Count |
|--------|-------|
| Total posts | 3,527 |
| Total comments | 30,048 |
| Posts with comments | 2,905 |
| Estimated total words | ~931,000 |
| Unique flair categories | 15 |

---

## Topic Breakdown (by flair)

| Flair | Posts |
|-------|-------|
| Question | 1420 |
| Discussion | 681 |
| General | 598 |
| Bug Report | 171 |
| Weapon And Gear Help | 155 |
| Suggestion | 138 |
| Builds | 98 |
| Media | 76 |
| Guide | 60 |
| Humor | 54 |
| PSA | 33 |
| Megathread | 27 |
| Custom Removal Reason | 8 |
| Dev Team | 6 |
| Rule 7: LFG | 2 |

---

## JSONL Schema (division_resurgence_threads.jsonl)

Each line is a valid JSON object with this structure:

```json
{
  "post_id": "string",
  "title": "string",
  "author": "string (Reddit username)",
  "date": "YYYY-MM-DD",
  "score": "integer (upvotes)",
  "upvote_ratio": "float (0.0–1.0)",
  "num_comments": "integer",
  "flair": "string (topic category)",
  "url": "string (full Reddit URL)",
  "body": "string (post text, may be empty for image/link posts)",
  "comments": [
    {
      "id": "string",
      "author": "string",
      "score": "integer",
      "date": "YYYY-MM-DD",
      "body": "string",
      "parent_id": "string (t1_COMMENTID or t3_POSTID)"
    }
  ]
}
```

---

## Recommended AI Usage Patterns

### 1. RAG / Vector Embedding
- Use `division_resurgence_threads.jsonl` — embed each thread as a unit
- Recommended chunking: one document per thread (title + body + top 5 comments concatenated)
- Metadata fields for filtering: `flair`, `date`, `score`, `num_comments`

### 2. Fine-tuning / Instruction Tuning
- Use `division_resurgence_qa.md` — already formatted as context + Q&A pairs
- Focus on threads with `score >= 10` and `num_comments >= 5` for highest signal

### 3. Direct Context Injection
- Use `division_resurgence_kb.md` for structured topic context
- Feed specific flair sections based on user query topic

### 4. Knowledge Graph / Topic Extraction
- Cluster by `flair` field for topic nodes
- Link by `parent_id` chains in comments for reply trees
- High-upvote comments = community-validated answers

---

## Key Topics Covered (from community data)

Based on flair and post analysis, this dataset covers:

- **Gameplay Questions** — mechanics, controls, missions, open world
- **Build Theory** — weapons, gear, talents, optimization
- **Bug Reports** — known issues, platform-specific bugs, workarounds
- **Game Updates** — patch notes reactions, content releases, developer posts
- **Weapon & Gear Help** — specific weapon comparisons, gear rolls
- **Suggestions** — community wishlist, QoL feedback
- **Guides** — player-written tutorials, tips
- **Dark Zone** — PvPvE mechanics, strategies
- **Humor / Memes** — community culture and sentiment
- **PSA** — important player announcements
- **Megathreads** — consolidated discussion on major topics

---

## Notes

- Deleted/removed post bodies appear as empty strings (`""`)
- Deleted authors appear as `"[deleted]"`
- Comments are sorted by score (highest first) within each thread
- Image-only posts have empty `body` fields

---

## Build Authoring Rules (AI Content Standards)

These rules are derived from errors discovered during the 2026-05-19 audit of all published build guides. They are **mandatory checks** before any build post is written or published.

### Rule 8 — Gear Set Bonus Tier Verification *(added 2026-05-19)*

Every gear set bonus cited in a build post **must match the piece count actually slotted in that build's Full Loadout table.**

- Gear set bonuses are tiered: 2pc, 3pc, and 4pc unlock sequentially.
- If a build slots **2pc**, only the 2pc bonus is active. The 3pc and 4pc bonuses **do not apply**.
- If a build slots **4pc**, all three tier bonuses are active (2pc + 3pc + 4pc). You may cite all of them, but **label each bonus with its correct tier** (e.g., "Jackpot 3pc: +10.8% Skill CHC" not "Jackpot 4pc: +10.8% Skill CHC").

**Errors found and corrected in 2026-05-19 audit:**

| Build | Error | Fix |
|---|---|---|
| Demolitionist Explosive Chaos | Cited Jackpot's 3pc bonus (+10.8% Skill CHC) as "the 4pc bonus" with wrong value (+10%) | Corrected to "Jackpot 3pc + 4pc: +10.8% Skill CHC (3pc) and +24% Skill CHD (4pc)" |
| Legendary Healer | Labeled Captain Cow 3pc bonus (+14.4% Skill Duration) as "Captain Cow 4pc" | Corrected label to "Captain Cow 3pc" |
| Tech Op Flashbang Salesman | Labeled Jackpot 3pc bonus as "Jackpot 4pc: +10.8% Skill CHC, +24% Skill CHD" | Split into correct per-tier labels |

### Rule 9 — Talent Value Accuracy *(added 2026-05-19)*

All talent bonus values cited in build posts **must match the exact numbers in the data files** (`src/data/body-armor-talents.json`, `backpack-talents.json`, `weapon-talents.json`, `os-protocols.json`).

**Error found and corrected in 2026-05-19 audit:**

| Build | Error | Correct Value |
|---|---|---|
| Cover Shooter Sniper | Glass Cannon cited as "+25% Weapon Damage / −30% DR" | Glass Cannon = **+20% Damage / −10% Damage Reduction** |

### Reference: Gear Set Bonus Table

| Set | 2pc | 3pc | 4pc |
|---|---|---|---|
| Fury Strike | +10% Optimal Range | +10.8% WCHC | +24% WCHD |
| Quick Draw | +12% Reload Speed | +27% Mag Size | +28.8% HSD |
| Phalanx Attack | +18% Mag Size | +18% Rate of Fire | +12% Multi-Shot |
| One Shot One Kill | +24% Accuracy | +21.6% HSD | +18% Firepower |
| Gunny Johnny | +12% Rate of Fire | +18% Reload Speed | +12% Weapon Damage |
| Mechanical Enemy | +7.2% WCHC | +15% Optimal Range | −12% Skill CDR |
| Jackpot | +12% Skill Radius | +10.8% Skill CHC | +24% Skill CHD |
| Long-term Effect | +12% Skill Health | +14.4% Skill Duration | +18% Engineering |
| Dr. Medic | +10% Healing Intensity | +9% Skill Intensity | +20% Release Extra Protection |
| Boom-Shakalaka | −6% Skill CDR | +18% Skill Radius | +12% Skill Intensity |
| Fire Cycle | +12% Skill CHD | +18% SAC Efficiency | +12% Skill Multi-Shot |
| Mechanical Expert | +9.6% Skill Duration | −9% Skill CDR | +24% SAC Efficiency |
| Captain Cow | +3.6% Move Speed | +14.4% Skill Duration | +20% Healing Intensity |
| Healing Elites | +14.4% Received Healing | +15% Release Extra Protection | +28% Armor |
| Self-Propelled Shield | +14% Armor | +5.4% Move Speed | +24% Max Health |
| Fearless Warrior | +6% Damage Reduction | +9% Damage Bonus | +18% Toughness |

### Rule 10 - Exotic Weapon Data Accuracy *(added 2026-05-24)*

The Excel "Exotic Weapons" sheet contains errors for Strawberry Milkshake. **Corrected values from in-game screenshots:**

| Field | Excel (WRONG) | Correct (In-Game) |
|---|---|---|
| Damage Type | Blast Damage 300 | **Shredding Damage 300** |
| RPM | 550 (correct) | 550 |
| MAG | 100 (correct) | 100 |
| Anarchy Description | "dealing 100% Weapon Damage over 10 seconds, up to 50 stacks. Enemies dying with this debuff transfer all stacks to a nearby enemy within 25 meters." | **"dealing 2.40% Weapon Damage over 4.50 seconds, up to 50 stacks. Enemies dying with this debuff transfer all stacks to a nearby enemy within 12 meters."** |

**Errors fixed:**
1. Strawberry Milkshake is **Shredding**, not Blast
2. Anarchy deals **2.40%** WD, not 100%
3. Anarchy ticks over **4.50** seconds, not 10
4. Transfer radius is **12** meters, not 25

### Rule 11 - Weapon Talent Pool Constraints *(added 2026-05-24)*

**Fully Charged can ONLY roll on these SMGs:** MP7, Enhanced AUG A3P, AUG A3 Para XS, Converted SMG-9 A2, P90, PP-19, Naval MP5.

**Torrential Downpour (Torrential Downpour) can ONLY roll on these SMGs:** First Wave Vector 45 ACP (T2), Modified USC (T2), AUG A3 Para XS (T1), P90 (T1), MP40 (T1), Vector 45 ACP (T0), Converted SMG-9 (T0), MPX (T0).

**Overlap (can roll BOTH talents):** P90 (T1), AUG A3 Para XS (T1). Only these two SMGs qualify for the Scout build secondary.

**Verified SMG RPM values:**
- Vector 45 ACP: **1200 RPM** (cannot roll Fully Charged)
- MP7: **950 RPM** (cannot roll Torrential Downpour)
- P90: **900 RPM** (can roll both)
- Lady Death: **900 RPM** (exotic, locked talents)

**P90 Full Stats (user-verified):**
- RPM: 900
- Magazine: 50 (2nd highest SMG mag, same across all tiers)
- Reload: 2.47 seconds (slowest reload of all SMGs)
- Accuracy: 49/100
- Stability: 92/100

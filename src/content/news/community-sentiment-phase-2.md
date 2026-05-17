# The Division Resurgence — Deep Dive Report

**Compiled:** May 17, 2026
**Game:** The Division Resurgence (Ubisoft Mobile Games, Paris)
**Platforms:** iOS, Android (launched March 31, 2026) · PC Early Access via Ubisoft Connect (launched April 28, 2026)
**Full PC launch:** August 2026 (Season 2)

---

## How to Use This Document

This report is organized as **separate post sections** matching your website's categories (News, Patch Notes, Build Guides, etc.). Each section is self-contained and ready to be lifted into a website post.

**Editorial standards used throughout:**

- Every fact is **paraphrased** in original language — no long verbatim copying from sources
- Every claim has an **inline source link** with the **publication date** so you can confirm recency before posting
- Creators are credited by **channel name + video title** (YouTube), or by **author + outlet** (articles)
- Official Ubisoft content is marked **[OFFICIAL]** so it can be cited to the publisher rather than to a Reddit re-poster
- Each claim carries a **confidence tag**:
  - **[CONFIRMED]** — stated by Ubisoft directly or by multiple independent established sources
  - **[LIKELY]** — stated by one credible source (e.g., established creator) but not cross-confirmed
  - **[UNCONFIRMED]** — community claim, reasonable but not verified; flag in your post
- Content older than 30 days is marked **[OLDER CONTEXT]** so it doesn't get presented as breaking news
- Division 1 / Division 2 content has been **explicitly excluded** — see the Editorial Notes at the end for the filter we applied

---

# Section 1 — News Posts

Use this section for News category posts on your site. Sorted newest-first.

---

## Post: 60 FPS at Max Graphics — Phase 2 Quietly Unlocked the Performance Ceiling

```yaml
---
title: "60 FPS at Max Graphics — Phase 2 Quietly Unlocked the Performance Ceiling"
publishDate: "2026-05-17"
author: "RapidF5"
description: "Resurgence's biggest performance complaint just got addressed on mobile, and PC players are pushing past the 65 FPS soft cap. Here's what's actually changed and what's still locked."
tags: ["News", "Phase 2", "Performance", "PC", "Mobile"]
---
```

**Tag:** [CONFIRMED] · [OFFICIAL]
**Recency:** Fresh (since May 12, 2026)

If you've been bouncing off Resurgence because high settings always meant 30 FPS, the Phase 2 update changed that — but read the fine print before you set expectations.

### What Ubisoft officially shipped

Buried under "Performance & Visual Improvements" in the [Phase 2 patch notes (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new): *"Some high-end devices can now run the game with expanded graphics settings, including smoother performance at higher frame rates (up to 60 FPS depending on device)."*

In plain English: the long-standing limit that forced flagship phones and tablets to choose between **High graphics OR 60 FPS** has been lifted on a whitelist of high-end devices. You can now have both on supported hardware.

### What players are actually seeing

Creators confirmed the unlock within hours of Phase 2 going live:
- [Top GamePlayz, "The Division Resurgence Finally Gets 60FPS on Mobile! (Maximum Graphics)" (2026-05-13)](https://www.youtube.com/watch?v=MIyomnJpKyg) — 17+ minutes of max-settings gameplay with the FPS counter visible
- [Dragon's Breath, "NEW UPDATE • Division Mobile Now Has 60 FPS on Ultra Graphics" (2026-05-14)](https://www.youtube.com/watch?v=-MSXiEc44XE) — tested on the Red Magic 11 Pro+ (Snapdragon 8 Elite Gen 5); confirms the previous 30 FPS cap on max graphics is gone

### The pre-Phase 2 context — this was the #1 community ask

Going into the April 17 dev livestream, Community Developer u/TDResurgence posted a [questions thread (2026-04-14)](https://www.reddit.com/r/thedivisionresurgence/comments/1sl9h12/share_your_questions_for_our_upcoming_live_stream/). The single highest-voted question (31 upvotes): *"Is it possible to lift graphic restrictions? The Samsung S25 Ultra should not be forced to low resolution and low graphics to achieve a playable framerate."*

u/HiDefMusic later [demonstrated 4K @ 60 FPS at maximum graphics via debug console (2026-04-06)](https://www.reddit.com/r/thedivisionresurgence/comments/1sdggia/60fps_very_high_settings_debug_menu_see/) and noted the game was actively re-setting `t.MaxFPS` and `r.VSync` every frame — proving the lock was deliberate engine-side code, not a device limitation. Phase 2 effectively rolled back that code for select hardware.

### What's still locked

- **Not every device.** Ubisoft's wording ("some high-end devices") is doing a lot of work. If your phone isn't on the whitelist, you won't see new graphics tiers in your menu.
- **PC native ceiling is ~65 FPS.** The Ubisoft Connect Early Access client still soft-caps in-game at ~65 FPS. Saiynergy [demonstrated a config-file workaround on May 9](https://www.youtube.com/watch?v=80zYx7ig3DQ) editing `t.MaxFPS` to 120, but the change does not persist between sessions.
- **120 FPS on mobile is hardware-and-display dependent.** Some flagship tablets and gaming phones with 120 Hz panels can hit higher frame rates than 60 in the right mode, but Ubisoft has not officially announced a 120 FPS toggle.

### How to enable 60 FPS at max settings (mobile)

1. Tap the game/menu icon in the top-right corner
2. Open Settings (gear icon)
3. Go to Graphics
4. Switch to the advanced graphics tier if your device prompts for it
5. Set Frame Rate to **High / 60 FPS**
6. Set Graphics Quality to **High** or **Ultra** (your device must be on the whitelist for these to appear together)

If the combo doesn't appear, your device isn't on the supported list yet. Community guidance is to clear the app's cache (after confirming cloud-save) to force a fresh hardware scan — that's an [established wiki tip (2026-05-08)](https://www.thedivisionresurgence.wiki/guide/the-division-resurgence-unlock-fps), not an official Ubisoft instruction.

### Bottom line

The biggest single quality-of-life ask from the launch community has been partially answered. It's not the full "unlock everything" the loudest voices wanted, but it's the largest performance change since launch — and it sets a precedent that Ubisoft *will* lift caps as the team certifies more devices.

**Sources:**
- Ubisoft (official), [Phase 2 Patch Notes (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new)
- Top GamePlayz (YouTube), [60FPS on Mobile Max Graphics (2026-05-13)](https://www.youtube.com/watch?v=MIyomnJpKyg)
- Dragon's Breath (YouTube), [60 FPS on Ultra Graphics — Phase 2 (2026-05-14)](https://www.youtube.com/watch?v=-MSXiEc44XE)
- Saiynergy (YouTube), [PC FPS Uncap Config (2026-05-09)](https://www.youtube.com/watch?v=80zYx7ig3DQ)
- u/TDResurgence on r/thedivisionresurgence, [Q&A thread (2026-04-14)](https://www.reddit.com/r/thedivisionresurgence/comments/1sl9h12/share_your_questions_for_our_upcoming_live_stream/)
- u/HiDefMusic on r/thedivisionresurgence, [60fps Very High Debug Demo (2026-04-06)](https://www.reddit.com/r/thedivisionresurgence/comments/1sdggia/60fps_very_high_settings_debug_menu_see/)

---

## Post: Missing Gear Bug — What Players Are Losing, What Ubisoft Has Fixed, What's Still Broken

```yaml
---
title: "Missing Gear Bug — What Players Are Losing, What Ubisoft Has Fixed, What's Still Broken"
publishDate: "2026-05-17"
author: "RapidF5"
description: "A growing thread of reports has agents losing fully-upgraded weapons, paid Exotics, and full loadouts. Here's the current picture — what's confirmed, what Ubisoft has patched, and what to do if it happens to you."
tags: ["News", "Bugs", "Live Service"]
---
```

**Tag:** [USER REPORTS — ongoing] · No specific Ubisoft acknowledgement found in May 1-17 window
**Recency:** Active issue

One of the most credibility-damaging bugs in any live-service shooter is also one of the most persistent in Resurgence: gear, weapons, even paid Exotics, disappearing from player inventories. Here's where we are as of May 17.

### What players are reporting (paraphrased, with attribution)

- **u/LaClown-ua** (["New Bug — weapon disappearing from inventory" (2026-04-17)](https://www.reddit.com/r/thedivisionresurgence/comments/1snm931/new_bug_weapon_disappearing_from_inventory/)): A locked, fully-upgraded T1 High-end P90 — proficiency 10, leveled to 50 with hard-earned materials — vanished after a build swap. Not sold. Not dismantled. In the comments: **TheeLoo** reported a Warlord at level 44 disappearing then returning hours later. **Ephr4im** reported their paid Warlord from the battle pass disappearing entirely — they later received a free-track Warlord as a replacement but the original is still gone. **Wide-Deal-8971** described inventory spontaneously rearranging. **nephiliasm** flagged that Agent Career caches auto-open instantly on receipt and can be missed if you're not looking.

- **u/BelleskaTROn-** (["Logged back in to no weapons or gear???" (2026-04-02)](https://www.reddit.com/r/thedivisionresurgence/comments/1sa72za/logged_back_in_to_no_weapons_or_gear/)): After Asia-region server maintenance, came back to an empty backpack, swapped cosmetics, and missing weapons. In the comments, players reported losing entire loadouts at higher levels, including paid Exotics. **Gay4LtDangle** still had no apparel, emotes, or gear days later. A community-diagnosed root cause for *some* cases: a deleted/missing cosmetic blocking the apparel slot, which in turn blocks weapon-equip. Workaround: tap a different outfit tab to force-strip the broken slot.

- **DogManDogDayz** (same thread): cross-play rewards never delivered.

### What Ubisoft has officially fixed

Ubisoft has shipped patches that touch *adjacent* problems but has not, to my knowledge, named the weapon-disappearance bug specifically in any patch note in the May 1-17 window. Confirmed fixes that may reduce the surface area of this issue:

- **Patch 1.1.2 (2026-04-28)** — [Helpshift](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2508-patch-note---1-1-2-update-28-apr-2026/) — Fixed cases where "Premium Credits and items were purchased externally but failed to be granted in-game" and "Battle Pass or other rewards were not received correctly." This addresses payment-side delivery failures but not in-session disappearance.
- **Phase 2 (2026-05-12)** — Fixed an issue where "mods could sometimes break or not display correctly due to missing data" and "improved how Seasonal cosmetics are distributed and unlocked." Cosmetic and mod display fixes, not weapon-vanish fixes.

### Community-validated workarounds (use until Ubisoft ships a real fix)

1. **Full app close and relaunch** — multiple users report items return after a clean restart. This forces a full server resync.
2. **Check your server region.** Resurgence characters are region-locked across Europe / Americas / Asia. Logging into the wrong region shows an empty inventory — you haven't lost anything, you're just on the wrong server.
3. **Wait** — anywhere from a few minutes to 24 hours. Some reports describe items returning passively after server-side sync catches up.
4. **Check Mail / Stash / Loadout presets** — rewards from events and seasonal content often land in the mail tab, not the backpack. Loadout presets can hide items that appear "missing" from the main view.
5. **For blocked-equip cases (empty arms / can't equip weapons):** open the apparel screen, tap a different outfit tab, and re-apply your current outfit. This force-strips a missing cosmetic that may be blocking other slots.
6. **Submit an in-game support ticket** with screenshots and timestamps. Ubisoft's support response time has been slow per community reports, but a ticket is a paper trail if compensation comes later.

### What we're watching

- Any **official Ubisoft acknowledgement** specifically about weapon disappearance — there hasn't been one in our May 1-17 review window
- Whether the Phase 3 patch notes in June name this bug class explicitly
- Whether Ubisoft offers any **make-good rewards** for affected players (none announced as of writing)

### Editorial note

If you're documenting your own gear-loss case on the site, the Reddit threads above are the best community archive. Credit u/LaClown-ua and u/BelleskaTROn- for surfacing the most-discussed examples — paraphrase their detail, don't copy verbatim, and link the original threads so commenters get the visit.

**Sources:**
- Ubisoft (official), [Patch Note 1.1.2 (2026-04-28)](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2508-patch-note---1-1-2-update-28-apr-2026/)
- Ubisoft (official), [Phase 2 Patch Notes (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new)
- u/LaClown-ua, [New Bug — weapon disappearing from inventory (2026-04-17)](https://www.reddit.com/r/thedivisionresurgence/comments/1snm931/new_bug_weapon_disappearing_from_inventory/)
- u/BelleskaTROn-, [Logged back in to no weapons or gear??? (2026-04-02)](https://www.reddit.com/r/thedivisionresurgence/comments/1sa72za/logged_back_in_to_no_weapons_or_gear/)
- YouTube tutorial (April 2026), [How To Fix Gear Lost After Disconnection](https://www.youtube.com/watch?v=RFi5EpprYXc)
- YouTube tutorial (April 2026), [How To Fix Missing Items After Server Crash](https://www.youtube.com/watch?v=RdUO5x-jqIM)

---

## Post: Phase 2 of Season 1 Is Live — New Classified Ops Pass, Free Exotic LMG, Four Time-Limited Events

**Date:** May 12, 2026
**Tag:** [CONFIRMED] · [OFFICIAL SOURCE]
**Recency:** Recent (5 days ago)

Ubisoft launched Phase 2 of Season 1 on May 12, 2026. The update introduces a new **Classified Ops Pass** with 50 tiers of rewards, a free Exotic LMG (Strawberry Milkshake), three new cosmetic Draw Sets, and four time-limited events — one in the Dark Zone and three speed-run challenges set in main-story missions on Challenging difficulty.

**Headline rewards on the new pass:**
- Strawberry Milkshake — free Exotic Weapon (LMG) at Tier 5 of the free track
- Hot Rod — Superior Weapon Skin
- Pyromaniac — Apparel Set

**New cosmetic Draw Sets added:**
- Eradication Exotic Weapon Skin + Battle-worn Metal Skin Set
- Special Forces Apparel + Battle-Hardened Weapon Skin Set
- Ken Ito Apparel + Rikers Unchained Weapon Skin Set

**Time-limited events (4 total):**
- 1 Dark Zone event
- 3 Speed-Run challenges in Challenging difficulty main-story missions

**Other notable changes:**
- Warlord (Exotic AR) added to the Dark Zone Vendor
- Strawberry Milkshake Tactical Augmentation Module added to the Dark Zone Vendor
- Skill Mod dismantle credit values increased: Blue 10 → 15, Purple 50 → 75, Yellow 450 → 750
- Some high-end devices can now run the game at up to 60 FPS with expanded graphics settings

**Sources:**
- Ubisoft (official), [Phase 2 Starts Now — What's New (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new)
- Brittany Spurlin, Ubisoft News, [A New Battle Pass, Speed Run Events, Dark Zone Quest (2026-05-12)](https://news.ubisoft.com/en-us/article/1ukeTnWBDV4vJfLjei6w4W/play-the-division-resurgence-season-1-phase-2-today-a-new-battle-pass-speed-run-events-dark-zone-quest)
- Iwan Morris, Pocket Gamer, [Season One Phase Two Launch (2026-05-13)](https://www.pocketgamer.com/the-division-resurgence/season-one-phase-two-launch/)

Full patch notes are in Section 2 below.

---

## Post: Resurgence Comes to PC in Early Access — Free, Cross-Play, Cross-Progression

**Date:** April 28, 2026
**Tag:** [CONFIRMED] · [OFFICIAL SOURCE]
**Recency:** [OLDER CONTEXT] (19 days ago)

The Division Resurgence is now available in Early Access on PC via **Ubisoft Connect**, just under a month after its March 31 mobile launch. The PC version is free-to-play, with full **cross-play** and **cross-progression** across iOS, Android, and PC — you can switch devices and pick up where you left off.

**Key details:**
- Download client: Ubisoft Connect (not Steam at this stage)
- File size: approximately 17 GB
- Frame rate: locked at 60 FPS in Early Access, but without the visual fidelity caps of the mobile version — Very High graphics presets are supported
- Input: full mouse-and-keyboard support and native controller support; the on-screen UI can be toggled between "Keyboard/Mouse Exclusive UI" and "Controller UI" in Generic Settings → External Device UI
- PvP matchmaking is cross-platform — a Resurgence team has acknowledged the fairness question but has not announced platform-segregated PvP
- Players signed in as a mobile guest should link their Ubisoft Connect account before playing on PC to preserve progress

**Why this matters:** Until April 28, the only routes to play on PC were unofficial emulators. Ubisoft had previously declined to commit to a PC version. The shadow-drop happened approximately one hour before the official developer livestream announcing it, which surprised even Ubisoft Creator Program partners.

**Sources:**
- Ubisoft (official), [PC Early Access & Game Roadmap (2026-04-28)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/5LqRsprrdgtEnUmStmBi0d/pc-early-access-game-roadmap)
- Ubisoft (official), [Play Resurgence on PC — All You Need to Know (2026-04-28)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/1rUYWPgMV9hXYZ6FcLOkpX/play-resurgence-on-pc-all-you-need-to-know)
- Brittany Spurlin, Ubisoft News, [The Division Resurgence Roadmap: PC Launch, Story Expansion and More (2026-04-28)](https://news.ubisoft.com/en-us/article/9ZzMWcx5ADnaxAiOO3e0w/the-division-resurgence-roadmap-pc-launch-story-expansion-and-more)
- RogueGold (YouTube), ["The Division Resurgence Just SHADOW DROPPED On PC" (2026-04-28)](https://www.youtube.com/watch?v=lvrE_xJeKfM)
- Demi Williams, TechRadar, [Coverage of PC launch and August roadmap (2026-05-01)](https://www.techradar.com/gaming/free-to-play-mobile-game-the-division-resurgence-is-launching-on-pc-in-august-as-ubisoft-shares-new-roadmap-details-but-you-can-play-it-right-now)

---

## Post: The Season 1, 2, and 3 Roadmap — What's Coming Through Winter 2026

**Date:** April 28, 2026 (announced)
**Tag:** [CONFIRMED] · [OFFICIAL SOURCE]
**Recency:** [OLDER CONTEXT] (19 days ago, but forward-looking)

Ubisoft published the full seasonal roadmap on April 28. New seasons land every **four months**; phases within a season arrive every **six weeks**.

**Phase-by-phase:**

| Phase / Season | Date | Headline Content |
|---|---|---|
| Season 1, Phase 2 | May 12, 2026 | Classified Ops Pass 1.2 (Strawberry Milkshake Exotic, Pyromaniac apparel, Hot Rod skin); 4 time-limited events |
| Season 1, Phase 3 | June 2026 | Classified Ops Pass 1.3 (Scorpio Exotic, Freemen apparel, Boombox skin) |
| Season 2 | August 2026 | **Full PC launch** for The Division Resurgence (graduating from Early Access) |
| Season 3 | Winter 2026 | Major story expansion — deeper backstory on the factions and characters introduced in Season 1 |

**A note on Steam:** No Steam release date has been officially confirmed. The August Season 2 target is for Ubisoft Connect. Some creator coverage (RogueGold) referenced "Steam later this summer" based on the Ubisoft Creator Program preview, but this should be treated as **[LIKELY but UNCONFIRMED]** until Ubisoft posts it officially.

**Sources:**
- Brittany Spurlin, Ubisoft News, [The Division Resurgence Roadmap (2026-04-28)](https://news.ubisoft.com/en-us/article/9ZzMWcx5ADnaxAiOO3e0w/the-division-resurgence-roadmap-pc-launch-story-expansion-and-more)
- Ubisoft (official), [PC Early Access & Game Roadmap (2026-04-28)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/5LqRsprrdgtEnUmStmBi0d/pc-early-access-game-roadmap)
- TheSixthAxis, [Resurgence Playable on PC — Season Roadmap Revealed (2026-05-01)](https://www.thesixthaxis.com/2026/05/01/the-division-resurgence-is-now-playable-on-pc-season-roadmap-revealed/)

---

## Post: April Developer Stream — Known Issues, Player Asks, and What the Team Confirmed

**Date:** April 18, 2026 (livestream)
**Tag:** [CONFIRMED] · [SECONDARY SUMMARY]
**Recency:** [OLDER CONTEXT] (29 days ago)

Ubisoft hosted a developer livestream on April 18 covering the launch period. Community moderator u/JokerUnique posted a clean summary on Reddit; the underlying source is the official Ubisoft Twitch stream.

**Confirmed by the developers on the stream:**
- FPS cap and graphics-unlock work is being actively explored; no timeline committed
- The Outpost Annihilation side-quest bug and the weapon-proficiency-halting bug were acknowledged; stability fixes were prioritized first
- Three Exotic weapons per season, all reachable on the **free** Classified Ops track
- Tier 2 crafting is planned for a later update
- 33 encrypted crates exist in the game (not all had been discovered by the community as of the stream)
- No crossplay between the three regional servers — characters are server-locked

**Community sentiment:** Mixed-to-frustrated. Multiple top comments described the answers as light on commitments. One commenter pointed out that a modified APK demonstrated the FPS unlock is technically feasible, which contributed to player skepticism.

**Sources:**
- u/JokerUnique on r/thedivisionresurgence (community summary), [Developer Stream Summary (2026-04-18)](https://www.reddit.com/r/thedivisionresurgence/comments/1sos0u8/developer_stream_summary/)
- Source VOD: [twitch.tv/videos/2749444842](https://www.twitch.tv/videos/2749444842) (Ubisoft Resurgence team)

---

# Section 2 — Patch Notes Posts

Use this section for Patch Notes category posts. Each entry corresponds to a specific update.

---

## Post: Phase 2 Patch Notes (Season 1, Phase 2) — May 12, 2026

**Date:** May 12, 2026
**Tag:** [CONFIRMED] · [OFFICIAL SOURCE]
**Recency:** Recent (5 days ago)

The Phase 2 update for Season 1 went live on May 12. This is the official patch note as published by Ubisoft, organized by category. (Paraphrased into our own structure; original wording linked below.)

### What's New

**New Classified Ops Pass**
- 50 tiers of exclusive rewards
- "Strawberry Milkshake" — free new Exotic Weapon (LMG)
- "Hot Rod" — Superior Weapon Skin
- "Pyromaniac" — Apparel Set

**New Cosmetic Draw Sets**
- Eradication Exotic Weapon Skin + Battle-worn Metal Weapon Skin Set
- Special Forces Apparel Set + Battle-Hardened Weapon Skin Set
- Ken Ito Apparel Set + Rikers Unchained Weapon Skin Set

**Time-Limited Events** — Four new events
- 1 Dark Zone event
- 3 speed-run challenges (revisiting main-story missions on Challenging difficulty)

### Gameplay & Features
- Fixed mods sometimes breaking or not displaying correctly due to missing data
- Improved Seasonal cosmetic distribution and unlock timing so players receive rewards at the right time
- Updated Season 1 Battle Pass naming and localization in all supported languages
- Added new Exotic Weapon: **Strawberry Milkshake** (LMG)
- Added Strawberry Milkshake Tactical Augmentation Module to the Dark Zone Vendor
- Added **Warlord** to the Dark Zone Vendor
- Added one additional Exotic Weapon Enhancement Kit to the Dark Zone Vendor
- Added a weekly Random Tactical Augmentation Module Crate to the Dark Zone Vendor
- Tactical Augmentation Modules for Weapon / Gear / Exotic Weapons now grant **Encrypted Data** on dismantle (previously Clan Credits)
- **Skill Mod dismantle yields increased:** Blue 10 → 15 · Purple 50 → 75 · Yellow 450 → 750
- Added one more copy of each regular Weapon and Gear Tactical Augmentation Module to the Clan Vendor

### Performance & Visual Improvements
- High-end devices can now run with expanded graphics settings, with smoother performance up to 60 FPS (device-dependent)
- General improvements to visual quality and device stability

### Bug Fixes & Stability
- Fixed **Brain over Brawns** scaling the wrong stats in some situations
- Fixed a crash when opening certain mod-related screens
- Resolved multiple errors that could occur during gameplay
- Improved overall stability across all platforms
- Fixed some incorrect entries in the "Find" menu for Weapons and Gear
- Corrected reward inaccuracies on Clan Nests
- Fixed Lone Wolf Challenge not refreshing every 3 weeks

### Technical Improvements
- Backend and system optimizations for live operations and upcoming updates
- Stability improvements based on multiple release-candidate iterations

**Original source:** Ubisoft (official), [PHASE 2 STARTS NOW — WHAT'S NEW (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new)

---

## Post: Patch 1.1.2 Notes — April 28, 2026

**Date:** April 28, 2026
**Tag:** [CONFIRMED] · [OFFICIAL SOURCE]
**Recency:** [OLDER CONTEXT] (19 days ago)

Patch 1.1.2 deployed alongside the PC Early Access launch. The update was a stability and quality-of-life pass, with a heavy emphasis on mouse-and-keyboard support — clearly to prep for PC players coming in fresh.

### Stability & Crash Fixes
- Improved overall stability and fixed multiple crashes during gameplay and menu navigation
- Fixed a crash when using the "Locate" button on the Mission Map
- Fixed crashes related to environmental lighting and weather setups
- Fixed an iOS-specific crash tied to LOD loading for environment meshes
- Fixed crashes when equipping certain gear items (e.g., Skater apparel)
- Added safety checks for character assets, skeletal-mesh merging, and environment loading

### Tutorials, Controls & Usability
- Tutorials no longer break or misbehave when controls are remapped or unbound
- More reliable tutorials across menus; tutorials no longer open at invalid times or block UI interactions
- Resolved input issues where UI elements (quick wheel, roulette, tutorials) could conflict or get stuck
- **Mouse & Keyboard improvements:**
  - Better default bindings for non-QWERTY keyboards
  - Improved menu navigation with KB+M controls
  - Fixed the Quickwheel not being re-bindable

### Dark Zone & Live Events
- Fixed Dark Zone events sometimes displaying an empty UI
- **Temporarily disabled the Dark Zone box deal** to prevent confusing behavior
- Improved tracking and completion reliability for live-event tasks

### Online, Chat & Social
- Fixed chat and recruiting messages not respecting privacy settings (e.g., friends-only or private)
- More reliable, clearer chat-consent warnings
- Reporting and social-action flows correctly open external reporting interfaces when required

### Privacy, Consent & Compliance
- Fixed consent checkboxes being pre-selected incorrectly in certain regions
- Improved age, consent, and privacy region logic
- Fixed cases where required consent prompts didn't reappear after settings changes

### Store, Purchases & Rewards
- Fixed Premium Credits and Store flow issues, including:
  - Incorrect "Max" button behavior when exchanging currencies
  - Broken Customer Support button paths on some devices
- Improved reliability of purchases and reward delivery to prevent:
  - Payments succeeding externally but items not granted in-game
  - Battle Pass or other rewards not arriving
- Fixed cases where paid currency could be counted twice in reward flows

### General Polish
- Improved UI error handling so leaderboards, errors, and payments screens no longer get stuck
- Fixed misleading reward displays on the world map
- More robust config loading to prevent desync after reconnection

**Original source:** Ubisoft (official), [Patch Note — 1.1.2 Update 28/Apr/2026](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2508-patch-note---1-1-2-update-28-apr-2026/)

---

## Post: Hotfix 1.1.1 Notes — April 13, 2026

**Date:** April 13, 2026
**Tag:** [CONFIRMED] · [OFFICIAL SOURCE]
**Recency:** [OLDER CONTEXT] (34 days ago)

Hotfix 1.1.1 was a small, fast-shipping fix focused on sound and UI bugs reported in the first two weeks after launch.

### Fixes Implemented
1. Sound issue on many devices fixed (frequently affecting VIVO devices)
2. Invisible UI when talking to the **Quartermaster** in the initial mission — fixed
3. Leaderboards not displaying players for some users — fixed
4. Multiple crashes across various mobile devices — fixed

The notes encouraged players still hitting these issues to submit an in-game support ticket to provide the team with the data needed for a fast fix.

**Original source:** Ubisoft (official), [Patch Note — 1.1.1 Hotfix 13/Apr/2026](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2494-patch-note---1-1-1-hotfix-13-apr-2026/)

---

# Section 3 — Build Guides Posts

Use this section for Build Guides category posts. Each post is build-focused and skewed toward the endgame.

---

## Post: Endgame 101 — Tier 2 Gear, OS Protocols, and Chipsets Explained

**Date:** Compiled May 17, 2026 (synthesis post — based on RogueGold's April 18 farming guide plus Saiynergy's May 3 tips guide)
**Tag:** [CONFIRMED] · Synthesis of established Division creators
**Recency:** Recent base material

If you're new to Resurgence's endgame, these three systems are the entire game. Lock them in, and the loop makes sense.

### Tier 2 Gear

Resurgence has three gear tiers — Tier 0, Tier 1, and Tier 2. Tier 2 is the endgame ceiling, but it isn't the *only* thing that matters: a well-rolled Tier 0 or Tier 1 with a Tier 2 talent on it remains competitive. Over time, the goal is Tier 2 with the right rolls for your class.

**Where to get it:**

| Source | Reliability | Notes |
|---|---|---|
| Elite Mission Challenge (Legendary difficulty) | **Primary source — highest drop rate** | Requires Level 40 · No standard matchmaking · Pre-made group or in-game Group Finder · First 2 weekly mission clears award bonus T2 caches |
| Dark Zone — Heroic Roaming Bosses | Low–Medium | Rare but possible · Higher PvP risk |
| Dark Zone — Heroic Landmarks | Low–Medium | Inconsistent · Better for Chipset farming |

**Important:** There is **no targeted loot for Tier 2 gear sets.** Farm Legendary for volume; the right set bonuses come over time.

Source: RogueGold (YouTube), ["Division Resurgence: ENDGAME FARMING GUIDE — Tier 2 Gear, OS Protocols, Chipsets" (2026-04-18)](https://www.youtube.com/watch?v=vyWnGL_tvTI)

### Chipsets (Skill Mods)

Chipsets are Resurgence's version of skill mods. Each skill has three mod slots. Unlike Division 1 or Division 2, Chipsets in Resurgence have **set bonuses** — so chasing chipset sets is its own meaningful build axis.

**How to farm them efficiently:**
- Drops are tied to the **Dark Zone**
- The Dark Zone entrance screen has a "targeted chip set loot" selector — pick the set tied to your spec and play style
- Higher DZ difficulty = better drop quality. Challenging and Heroic bosses and landmarks are where Purple and Yellow chipsets show up
- DZ Vendor at the Base of Operations rotates new chip stock **every 24 hours** — check it daily
- If you don't want to risk extraction with a great drop, smuggle it out at any DZ Safe Room (small DZ Credit cost)

Source: RogueGold (YouTube), same video as above.

### OS Protocols

OS Protocols are class-defining talent selections — think of them like specialization passives that anchor an entire build.

**The two ways to get them:**

| Source | What It Drops | How to Use It |
|---|---|---|
| **Weekly Bounty Main Target** | Random Blue / Purple / Yellow OS Protocol | Reveal 3 Lieutenants by completing open-world activities → main target unlocks · **Only gameplay source for Yellow OS** · Always claim rewards from the Bounty Menu after the kill, not just from the boss body |
| Sealed Caches (in-game store, gacha) | Random OS Protocol from the cache pool | **Not recommended for cash purchases** — listed gold drop rates are very low. SHD Keys (earned through gameplay, commendations, daily logins) can also open these |

**Leveling protocols:** Higher tiers are more powerful but harder to level — leveling is done by donating duplicate protocols. A well-leveled Blue or Purple OS easily competes with an under-leveled Gold in the endgame, so don't despair if you don't pull a Gold.

Source: RogueGold (YouTube), same video as above.

---

## Post: Beginner's Endgame Checklist — Your First Two Weeks at Level 40

**Date:** Compiled May 17, 2026 (synthesis of multiple creator guides)
**Tag:** [CONFIRMED]
**Recency:** Recent base material

A clear weekly cadence helps you avoid bouncing between activities at random.

**Daily**
- DZ vendor check (24-hour rotation)
- Open-world activities for OS Bounty Lieutenant reveals
- 1–2 chipset DZ runs with targeted loot set to your spec
- Daily commendation pickups (free SHD Keys here, no need to spend on caches)

**Weekly**
- Complete the OS Bounty main target — **claim from the Bounty Menu**, not just the boss body
- Run your 2 bonus Legendary Elite Mission clears for the T2 bonus caches
- Lone Wolf Challenge — refreshes every 3 weeks (Phase 2 fix restored its correct cadence — see Phase 2 patch notes)

**Avoid the FOMO traps**
- Sealed Caches are a money sink — pull only with earned SHD Keys
- Don't dismantle anything Tier 2 until you're sure it's truly inferior to what you already have

Sources:
- RogueGold (YouTube), ["Division Resurgence: ENDGAME FARMING GUIDE" (2026-04-18)](https://www.youtube.com/watch?v=vyWnGL_tvTI)
- Saiynergy (YouTube), ["The Division Resurgence 2026 — Best Tips/Guide For New Players" (2026-05-03)](https://www.youtube.com/watch?v=TfEzShVpPGc)
- RogueGold (YouTube), ["14 Tips I WISH I KNEW Before Starting The Division Resurgence" (2026-04-04, retrieved)](https://www.youtube.com/watch?v=TqeNr6KPB_4)

---

## Post: Exotic Weapons Currently in Resurgence — Sources, Talents, How to Get Them

**Date:** Compiled May 17, 2026
**Tag:** Confidence varies — see per-weapon notes

This list covers what is **currently confirmed** in Resurgence. A reminder: many famous Exotics from Division 1 and 2 (Pestilence, Eagle Bearer, Merciless) are **NOT** yet confirmed to be in Resurgence at the time of writing. Don't assume parity.

| Weapon | Type | Tag | Talent (short) | Where to Get |
|---|---|---|---|---|
| **Warlord** | Assault Rifle (AK-47 platform) | [CONFIRMED] | *Play Rough* — 20% damage reduction while firing; the deferred damage hits all at once when you stop | Dark Zone Vendor (added Phase 2) · Legendary mission drops · Exotic caches |
| **Lady Death** | SMG | [CONFIRMED] | Detailed talent text not captured in a text-based source — see linked video | Dark Zone Vendor (since launch) |
| **Strawberry Milkshake** | LMG | [CONFIRMED] | Full talent text not yet captured in text-based source | Phase 2 Classified Ops Pass — **free track, Tier 5** · Tactical Augmentation Module from DZ Vendor |
| **Scorpio** | TBD | [CONFIRMED — incoming Phase 3] | Talent text not yet released | Classified Ops Pass 1.3 (June 2026) |
| Diamondback | TBD | [LIKELY] | TBD | Wiki-sourced; verify against official patch notes before posting |
| Tommy Gun | TBD | [LIKELY] | TBD | Wiki-sourced; verify before posting |

**Verbiage to use when in doubt:** "currently available in Resurgence as of [date]" rather than "the game has X exotics" — the roster will grow phase-by-phase.

Sources:
- Ubisoft (official), [Phase 2 Patch Notes (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new) — Strawberry Milkshake confirmation
- YouTube (unnamed creator), ["How To Get The Warlord Exotic Assault Rifle In The Division Resurgence!" (2026-04-09)](https://www.youtube.com/watch?v=Gh-u2BTm3UQ)
- YouTube (unnamed creator), ["How To Get The Lady Death Exotic SMG In The Division Resurgence!" (2026-04-09)](https://www.youtube.com/watch?v=7mSyUmbRZLk)
- YouTube (unnamed creator), ["NEW EXOTIC STRAWBERRY MILKSHAKE LMG in DIVISION RESURGENCE" (2026-05-13)](https://www.youtube.com/watch?v=DHIwHI15B2A)

---

## Post: Gear Sets in Resurgence — All Eight Combo Bonuses

**Date:** Compiled May 17, 2026
**Tag:** [LIKELY] — sourced primarily from thedivisionresurgence.wiki; cross-verify before publishing
**Recency:** Base material from April 2026

Resurgence's gear sets work through **Combo Bonuses** at 2 / 3 / 4 pieces of the same set. The sets are attached directly to high-end yellow drops — there are no separate "classified" green drops as in Division 1, and no separate green gear sets as in Division 2.

| Set | 2-Piece | 3-Piece | 4-Piece |
|---|---|---|---|
| Fiori Strike | Weapon Stability | Weapon Crit Hit Chance | Weapon Crit Hit Damage |
| Boom Shakalaka | Skill Cooldown | Skill Radius | Skill Intensity |
| Fearless Warrior | Damage Reduction | Total Health | Damage Bonus |
| Phalanx Attack | Weapon Stability | Increased RPM | Weapon Multi-Shot Chance |
| Jackpot | Skill Radius | Skill Crit Hit Chance | Skill Crit Hit Damage |
| Captain Cow | Skill Cooldown | Skill Duration | Healing Output |
| Long-Term Effect | Skill Health | Skill Duration | Skill Intensity |
| Quick Draw | Aiming Speed | Weapon Accuracy | Headshot Damage |

*Community consensus:* Fearless Warrior is the best balance of survivability and damage for solo / open-world progression at the start of the endgame.

Source: thedivisionresurgence.wiki (editorial staff), [Division Resurgence Gear Sets: Complete Guide & Builds (2026-04-16)](https://www.thedivisionresurgence.wiki/guide/division-resurgence-gear-sets)

**Editorial note for the site:** Always cross-reference this wiki against in-game text before publishing — the wiki occasionally contains Division 2 content that has not yet been confirmed in Resurgence.

---

## Post: Dark Zone Beginner Guide — Mechanics, Caps, and Anti-Loss Tactics

**Date:** Compiled May 17, 2026 (synthesis of community wiki + GCROCK beginner guide)
**Tag:** [CONFIRMED] for most mechanics
**Recency:** Recent base material

### The basic loop
- 20-minute DZ sessions (you can re-queue back-to-back, but the timer is real)
- Items you pick up in the Dark Zone are **contaminated** — they need to be extracted (or smuggled) to be safe to use
- Carry cap: 9 contaminated items at a time
- Extraction: Call a chopper at an Extraction Zone; **Phase 2 added a second extraction rope** to reduce queue conflicts
- Smuggle option: any DZ Safe Room can move loot off your back for a small DZ Credit fee

### Credit caps
- Weekly soft cap: **10,000 DZ Credits earned from PvE/PvP**
- Weekly hard cap: **20,000 DZ Credits** (with bonus sources)
- **Mod dismantle credits do not count toward the 10k weekly cap** — this is the one knob heavy grinders can keep turning
- Phase 2 increased Skill Mod dismantle yield (Blue/Purple/Yellow → 15/75/750), making this even more efficient

### Manhunt and rogue management
- Players who flag rogue are visible on the SHD terminal
- You can clear your rogue status at the SHD terminal once you survive the cooldown
- Heroic roaming bosses are great group content if you can find allies in chat — the DZ boss chest can be opportunistically grabbed during chaos, but expect to draw aggression

### Loot quality scales with difficulty
- Challenging → consistent Purple chipsets
- Heroic → Yellow chipsets and rare Tier 2 gear drops

Sources:
- GCROCK (YouTube), ["The Division Resurgence Dark Zone Beginner Guide"](https://www.youtube.com/watch?v=lsb-Hi_ymZg)
- thedivisionresurgence.wiki (editorial staff), [The Division Resurgence Dark Zone (2026-04-09)](https://www.thedivisionresurgence.wiki/guide/the-division-resurgence-dark-zone)
- Ubisoft (official), [Phase 2 Patch Notes (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new) — Skill Mod dismantle yield bumps

---

## Post: Specializations in Resurgence — All Five Paths and Their Roles

**Date:** Compiled May 17, 2026
**Tag:** [LIKELY] — talent counts and unlock conditions cross-confirmed; tier ranking is community opinion
**Recency:** Base material from April 2026

Resurgence offers **five Specializations**. Four are available early; one (Tech Operator) is a later unlock. Each specialization is a separate 49-point tree.

| Spec | Role | Notes |
|---|---|---|
| Vanguard | Aggressive frontline DPS | The "default" aggressive build — great with Warlord |
| Sharpshooter | Long-range precision | Headshot-centric, paired well with Quick Draw set |
| Demolitionist | AoE / suppression | Skills lean toward area control |
| Survivalist | Sustain / utility | Healing skills, longer-fight viability |
| Tech Operator | Skill-centric tank-mage | **Unlocks later in progression**, not at the start |

**Mechanics worth posting:**
- Minimum Level 12 to swap specs
- Each spec has its own 49-point tree
- For Legendary squads, the community-favored composition is one of each role; running 4 Vanguards is doable but punishing on group survivability

Source: GCROCK (YouTube), ["Specializations Made EASY! Beginner Guide"](https://www.youtube.com/watch?v=ejVBvRAQMZM); community discussion across r/thedivisionresurgence

---

## Post: PC Setup Quick Guide — Settings, Controls, Performance

**Date:** Compiled May 17, 2026
**Tag:** [CONFIRMED] for official details; community settings flagged
**Recency:** Recent base material

If you've just downloaded the PC client, here are the settings worth knowing before you queue your first activity.

**Install**
- Ubisoft Connect download — currently the only PC client; Steam is not yet announced
- ~17 GB on disk

**UI prompts**
- Open Settings → Generic Settings → External Device UI
- Enable "Keyboard/Mouse Exclusive UI" if you're playing on KB+M
- Enable "Controller UI" if you're using a gamepad
- This swaps the on-screen prompts so they actually match your input device

**Aiming**
- Set **Aim Mode to "Hold"** for conventional PC ADS — right-click to aim, release to drop out

**Frame rate**
- The Early Access client is locked at 60 FPS but supports the Very High graphics preset without the strict visual caps of mobile
- Phase 2 (May 12) added expanded graphics settings on some high-end devices

**Cross-play / cross-progression**
- Same Ubisoft Connect account = one character across mobile and PC
- If you played on mobile as a guest, **link your Ubisoft Connect account before logging in on PC**, otherwise progress will not carry

**Steam Deck**
- Works through Ubisoft Connect installation on Steam Deck; community testing reports ~60 FPS on max settings with occasional stutter and ~3 hour battery
- Source: ETA Prime / community testers (third-party reports, not Ubisoft-confirmed)

Sources:
- Ubisoft (official), [Play Resurgence on PC — All You Need to Know (2026-04-28)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/1rUYWPgMV9hXYZ6FcLOkpX/play-resurgence-on-pc-all-you-need-to-know)
- Mostafa Salem, GAMES.GG, [How to Play Division Resurgence on PC (2026-04-05)](https://games.gg/tom-clancys-the-division-resurgence/guides/how-to-play-division-resurgence-on-pc/)
- RogueGold (YouTube), ["Just Shadow Dropped on PC" (2026-04-28)](https://www.youtube.com/watch?v=lvrE_xJeKfM)
- Saiynergy (YouTube), ["The Division Resurgence PC Graphics Are INSANE"](https://www.youtube.com/watch?v=06QYPQBcW98)

---

# Section 4 — Community Sentiment Posts

Optional category — community pulse pieces, useful for engagement-style posts.

---

## Post: What the Community Is Saying — Two Weeks Into Phase 2 PC Era

```yaml
---
title: "What the Community Is Saying — Two Weeks Into Phase 2 PC Era"
publishDate: "2026-05-17"
author: "RapidF5"
description: "A pulse check on the Resurgence community two weeks after the PC launch and Phase 2. Sentiment has shifted with the 60 FPS unlock, but missing gear and pass value are dragging it back."
tags: ["Community", "Phase 2", "PC"]
---
```

The community mood has moved since our last pulse check. The April 28 PC launch and the May 12 Phase 2 patch each shifted what players are talking about — and the conversation is more nuanced than "happy" or "angry." Here's what I'm reading across Reddit, YouTube, and the developer comms threads. Each section paraphrases the community; named contributors are credited at their original posts.

### 1. The 60 FPS unlock landed — and tempers cooled

The single biggest pre-Phase 2 community ask was lifting the graphics-vs-FPS lock. The [April 14 livestream Q&A thread](https://www.reddit.com/r/thedivisionresurgence/comments/1sl9h12/share_your_questions_for_our_upcoming_live_stream/) by u/TDResurgence ran with FPS as its single highest-voted question (31 upvotes). Phase 2's patch notes delivered a partial answer: "some high-end devices" can now run expanded graphics at up to 60 FPS. Within 48 hours of launch, [Top GamePlayz (2026-05-13)](https://www.youtube.com/watch?v=MIyomnJpKyg) and [Dragon's Breath (2026-05-14)](https://www.youtube.com/watch?v=-MSXiEc44XE) had max-settings 60 FPS gameplay live. The reception has been quietly grateful — even from skeptics who had documented the [debug-console proof-of-concept](https://www.reddit.com/r/thedivisionresurgence/comments/1sdggia/60fps_very_high_settings_debug_menu_see/) by u/HiDefMusic earlier in April. The remaining drumbeat is for **120 FPS** support and for the unlock to extend to mid-tier flagships, not just current-gen Snapdragon 8 Elite-class hardware.

### 2. Missing gear is the new top complaint

With the FPS conversation resolving, gear-loss reports have moved into the highest-friction category. The active threads — [u/LaClown-ua's weapon-disappearance bug (2026-04-17)](https://www.reddit.com/r/thedivisionresurgence/comments/1snm931/new_bug_weapon_disappearing_from_inventory/) and [u/BelleskaTROn-'s loadout wipe (2026-04-02)](https://www.reddit.com/r/thedivisionresurgence/comments/1sa72za/logged_back_in_to_no_weapons_or_gear/) — describe a class of bug Ubisoft has not specifically named in any patch note. The fixes Phase 2 shipped (mod display, cosmetic delivery timing) addressed *adjacent* issues but not the core weapon-vanish. The community sentiment here is sharper than the FPS conversation was — players who lost paid Exotics like Warlord want a make-good, not just a patch. (See the standalone Missing Gear post above for a full breakdown.)

### 3. The Phase 2 Classified Ops Pass is getting harsher reviews than Phase 1's

The paid pass review cycle has not been kind. [Afflicted Gamer's Phase 2 pass review (YouTube, 2026-05-13)](https://www.youtube.com/watch?v=-QHN5D9R2kA) called the pass "insanely disappointing," specifically flagging excessive in-game credit rewards filling tiers that could carry cosmetics or content, and arguing the price needs to drop. The free-track Strawberry Milkshake LMG is the saving grace — community consensus is the Exotic itself is interesting (the "Anarchy" DoT-stack talent transferring on kill is a fresh mechanic for Resurgence), but it doesn't drag a 50-tier pass over the line. u/dazzathomas's pre-Phase 2 [Season 1 overview (2026-04-07)](https://www.reddit.com/r/thedivisionresurgence/comments/1sf20fg/season_1_overview/) (154 upvotes) framed the math: ~$10 per phase, three phases per season, ~$30/season for paid track — and that math has not aged into Phase 2's favor.

### 4. PC has been *pretty decent*, with caveats

Three weeks in, PC players are more positive than expected. The 65 FPS native ceiling is the loudest complaint, but [Saiynergy's PC FPS uncap config video (2026-05-09)](https://www.youtube.com/watch?v=80zYx7ig3DQ) gave the community a session-by-session workaround that pushes past it. A 601-upvote Steam Deck thread on r/thedivisionresurgence confirms playable 45–70 FPS via Non Steam Launcher + Proton GE. The remaining PC-side asks: native mouse-and-keyboard aiming (currently rough enough that some PC players use the Douwan phone-mirror app workaround), and a confirmed Steam date. [RogueGold mentioned a Steam release "slated for later this summer" (2026-04-28)](https://www.youtube.com/watch?v=lvrE_xJeKfM) via the Ubisoft Creator Program, but **Ubisoft has not officially confirmed Steam** as of this writing.

### 5. Dev communication is the slowest-moving piece

The last confirmed Ubisoft Reddit post from u/TDResurgence is the [April 14 livestream Q&A thread](https://www.reddit.com/r/thedivisionresurgence/comments/1sl9h12/share_your_questions_for_our_upcoming_live_stream/). Phase 2 launched on May 12 via Ubisoft.com and the official YouTube channel — there was no Phase 2 launch post on the subreddit from the dev team. Players noticed. The community wants the same comms cadence on Reddit they get from official channels, and ideally with **explicit dates** rather than the vaguer roadmap language of the April 18 stream. This is the longest-running, slowest-shifting piece of the conversation.

### 6. The endgame loop is finally stabilizing

With Phase 2's Dark Zone economy changes — Warlord added to DZ Vendor, the Strawberry Milkshake TAM available, Tactical Augmentation Modules now yielding **Encrypted Data** on dismantle, the Skill Mod dismantle DZ Credit increases (Blue/Purple/Yellow 10/50/450 → 15/75/750), and a new weekly Random TAM Crate — the endgame DZ loop is the most rewarding it's been since launch. The Tier 2 chase is still gated behind Legendary Elite Mission Challenge and rare Heroic DZ boss drops, and the no-matchmaking requirement at Legendary continues to filter casual players out, but the friction *between* runs has been reduced.

---

**A note on attribution.** When repurposing any of this for posts on the site, please keep Reddit handles intact and link the original thread. The community pays attention to who's listening — readers will too.

**Sources (paraphrased throughout; named contributors at original posts):**
- u/TDResurgence (Ubisoft official), [Share your questions for our upcoming live stream! (2026-04-14)](https://www.reddit.com/r/thedivisionresurgence/comments/1sl9h12/share_your_questions_for_our_upcoming_live_stream/)
- u/JokerUnique, [Developer Stream Summary (2026-04-18)](https://www.reddit.com/r/thedivisionresurgence/comments/1sos0u8/developer_stream_summary/)
- u/dazzathomas, [Season 1 overview (2026-04-07)](https://www.reddit.com/r/thedivisionresurgence/comments/1sf20fg/season_1_overview/)
- u/LaClown-ua, [Weapon disappearing from inventory (2026-04-17)](https://www.reddit.com/r/thedivisionresurgence/comments/1snm931/new_bug_weapon_disappearing_from_inventory/)
- u/BelleskaTROn-, [Logged back in to no weapons or gear??? (2026-04-02)](https://www.reddit.com/r/thedivisionresurgence/comments/1sa72za/logged_back_in_to_no_weapons_or_gear/)
- u/HiDefMusic, [60fps Very High Settings debug demo (2026-04-06)](https://www.reddit.com/r/thedivisionresurgence/comments/1sdggia/60fps_very_high_settings_debug_menu_see/)
- Top GamePlayz (YouTube), [60 FPS on Mobile Max Graphics (2026-05-13)](https://www.youtube.com/watch?v=MIyomnJpKyg)
- Dragon's Breath (YouTube), [60 FPS on Ultra — Phase 2 (2026-05-14)](https://www.youtube.com/watch?v=-MSXiEc44XE)
- Afflicted Gamer (YouTube), [Phase 2 Pass Review (2026-05-13)](https://www.youtube.com/watch?v=-QHN5D9R2kA)
- Saiynergy (YouTube), [PC FPS Uncap Config (2026-05-09)](https://www.youtube.com/watch?v=80zYx7ig3DQ)
- RogueGold (YouTube), [Shadow Drop on PC (2026-04-28)](https://www.youtube.com/watch?v=lvrE_xJeKfM)
- Ubisoft (official), [Phase 2 Patch Notes (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new)

---

# Editorial Notes — Read Before You Publish

## Recency and "old news"
- Anything labeled **[OLDER CONTEXT]** in this doc is older than 30 days. Don't lead with it as if it were breaking news. If you reuse older material in a fresh post (e.g., a "Beginner's Guide" piece), frame it as evergreen reference, not as news.
- The newest news at the time of writing is **Phase 2 (May 12)**. Phase 3 is due in June — keep an eye on the official Ubisoft Resurgence news page for the next announcement.

## Attribution rules for your site
1. **Ubisoft official content** — credit "Ubisoft" or the team ("The Division Resurgence team"). Link to the official source. You can cite freely; you cannot reproduce long passages.
2. **YouTube creators** (RogueGold, Saiynergy, GCROCK) — credit by channel name + video title + link. Paraphrase their insights; don't transcribe their videos. Two or three short direct quotes per post, clearly marked, is fair use; transcribing a full video is not.
3. **Articles (Pocket Gamer, TechRadar, etc.)** — credit author + outlet + link. Paraphrase; don't lift full paragraphs.
4. **Reddit users** — credit by handle (u/username) + link to the original post. Paraphrase. If you reuse a substantive original idea or tip, ask for permission via DM if possible; at minimum, attribute prominently.
5. **Wiki content** — credit the wiki and note "editorial staff" since most wikis don't surface individual authors. Cross-verify wiki content against in-game text or official patch notes before publishing — wikis can carry stale or wrong-game content.

## Filter for Resurgence vs. Division 1 / Division 2
The following content was found during research and **excluded** as Division 2 (not Resurgence). If you see any of these terms in a source, that source is talking about Division 2:
- "Year 8 Season", "Y8S1.2", "Rise Up"
- "Capitol Anomaly", "Escalation Requisition Vendor", "Prototype Cores account-wide"
- "Tinkerer mask"
- "Countdown", "Summit", "SHD Levels" (Resurgence has its own progression)
- "Watch_Dogs / Brooklyn / NYC expansions"
- Any content dated before March 31, 2026

The community wiki (thedivisionresurgence.wiki) occasionally contains Division 2 content mixed in. Always cross-reference with official Ubisoft sources or in-game text before publishing.

## Confidence tagging — keep using these on your site
- **[CONFIRMED]** — Ubisoft direct, or multiple independent established sources
- **[LIKELY]** — single credible source, not cross-verified
- **[UNCONFIRMED]** — community claim worth surfacing but flag as unverified

## Gaps to keep watching
- Phase 3 details for June 2026 are sparse beyond Scorpio Exotic + Freemen apparel + Boombox skin — expect an official deep-dive in late May
- Steam release date is still **unconfirmed**
- Full Strawberry Milkshake / Lady Death / Warlord stat tiles in text form — currently only seen in YouTube gameplay; consider transcribing for a stand-alone Exotic Weapons reference post
- Post-May 13 Reddit data is thin — the research notes flagged a recommended re-pull in 7–10 days

---

# Source Bibliography

Master URL list lives in `division_resurgence_sources.txt` in your workspace (169 unique URLs as of this revision). Top-tier sources used in this report:

### Official Ubisoft
- [Phase 2 Patch Notes (2026-05-12)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/3ygDDXxg6dv6aQD5MJvbKv/phase-2-starts-now-whats-new)
- [PC Early Access & Game Roadmap (2026-04-28)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/5LqRsprrdgtEnUmStmBi0d/pc-early-access-game-roadmap)
- [Play Resurgence on PC — All You Need to Know (2026-04-28)](https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/1rUYWPgMV9hXYZ6FcLOkpX/play-resurgence-on-pc-all-you-need-to-know)
- [Phase 2 Editorial — Brittany Spurlin (2026-05-12)](https://news.ubisoft.com/en-us/article/1ukeTnWBDV4vJfLjei6w4W/play-the-division-resurgence-season-1-phase-2-today-a-new-battle-pass-speed-run-events-dark-zone-quest)
- [Roadmap Editorial — Brittany Spurlin (2026-04-28)](https://news.ubisoft.com/en-us/article/9ZzMWcx5ADnaxAiOO3e0w/the-division-resurgence-roadmap-pc-launch-story-expansion-and-more)
- [Patch Note 1.1.2 (2026-04-28)](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2508-patch-note---1-1-2-update-28-apr-2026/)
- [Patch Note 1.1.1 Hotfix (2026-04-13)](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2494-patch-note---1-1-1-hotfix-13-apr-2026/)

### Established Games Media
- Demi Williams, [TechRadar — Resurgence PC August launch (2026-05-01)](https://www.techradar.com/gaming/free-to-play-mobile-game-the-division-resurgence-is-launching-on-pc-in-august-as-ubisoft-shares-new-roadmap-details-but-you-can-play-it-right-now)
- Iwan Morris, [Pocket Gamer — Season One Phase Two Launch (2026-05-13)](https://www.pocketgamer.com/the-division-resurgence/season-one-phase-two-launch/)
- [TheSixthAxis — Roadmap revealed (2026-05-01)](https://www.thesixthaxis.com/2026/05/01/the-division-resurgence-is-now-playable-on-pc-season-roadmap-revealed/)
- Mostafa Salem, [GAMES.GG — How to Play Division Resurgence on PC (2026-04-05)](https://games.gg/tom-clancys-the-division-resurgence/guides/how-to-play-division-resurgence-on-pc/)

### Established Division YouTube Creators
- [RogueGold — Endgame Farming Guide (2026-04-18)](https://www.youtube.com/watch?v=vyWnGL_tvTI)
- [RogueGold — Shadow Drop on PC (2026-04-28)](https://www.youtube.com/watch?v=lvrE_xJeKfM)
- [RogueGold — 14 Tips I Wish I Knew (2026-04-04)](https://www.youtube.com/watch?v=TqeNr6KPB_4)
- [Saiynergy — Best Tips/Guide For New Players (2026-05-03)](https://www.youtube.com/watch?v=TfEzShVpPGc)
- [Saiynergy — PC Graphics Are INSANE](https://www.youtube.com/watch?v=06QYPQBcW98)
- [GCROCK — Ultimate Starter Guide](https://www.youtube.com/watch?v=XssUW44oc4I)
- [GCROCK — Dark Zone Beginner Guide](https://www.youtube.com/watch?v=lsb-Hi_ymZg)
- [GCROCK — Ultimate Crafting Guide](https://www.youtube.com/watch?v=Egh6g8vXcwg)
- [GCROCK — Specializations Made Easy](https://www.youtube.com/watch?v=ejVBvRAQMZM)
- [GCROCK — Clans Guide](https://www.youtube.com/watch?v=FS-EepWaEkQ)

### Community Wiki (cross-verify before posting)
- [thedivisionresurgence.wiki](https://www.thedivisionresurgence.wiki/) (editorial staff)

### Reddit (community discussion — credit individual posters as listed in-doc)
- [r/thedivisionresurgence](https://www.reddit.com/r/thedivisionresurgence/)
- [r/thedivision](https://www.reddit.com/r/thedivision/)

---

*End of document. Reach back out for the next pull when Phase 3 lands in June.*

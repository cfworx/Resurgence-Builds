---
title: "Known Issues Trello Board Breakdown"
publishDate: "2026-06-04"
author: "RapidF5"
featuredImage: "/images/news/division-resurgence-trello-known-issues-board.webp"
imageAlt: "The Division Resurgence Known Issues Trello board showing six columns: Reported, Investigating, In Progress, Fix Ready, Fix Live, and Backlog with all active bug cards"
description: "Division Resurgence public Trello board breakdown: every known bug, fix timeline, and what the dev team is actively working on."
tags: ["News", "Known Issues", "Bugs", "Patch Notes", "Trello", "Community", "Lady Death", "Strawberry Milkshake", "Brain over Brawn", "Phase 3"]
shareTitle: "Every bug on the board, decoded"
shareText: "Division Resurgence just dropped a public Trello board tracking every known issue. Here is every card, every status, and what is actually getting fixed. Share this with your squad."

faqs:
  - question: "Where is the Division Resurgence known issues Trello board?"
    answer: "The official Trello board is live at trello.com/b/qTP1a9cv. It is titled The Division Resurgence Known Issues and is publicly viewable without a Trello account. The board was announced on June 4, 2026 by the official @TheDivMobile account on X."
  - question: "What bugs are currently being fixed in Division Resurgence?"
    answer: "As of June 4, 2026, the In Progress list includes the Outpost Annihilation mission bug, payment processing issues, the Network Failure login popup, Dark Zone Tactical Augmentation reward claiming (Shotgun TAM is fixed, Marksman Rifle and LMG TAMs still being worked on), missing Simplified Chinese translations, Thermobaric Barrel balance, and an anti-cheat tool for leaderboard cleanup."
  - question: "Is the Lady Death bug fixed in Division Resurgence?"
    answer: "Yes. The Lady Death exploit, which the team calls the LadyBug, is in the Fix Live column. The issue was that Optimal Range on some weapons could extend beyond the maximum bullet damage falloff range, creating an inverse effect on damage output. The fix is already live in the current patch."
  - question: "Is Brain over Brawn fixed in Division Resurgence?"
    answer: "Yes. Brain over Brawn is in the Fix Live column. The team confirmed it was providing too much damage in some cases and has shipped a fix. The team also specifically asked the community not to share details about the specific interactions it could create."
  - question: "What is the Strawberry Milkshake talent bug in Division Resurgence?"
    answer: "There are two Strawberry Milkshake issues on the board. First, the LMG comes with level 1 talents while other exotics come with level 2 talents, which is in the Reported column. Second, the Anarchy talent is transferring stacks to allies under some conditions instead of only to enemies, which is in the Investigating column."
  - question: "When will the Division Resurgence Medic Courage focus be fixed?"
    answer: "The Trello board specifically states that the Medic Courage focus requirements fix will be implemented in the Season 1 Phase 3 update. Community trackers are pointing at June 23, 2026 as the Phase 3 start date."
  - question: "How do I report a bug in Division Resurgence?"
    answer: "The Trello board is view-only for the public. You cannot comment on or upvote cards directly. To report a bug, use the official Ubisoft support channels. The Investigating list notes that the team needs video, images, or reproduction steps to replicate bugs in their testing environment, so include as much detail as possible when reporting."
---

## Reported

This list is for issues that have been reported by players and recorded internally. The team is aware but has not started investigating yet.

### LMG "Strawberry Milkshake" Talent Discrepancy

The board notes that other exotic weapons come with level 2 talents while the Strawberry Milkshake LMG comes with level 1 talents. This is the free Phase 2 exotic everyone has been farming, so the difference matters. If you want a refresher on what Anarchy actually does at its current level, the [Strawberry Milkshake database page](/database/exotic-weapons/strawberry-milkshake/) has the full talent text, and our [Milkshake Machine build](/builds/milkshake-machine-strawberry-milkshake-lmg-build/) shows how it plays in practice.

### Request to Move the Top Right UI Buttons

This card is on the board with no description text. It is a logged request, nothing more. There is a related card in the Backlog list about the top right map placement blocking menus, which we will cover below.

## Investigating

The team is looking into these and gathering information such as video, images, files, or reproduction steps. The board specifically notes that the team often needs video, images, or steps taken before the issue occurred so they can reproduce the bug in a testing environment. If you can record the bug happening, you are doing the team a favor.

### Broken iOS Gamepad Support

Per the card: the team is investigating issues where controllers are not working as intended on iOS. If you play on an iPhone or iPad with a Backbone, Razer Kishi, or any other MFi controller and have hit weirdness, this is the active investigation thread.

### Items Disappearing From Player Inventory

The card states that many players are reporting items disappearing from their inventory, and the team is currently investigating the cause. No specifics on which items or which inventory tabs are affected. If you have lost gear, the team is aware. Document what disappeared and when, because that is exactly the kind of evidence the Investigating stage is built to collect.

### Reward for "A Gift" Side Mission Not Appearing in Stash

The card notes that it is possible some players may not be able to redeem the reward for the side mission **A Gift** because the reward is not being properly sent to the players' stash. If you ran A Gift and never saw the reward show up, you are not crazy and you are not alone.

### "Aegis Burst" Issue

The community has been calling this one the Aegis Burst. The card says having the **Aegis Operation** sub focus seems to alter damage values while firing. The team is investigating. If you have been wondering why your Aegis numbers look like a slot machine, this is the card to watch.

### Clan Leader Inactivity

There are actually two cards on the board about this. The first says clan leaders are losing their role after one day of inactivity and that this delay should be increased. The second card, titled "Clan leader inactivity timing seems too short," has no description but is clearly the same topic logged twice. Either way, the message is consistent: the inactivity timer is too tight, and the team is looking at it.

### "Speed" Hack in Speedrun Challenge

The card says the team is currently investigating a possible speed hack where players are able to move faster than intended. Notice the wording: the team has not confirmed it is a hack yet, they are investigating whether it is. Either way, leaderboard integrity is on their radar, which leads into another card we will see in the In Progress list.

### Strawberry Milkshake Transfers Stacks to Allies in Some Conditions

This card has no description, just the title. By the talent text on the [Strawberry Milkshake database page](/database/exotic-weapons/strawberry-milkshake/), Anarchy stacks are supposed to transfer to nearby enemies when a debuffed enemy dies. Transferring to allies would not be intended. The team has it logged.

## In Progress

The team has the information they need to fix these. They also need to test the fix and make sure it works before it ships to the live game.

### Side Mission "Outpost Annihilation" Issue

The card says the team is aware of an issue with this mission not progressing as planned after defeating the Rikers. If your Outpost Annihilation run stalled out after the fight, this is the one.

### Some Payments Are Being Processed But Not Unlocking In Game

The card says the team is aware of an issue where some payments are being correctly processed but the reward is not being distributed in game. This is exactly the right category for this kind of bug because it actually involves real money. Active work is happening.

### Network Failure Popup

The card says the team is aware that many players are hit by a "Network Failure" popup when trying to log into the game. If you have been bouncing off the login screen, you are not alone, and the fix is being worked on.

### Dark Zone Tactical Augmentation Reward Not Available to Be Claimed

The card has the most concrete progress notes on the board. The TAM rewards (Tactical Augmentation Modules) for some Dark Zone weapon classes are not claimable after mission completion. Status per the card:

- **Currently fixed:** Shotgun TAM
- **Being fixed:** Marksman Rifle and LMG TAMs

If you ran the Dark Zone mission for the Shotgun TAM and it was stuck, try claiming it again. The Marksman Rifle and LMG ones are still being worked on.

### Missing Texts and Translations in Simplified Chinese

The card says the team is aware of missing texts and translations in the Simplified Chinese language option for the game. Active work, no ETA on the card.

### Thermobaric Barrel May Be Too Strong

The card simply says: "We are looking into balancing this." Not a bug per se, more of a balance pass. If you have been printing damage with a Thermobaric Barrel build, enjoy it while it lasts. Also, if you have not seen what a properly tuned weapon mod can do, the [build database](/database/) covers what is meta and what is not.

### Anti-Cheat Tool to Ban Cheaters and Remove Them From Leaderboards

The card title is the description: the team is adding a tool in game allowing them to ban cheaters and remove them from the leaderboards. This pairs with the speed hack investigation in the previous list. The leaderboard cleanup capability is being built. For middle aged dads who actually grind for their ranks instead of pressing turbo buttons, this is good news.

## Fix Ready

The fix has been completed and tested and is ready to be implemented in a future update or patch.

### Locked Items Are Not Actually Locked

The card says the team is aware of a bug where it is not possible to lock items in your inventory. Fix is built and waiting for a patch. Until then, do not assume the lock icon is going to save your favorite roll from a stash cleanup. Read every item twice before you dismantle. Ask me how I know.

### Vendors Not Displaying Items Available to Sell

The card says the team is currently working hard to resolve the issue preventing vendors from displaying items available to sell. Fix is in this list, so it is ready to ship in an upcoming update.

### Medic "Courage" Focus Requirements

The card specifically notes: a fix will be implemented in the **Season 1 Phase 3 update**. That is the next major content drop. So if you have been frustrated with Courage's focus requirements as a Medic, mark Phase 3 on your calendar.

### Applied Demolition Is Underwhelming

The card says this will be balanced for a future patch. So Demolitionist players, your Applied Demolition is getting a look. No specific numbers, but the fact that the team has it in Fix Ready means a tuning pass has been approved.

## Fix Live

These are already patched into the live game. Update your client to make sure you are on the latest version.

### Lady Death Able to Do Massive Damage (the "LadyBug")

This one has personality, so the card text is worth quoting closely. The team fixed an issue where, under certain conditions, **Optimal Range** of some weapons could be extended beyond the maximum bullet damage falloff range, creating an inverse effect on damage output. This was initially seen as a bug with the Lady Death exotic SMG, which the team affectionately calls the **LadyBug**. If you were running Lady Death builds last patch and felt like you were melting elites faster than the math should allow, that is why. It is now resolved.

The [Lady Death database page](/database/exotic-weapons/lady-death/) has the post-fix talent and stat block if you want to recalibrate your build.

### Brain Over Brawn OS Protocol

The card is direct about this one. The team was monitoring unusual effects from Brain over Brawn providing too much damage in some cases. Because Brain over Brawn is a standard OS Protocol for an Engineering build, the team specifically requested that players **do not share information about the specific interactions it can create** if they are aware of them. The fix has shipped so that Brain over Brawn behaves as intended.

Translation: if you found the magic combo last patch, please do not turn it into a YouTube short. If you want a clean read on how Engineering builds actually function inside the OS Protocols system, the [OS Protocols database](/database/os-protocols/) covers the foundation.

## Backlog

The header card for this list says these are issues where resolution requires more time or additional resources and will be revisited at a later time, or the team has decided the issue is minor and does not require an immediate fix.

### Healing Hive on Steroids

The card says the team is aware of a bug leading Healing Hive to trigger multiple times per second under some conditions, providing too much healing. It is in the Backlog, so it is not getting an immediate fix, but it is logged. If your Hive is overperforming, the team knows.

### Weapon Proficiency Rewards Are Locked and Prevent Progress

The card says some players are still encountering issues where the weapon proficiency rewards for certain weapons cannot be claimed, which prevents further improvement of weapon proficiency levels. Logged but parked for now.

### Placing the UI Map in the Top Right Corner Blocks Underlying Menus

This is the one that has a real workaround. The card says placing the map UI element in the top right corner will block the underlying keys, specifically the menu button that lets players remove the map from the top right. The current fix per the team: connect a Bluetooth keyboard or controller to access the menu and reset the UI. If you cannot reach your menus right now and you have not glued a map to your screen on purpose, that is the fix until they patch it.

## What This Means for the Community

A few things stand out from reading the whole board top to bottom.

First, the team is being unusually transparent about exactly what they know and what they are doing about it. Cards are written in plain language, with real status, real progress notes, and in one case (the Dark Zone TAMs) a sub-status of what is fixed versus what is still being worked on. That level of detail on a public board is rare.

Second, the team is treating exploits and balance issues with the same process as bugs. Brain over Brawn is in Fix Live with a respectful ask to the community not to spread the interaction. Thermobaric Barrel is in In Progress under balance. Applied Demolition is in Fix Ready as a buff target. The leaderboard cheating problem is being addressed by building an actual in-game banning tool, not just patching one exploit at a time.

Third, this board is a strong hint about what is landing in **Season 1 Phase 3**. We already know from the [Season 1, 2, 3 roadmap](/news/season-1-2-3-roadmap/) that Phase 3 is the next major drop with the Scorpio exotic shotgun arriving as the free Phase 3 exotic (see the [Scorpio and Diamondback coverage](/news/scorpio-diamondback-coming-to-division-resurgence-june-2026/) for context). The Trello board specifically calls out that the Medic Courage focus fix will ship in Phase 3. Expect more of the Fix Ready cards to clear out in that same patch window.

## How to Use This Board Going Forward

Three habits that will save you time:

1. **Before reporting a bug, check the board.** The board is view-only for the public, so you cannot upvote or comment on cards. But you can confirm whether your issue is already logged. If it is, sit tight, it is already in the pipeline. If it is not, report it through the official support channels with as much detail as you can.
2. **Record video when you hit a bug.** The Investigating list explicitly says the team needs video, images, or reproduction steps. Even 10 seconds of screen recording massively speeds up replication in their test environment.
3. **Check Fix Live before you ragequit.** If you have not updated your client, you might be playing on a version that still has bugs the rest of us have already moved past.

The full board is at [trello.com/b/qTP1a9cv](https://trello.com/b/qTP1a9cv). Bookmark it next to your favorite [build pages](/database/) and check it whenever something feels off.

---

**Related Reading:**
- [Season 1-2-3 Roadmap](/news/season-1-2-3-roadmap/) — the full roadmap breakdown
- [Scorpio and Diamondback Coming to Division Resurgence](/news/scorpio-diamondback-coming-to-division-resurgence-june-2026/) — Phase 3 exotics preview
- [Exotic Weapons Database](/database/exotic-weapons/) — every current exotic with stats and talents
- [Strawberry Milkshake Database Page](/database/exotic-weapons/strawberry-milkshake/) — full talent text and stat block
- [Lady Death Database Page](/database/exotic-weapons/lady-death/) — post-fix stats
- [OS Protocols Database](/database/os-protocols/) — every OS Protocol in the game

---

## Sources

- The Division Resurgence on X: [@TheDivMobile, June 4, 2026](https://x.com/TheDivMobile/status/2062606335246553242)
- Official Trello board: [The Division Resurgence Known Issues](https://trello.com/b/qTP1a9cv)
- All card text quoted in this post is sourced verbatim from the public Trello board as of June 4, 2026

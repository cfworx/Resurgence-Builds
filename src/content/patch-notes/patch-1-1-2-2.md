---
title: "Patch 1.1.2.2 Notes — GM Access Fix, Audio Crash Fix, and What's Actually Working"
version: "1.1.2.2"
patchDate: "2026-05-29"
author: "RapidF5"
summary: "Division Resurgence Patch 1.1.2.2 deployed May 29, 2026. Audio crash fix, guest account fix, DZ Tactical Augmentation reward fix, roaming Network Failure fix, plus the full story on the GM permissions exposure and what happened next."
featuredImage: "/images/patch-notes/division-resurgence-patch-1-1-2-2-vendor-bug-hero.jpg"
imageAlt: "Division Resurgence vendor sell screen showing only locked items available after the May 29, 2026 patch update"
shareTitle: "Warn your squad"
shareText: "Patch 1.1.2.2 just dropped and the vendor broke again. Share the fix before your friends uninstall."

faqs:
  - question: "What is Division Resurgence Patch 1.1.2.2?"
    answer: "Patch 1.1.2.2 is the May 29, 2026 update that included both a server maintenance window and a client update through the Play Store and App Store. It fixed an audio crash bug, a guest account login bug, the missing Dark Zone Shotgun Tactical Augmentation reward, the roaming Network Failure popup, and several smaller issues."
  - question: "What was the GM permissions bug in Division Resurgence on May 29, 2026?"
    answer: "During the maintenance window for Patch 1.1.2.2, a backend developer tool used for testing was briefly accessible to some players who were already in-game when servers went down. Ubisoft community moderator Ubi_Ticksy confirmed on the official Discord that it was an accidental misconfiguration during deployment. Servers were taken down quickly to lock it back up, and players who used the GM interface are reportedly being banned."
  - question: "Is the vendor still broken after the May 29 patch?"
    answer: "A small number of players reported the vendor showing only locked items in the sell window right after the patch. The community fix is to fully close the game, clear cache if your platform allows, and restart. That has resolved it for most affected players."
  - question: "Did the patch fix Outpost Annihilation?"
    answer: "No. The Outpost Annihilation side mission west of Dante's Run is still on the under investigation list per the dev team. They have acknowledged it directly and said additional DZ mission fixes are coming."
  - question: "Will players who used the GM bug be banned?"
    answer: "Per community moderator messaging on Discord, yes. Ubisoft's response was that the GM access was an accidental exposure, not an authorized feature, and players who exploited it during the brief window will face account action. No rollback was issued because the exposure window was short."
  - question: "Where can I find the official Patch 1.1.2.2 notes?"
    answer: "The official Patch 1.1.2.2 notes are posted on the Ubisoft Mobile Helpshift support portal and mirrored on r/thedivisionresurgence."
---

A surprise maintenance window dropped on May 29, 2026 and dragged Patch **1.1.2.2** into the wild with it. Servers went down without much warning, came back up a few hours later with a short list of fixes, a client update through the Play Store and App Store, and a much longer side story about a backend access issue that had the community talking. Here's the clean breakdown of what shipped, what's still in the queue, and what the dev team is acknowledging.

## TL;DR

- **Patch 1.1.2.2 deployed May 29, 2026** during a server maintenance window. A client update is also rolling out through the Play Store and App Store, so if the game prompts you to update, do it before logging in.
- Five fixes shipped: audio crash, guest account loss, DZ Tactical Augmentation shotgun reward, roaming Network Failure popup, and a handful of small bugs.
- A separate **GM permissions issue** was discovered during the maintenance window and the team took servers down quickly to resolve it. Ubisoft community moderator confirmed it was an accidental misconfiguration, not a hack. Players who exploited it are reportedly facing bans.
- The vendor "can't sell" bug **came back briefly post-patch** for some players. Restarting the game appears to clear it.
- Outpost Annihilation, the Tactical Augmentation claim from the DZ quest, and a few other long-standing issues are still on the open list.

---

## Patch 1.1.2.2 — Official Fixes

These are the notes posted by the dev team through the [official Helpshift support portal](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2517-patch-note---1-1-2-2-update-29-may-2026/) and the [r/thedivisionresurgence PSA thread](https://www.reddit.com/r/thedivisionresurgence/comments/1tr2uph/patch_note_1122_update_29may2026/).

### Stability and crashes

- Fixed an audio bug that was causing **crashes in some cases**. If you were getting booted during firefights or in heavily-populated zones, this should help.

### Account and access

- Fixed an issue where **guest account information could be lost when logging in**. Guest data should now persist correctly between sessions.

### Dark Zone rewards

- Fixed an issue where players were **not receiving the Shotgun Tactical Augmentation reward** for the recent DZ event. If you completed the DZ mission and were waiting on your reward, the team confirms this is fixed and the reward should arrive.

### Connectivity

- Fixed an issue where **roaming accounts would get a Network Failure popup** in different scenarios. If you play on mobile data, on a VPN, or while traveling, you should see fewer of these.

### Catch-all

- "Fixes to a few minor bugs and issues." That's the literal note. We've all been there.

---

## Known Issues Still in the Queue

The dev team also said directly: *"We are aware of more issues regarding the DZ missions and are working on fixing these also."* Translation: this patch is not the end of the cleanup. From the prior patch list and the community trackers, here's what's still under investigation as of today:

- The **Outpost Annihilation** side mission west of Dante's Run still won't progress
- The **Tactical Augmentation claim** from the DZ quest is still unclaimable for some players
- iOS gamepad support is still flaky
- Some Ubisoft Shop purchases are still not being delivered in game
- Weapon proficiency blockers in some scenarios
- The 13th Collectible SHD crate is still mathematically missing

If you're hitting any of these, contact in-game support directly. The team has been pretty responsive on individual tickets even when the broader fix isn't out yet.

---

## About the GM Permissions Issue

You may have seen Reddit threads today flagging that some players reportedly had access to in-game GM (Game Master) commands during the maintenance window. We want to walk through this calmly because the facts matter, and the dev team has actually been transparent about what happened.

### What happened

During the deployment of Patch 1.1.2.2, the backend tools that the developers use for testing and troubleshooting were briefly accessible from inside live game sessions. Players who were already logged in when the maintenance started weren't booted, and a small number of them were able to see and interact with the GM interface.

### How we know

Community moderator **Ubi_Ticksy** confirmed it directly on the official Discord. Two screenshots circulating on Reddit show the conversation:

![Discord screenshot showing Ubisoft moderator Ubi_Ticksy confirming servers were taken down to resolve the GM permissions issue during the Patch 1.1.2.2 deployment on May 29, 2026](https://preview.redd.it/p3s4wzowa44h1.jpeg)
*Ubi_Ticksy (Ubisoft mod) confirming on the official Discord that servers were taken down to resolve the GM access issue. Screenshot via [u/Careful_Grapefruit_4 on r/thedivisionresurgence](https://www.reddit.com/r/thedivisionresurgence/comments/1tr2ajq/updateconcerns/).*

![Discord screenshot showing Ubisoft moderator Ubi_Ticksy explaining the GM permissions exposure was an easy mistake during the Division Resurgence Patch 1.1.2.2 deployment](https://preview.redd.it/s4bj7xita44h1.jpeg)
*The official line: it was an accidental misconfiguration during deployment, not a hack or a leak. Same Discord thread.*

So this is on the record from Ubisoft itself: it was an accidental dev tool exposure during the deploy, the team caught it, and they pulled servers down to lock it back up. That's not great, but it's also not the apocalypse some posts are making it out to be. Live service deploys with backend tooling are one of the hardest things to get right, and even big studios trip on them. The fact that they noticed quickly and announced it quickly is actually how this kind of thing is supposed to be handled.

### What about the players who used it?

Per community moderator messaging on Discord, **players who used the GM menu will be banned.** No rollback was issued because the exposure window was short and the vast majority of accounts were not affected. If you're seeing a player with a full god-roll set across every slot with zero recalibrations, that's the kind of profile the team will be looking at. Report it through the in-game support button.

### Should you be worried?

If you didn't touch the GM interface, which 99% of players couldn't even see, you have nothing to do. Keep playing. The team caught the issue, deployed the lockdown, and shipped the patch. Use the in-game support button if you notice anything weird in your account, like missing items or unexplained credit changes.

---

## Community Reaction in the First 12 Hours

Here's the temperature in the subreddit right now, sourced from real posts on [r/thedivisionresurgence](https://www.reddit.com/r/thedivisionresurgence/).

- **u/IllIZEROlIIl — "Salesman broken again after patch update"** ([source](https://www.reddit.com/r/thedivisionresurgence/comments/1tr5vnb/salesman_broken_again_after_patch_update/)) — The vendor went sideways for some players right after the patch, only showing locked items in the sell window. Community fix that worked for most: close the game, clear cache, restart. Annoying, but a one-minute solve.

![Division Resurgence vendor sell screen showing only locked items available to sell after the May 29, 2026 Patch 1.1.2.2 update](https://i.redd.it/c9i89l9ek34h1.jpeg)
*Locked-items-only vendor view post-patch. Restart resolved it for most players. Screenshot via [u/IllIZEROlIIl](https://www.reddit.com/r/thedivisionresurgence/comments/1tr5vnb/salesman_broken_again_after_patch_update/).*

- **u/JA_Guyyy — "New patch update… old bugs returned 😂"** ([source](https://www.reddit.com/r/thedivisionresurgence/comments/1tr30ak/new_patch_update_old_bugs_returned/)) — Same vendor issue, same fix. OP's update on his own post: *"Closed and reopened the game and somehow the sell option is working again. This bug makes absolutely no sense."* The community has accepted that turning it off and on again is canonical.

- **u/tjking83 — "May 29th update still ain't fix network issues smh I give up"** ([source](https://www.reddit.com/r/thedivisionresurgence/comments/1tr37zj/may_29th_update_still_aint_fix_network_issues_smh/)) — Posted with a Network Failure screenshot. Note: the patch targets *roaming* Network Failures. If you're seeing Network Failures on your home WiFi or LTE, it's a different code path and the fix may not have caught it. Stay tuned.

- **u/mercury_1967 — "Update woes"** ([source](https://www.reddit.com/r/thedivisionresurgence/comments/1trfv46/update_woes/)) — The "please fix Outpost Annihilation" agent. You are not alone. We are tracking it. It is on the list.

- **u/saskurenai13 — "Sudden Update"** ([source](https://www.reddit.com/r/thedivisionresurgence/comments/1tr0ptv/sudden_update/)) — First post when servers went down. *"Did Ubi announce the update today? I mean all servers are currently in maintenance."* No, they didn't pre-announce. They got it out, they posted notes, and they answered questions in Discord while it was happening. That's a fair tradeoff for an emergency deploy.

---

## What to Do Right Now

1. **If your vendor is broken after the patch:** close the game, clear cache if your platform supports it, restart. Confirmed working for the majority of affected players.
2. **If you missed the DZ Shotgun Tactical Augmentation:** check your in-game mail. The reward should now be sitting there. If it isn't, file a support ticket with your account ID and the mission name.
3. **If you can't claim the Classified Ops Pass content:** contact in-game support directly. The patch fixed the purchase delivery and pricing, but if you bought it during the broken window, the team needs your transaction info to make it right.
4. **If you saw anything weird during the maintenance window** — characters with impossible stats, items appearing in your inventory you didn't earn, anything that screams "this isn't right" — file a ticket. The team is actively investigating GM-related account anomalies.
5. **Outpost Annihilation:** save your progress, log out, log back in. It hasn't fixed it for most people, but it costs you nothing to try.

---

## The Honest Take

This was a tough patch day. The fixes themselves are good and overdue. The GM permissions slip is the kind of thing that gets a senior engineer's heart rate up and triggers a postmortem. But here's what the dev team did right today:

- They caught it fast
- They took servers down to contain it
- They told the community what happened through official channels
- They named bans as the consequence for exploitation
- They shipped the actual patch the same day

Not every studio handles a misstep that cleanly. We've watched live service games sit on backend exposures for days. We've watched studios refuse to acknowledge anything went wrong. Today's response was bumpy, but it was honest, and that's worth something while the game continues to grow.

We'll be tracking the follow-up notes through the weekend. If anything material drops, we'll update this post and link the new patch notes here.

---

**Related Reading:**

- [Division Resurgence Codes](/guides/division-resurgence-codes/) — keep your wallet healthy
- [Division Resurgence Error Codes](/guides/division-resurgence-error-codes/) — decoder ring for whatever the game throws at you
- [Division Resurgence Device Compatibility](/guides/division-resurgence-device-compatibility/) — official supported device list
- [Division Resurgence Safe Codes](/guides/division-resurgence-safe-codes/) — every in-world safe combination we've verified
- [PC Emulator Head-to-Head](/guides/division-resurgence-pc-emulator-comparison/) — for the Mac diehards
- [Reddit Weekly Highlights — May 28](/news/reddit-weekly-highlights-may-28/) — the funniest community posts from this past stretch

---

**Image Credits:**

All Reddit and Discord screenshots in this article are credited inline to their original posters and link back to the source threads. Images are used for community commentary and patch documentation under fair use. If you're the original creator and want a takedown or different credit, reach out and we'll handle it same day.

---

**Sources:**

- [Patch Note 1.1.2.2 — Ubisoft Helpshift](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2517-patch-note---1-1-2-2-update-29-may-2026/) — Official patch notes
- [Patch Note 1.1.2.2 Update 29/May/2026 — u/TDResurgence](https://www.reddit.com/r/thedivisionresurgence/comments/1tr2uph/patch_note_1122_update_29may2026/) — Reddit PSA post
- [Update/Concerns — u/Valapul](https://www.reddit.com/r/thedivisionresurgence/comments/1tr2ajq/updateconcerns/) — GM permissions community thread with Discord moderator screenshots
- [Salesman broken again after patch update — u/IllIZEROlIIl](https://www.reddit.com/r/thedivisionresurgence/comments/1tr5vnb/salesman_broken_again_after_patch_update/) — Vendor bug return report
- [New patch update old bugs returned — u/JA_Guyyy](https://www.reddit.com/r/thedivisionresurgence/comments/1tr30ak/new_patch_update_old_bugs_returned/) — Vendor restart fix confirmation
- [May 29th update still ain't fix network issues — u/tjking83](https://www.reddit.com/r/thedivisionresurgence/comments/1tr37zj/may_29th_update_still_aint_fix_network_issues_smh/) — Network Failure reports
- [Sudden Update — u/saskurenai13](https://www.reddit.com/r/thedivisionresurgence/comments/1tr0ptv/sudden_update/) — Server downtime announcement thread
- [Update woes — u/mercury_1967](https://www.reddit.com/r/thedivisionresurgence/comments/1trfv46/update_woes/) — Outpost Annihilation report
- [Vendor Bug Is Back — u/asaling229](https://www.reddit.com/r/thedivisionresurgence/comments/1tr4cfj/vendor_bug_is_back/) — Vendor restart fix confirmation
- [The vendor bug is back — u/Honest-Divide6393](https://www.reddit.com/r/thedivisionresurgence/comments/1tr7l0w/the_vendor_bug_is_back_its_point_less_to_continue/) — Frustration report

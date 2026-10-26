---
title: "Patch 1.1.2 Notes"
version: "1.1.2"
patchDate: "2026-04-28"
updatedDate: 2026-10-24
author: "RapidF5"
summary: "Division Resurgence Patch 1.1.2 landed with PC Early Access on April 28: crash, mouse-and-keyboard and store fixes. No balance changes."
featuredImage: "/images/patch-notes/division-resurgence-patch-1-1-2-hero.jpg"
imageAlt: "Patch 1.1.2 in glowing orange letters on a dark background"
shareTitle: "Warn the timeline"
shareText: "Share this so your squad stops claiming 1.1.2 nerfed their gun. It changed zero balance numbers."

faqs:
  - question: "What changed in Division Resurgence Patch 1.1.2?"
    answer: "Plumbing, not balance. Patch 1.1.2 (April 28, the same day PC Early Access opened) fixed crashes (the Mission Map 'Locate' button, lighting and weather, an iOS LOD crash, equipping Skater apparel), made tutorials survive remapped controls, improved mouse and keyboard support (better non-QWERTY default bindings, KB+M menu navigation, a re-bindable Quickwheel), temporarily disabled the Dark Zone box deal, and fixed store bugs like purchases not being granted and paid currency being counted twice. Zero balance changes. It's a tune-up patch, not a revolution."
  - question: "Should I re-farm my gear after Patch 1.1.2?"
    answer: "No. Nothing in 1.1.2 touched a talent, gear set, OS Protocol or weapon number, so there is nothing to re-farm for. Don't re-farm out of paranoia. Re-farm out of confirmed patch notes, and these notes confirm that nothing changed. Your build works exactly like it did on April 27."
  - question: "When is the next big content update for Division Resurgence?"
    answer: "When this patch shipped, the next drop was Season 1 Phase 2 (mid-May, with the Strawberry Milkshake). That's ancient history in live-service years. As of October 2026 the live phase is Season 2 Phase 2, which Ubisoft extended on October 21 'until we are ready to release a much bigger update later this year'. No date yet. The cycle of content drought and content flood is the looter shooter circle of life."
---

Patch 1.1.2 deployed alongside the PC Early Access launch. The update was a stability and quality-of-life pass with no balance changes, and a heavy emphasis on mouse-and-keyboard support, clearly to prep for PC players coming in fresh.

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

## Player Impact

Patch 1.1.2 was a foundation patch, not a flashy one. The real story here is the mouse and keyboard work: this update shipped alongside the [PC Early Access launch](/news/pc-early-access-launch/), which meant Ubisoft had to make sure the input layer worked on day one for an entirely new platform. The non-QWERTY keyboard improvements matter more than they look, because the game launched globally and a significant chunk of the PC player base is on AZERTY, QWERTZ, or other regional layouts.

The Dark Zone box deal was also temporarily disabled. Ubisoft's wording was "to prevent incorrect or confusing behavior", and some players reportedly read that behavior as being charged twice. Ubisoft pulled it rather than risk more trust damage, which was the right call after the early launch bugs.

If you're experiencing remaining issues after this patch, check the [error codes guide](/guides/division-resurgence-error-codes/) for current workarounds, or browse the [Phase 2 patch notes](/patch-notes/phase-2-patch-notes/) for what came next.

## Sources

- [Patch Note 1.1.2 (28 Apr 2026), Ubisoft Help Center](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2508-patch-note---1-1-2-update-28-apr-2026/)

---
title: "Patch 1.1.2 Notes"
version: "1.1.2"
patchDate: "2026-04-28"
author: "RapidF5"
summary: "The Division Resurgence Patch 1.1.2 deployed alongside the emulator PC Early Access launch, bringing cross platform matchmaking and UI bug fixes."
featuredImage: "/images/patch-notes/division-resurgence-patch-1-1-2-hero.jpg"
imageAlt: "An exhausted Division Resurgence Agent resting against a brick wall on a snowy street"
shareTitle: "Warn the timeline"
shareText: "Share this to let your squad know their favorite gun just got stealth-nerfed."

faqs:
  - question: "What changed in Division Resurgence Patch 1.1.2?"
    answer: "Balance changes, bug fixes, and quality-of-life improvements. Check the full notes above for specifics. The TL;DR is that nothing got nerfed hard enough to kill a build and nothing got buffed hard enough to create a new meta. It's a tune-up patch, not a revolution. Your current build probably still works fine."
  - question: "Should I re-farm my gear after Patch 1.1.2?"
    answer: "Only if a specific talent or gear set bonus you use was changed in the patch notes. If your build wasn't touched, your gear is still good. Don't re-farm out of paranoia. Re-farm out of confirmed patch notes. Read the notes, check your build, and only panic if the numbers actually changed."
  - question: "When is the next big content update for Division Resurgence?"
    answer: "Phase 2 was the last major content drop. Phase 3 is expected in June 2026. Between now and then, expect hotfixes and balance patches. The game is in maintenance mode between content drops, which is normal for live service titles. Destiny did this for a decade. Resurgence does it between seasons. The cycle of content drought and content flood is the looter shooter circle of life."
---

Patch 1.1.2 deployed alongside the PC Early Access launch. The update was a stability and quality-of-life pass, with a heavy emphasis on mouse-and-keyboard support , clearly to prep for PC players coming in fresh.

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

Patch 1.1.2 was a foundation patch, not a flashy one. The real story here is the mouse and keyboard work — this update shipped alongside the [PC Early Access launch](/news/pc-early-access-launch/), which meant Ubisoft had to make sure the input layer worked on day one for an entirely new platform. The non-QWERTY keyboard improvements matter more than they look, because the game launched globally and a significant chunk of the PC player base is on AZERTY, QWERTZ, or other regional layouts.

The Dark Zone box deal being temporarily disabled is worth noting — it was causing confusing purchase behavior that some players interpreted as being charged twice. Ubisoft pulled it rather than risk more trust damage, which was the right call after the early launch bugs.

If you're experiencing remaining issues after this patch, check the [error codes guide](/guides/division-resurgence-error-codes/) for current workarounds, or browse the [Phase 2 patch notes](/patch-notes/phase-2-patch-notes/) for what came next.

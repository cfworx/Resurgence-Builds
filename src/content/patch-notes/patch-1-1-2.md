---
title: "Patch 1.1.2 Notes"
version: "1.1.2"
patchDate: "2026-04-28"
author: "RapidF5"
summary: "The Division Resurgence Patch 1.1.2 deployed alongside the emulator PC Early Access launch, bringing cross platform matchmaking and UI bug fixes."
featuredImage: "/images/patch-1-1-2.jpg"
imageAlt: "An exhausted Division Agent resting against a brick wall on a snowy street"
---

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

---
<div class="bmc-callout" style="margin: 2rem 0; padding: 1.5rem; background: var(--surface); border: 1px solid var(--accent); border-radius: 8px; text-align: center;">
  <h3 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--accent);">Tired of reading the fine print?</h3>
  <p style="margin-bottom: 1rem; font-size: 0.875rem; color: var(--ink-muted);">Translating Ubisoft's dev-speak into English makes me violently hungry. Keeping track of the meta and writing these updates takes massive amounts of time. If this summary saved you from reading a 10-page dev blog, buy me a pizza to compensate.</p>
  <div style="display: flex; justify-content: center;">
    <a href="https://buymeacoffee.com/resurgencebuilds" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; background-color: #ff6d10; color: #000000; font-family: 'Cookie', cursive, sans-serif; font-size: 24px; text-decoration: none; padding: 5px 15px; border-radius: 5px; font-weight: bold; box-shadow: 0px 1px 2px rgba(0,0,0,0.2); transition: transform 0.2s;">
      <span style="margin-right: 8px; font-size: 24px;">🍕</span> Buy me a pizza
    </a>
  </div>
</div>

**Original source:** Ubisoft (official), [Patch Note — 1.1.2 Update 28/Apr/2026](https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2508-patch-note---1-1-2-update-28-apr-2026/)

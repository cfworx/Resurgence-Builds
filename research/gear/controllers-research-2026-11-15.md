# Controllers for The Division Resurgence: source research

Researched on November 15, 2026 for a guide titled roughly "Controllers for The Division Resurgence: what works on iPhone, Android and PC".

**Labels used on every fact**

- **OFFICIAL**: Ubisoft (site, news, help center, patch notes, official X or YouTube), the Steam listing, the App Store listing, the Google Play listing.
- **MANUFACTURER**: the controller maker's own site or help center (also used for Apple, Sony and Microsoft pages about their own hardware and software).
- **REVIEW SITE**: an independent publication, attributed by name.
- **UNVERIFIED**: third-party guide, community data, or anything I could not confirm at the source.

**How pages were read (matters for exact quotes)**

- "Read directly" means I downloaded the page and read its text myself. Raw copies are in `/tmp/claude-0/-home-claude/bcd0bf03-5469-531e-a7cd-0f65ee129fe5/scratchpad/research/raw/` and text extractions in `.../research/txt/` (scratchpad, can be cleared).
- "Read via page summary" means the site blocked direct download (backbone.com product pages, gamesir.com, amazon.com) and the text came through the WebFetch tool, which answers with a small model. Treat quotes from those as accurate in substance but eyeball the page before publishing them as exact quotes.
- Amazon product pages cannot be fetched by our tools (robots rules). ASINs were tied to products through search-result titles of the Amazon pages, a manufacturer's own link, or review-site buy links. Each ASIN says how it was tied.
- No Division 1 or Division 2 facts are included. Two Ubisoft search hits ("Red Horizon PTS patch notes", "Episode 1 patch notes") are Division 2 pages and were discarded.
- All quotes are under 15 words.

---

## 0. Short version

1. Ubisoft says the game supports controllers on mobile: PlayStation 5 controllers, Xbox controllers and Backbone controllers are named, and Ubisoft says you connect a Bluetooth controller directly. On PC Ubisoft says you can use mouse and keyboard "or a controller of your choice".
2. The App Store listing shows "Controller: Supported". The Google Play listing does not mention controllers. The Steam listing lists no controller support at all (no Xbox or PlayStation controller lines) and has no Steam Deck rating.
3. Cross-play and cross-progression between iOS, Android and PC are official, tied to one Ubisoft Connect account and to the same regional server.
4. Ubisoft has not published a list of supported controller models, and has said nothing official about aim assist with controllers, in-game button remapping, or menus that need touch. One official known issue exists: "Issues with gamepad support on iOS" (May 20, 2026), with no later official note that it was fixed.
5. Backbone lists the game as controller supported and ran a reward bundle with Ubisoft (May 2026). Razer and GameSir listings for the game: not verified.
6. Review sites do not agree on one best phone controller. Backbone (One or Pro), the GameSir G8 family, Razer Kishi V3 Pro and Scuf Nomad (iPhone only) are the names that repeat.
7. resurgencebuilds.com did not appear in any of the search result sets I ran.

---

## 1. Official controller support

### 1.1 Ubisoft news posts (all 53 official news posts on the game site were checked)

I walked every article in the official news list (53 items, newest dated September 16, 2026) and searched each for controller, gamepad, joystick, Backbone, DualSense, Steam Deck, aim assist and invert. Only the five posts below mention controllers.

**A. "Controller layout update", March 18, 2026. OFFICIAL. Read directly.**

- Named controllers, exact wording:
  - "The Division Resurgence supports PlayStation 5 controllers"
  - "Xbox controllers are also supported"
  - "The Division Resurgence also supports Backbone controllers"
- Hybrid play is mentioned: "Whether you prefer touch, controller, or a hybrid setup"
- Touch layout is adjustable: "controls can be customized to match your playstyle" (the post gives camera sensitivity and button layout as examples).
- The post does not name specific models (no "DualSense", no "Xbox Wireless Controller", no Backbone One or Pro), does not say iOS, Android or PC, does not explain setup, and says nothing about aim assist, remapping or menus.
- Source: https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/1wetWFRDXzvICd2JuTQwBO/controller-layout-update
- Page date: March 18, 2026.

**B. Launch article on Ubisoft News, March 31, 2026 (by Chris Watters). OFFICIAL. Read directly.**

- "you can also play with a Bluetooth controller"
- Context: the sentence is about the bootcamp tutorial and touch controls.
- Source: https://news.ubisoft.com/en-us/article/4eNUMUE7VfZPTfev7pbsuM/the-division-resurgence-out-now-on-android-and-ios-play-for-free-today
- Page date: March 31, 2026.

**C. "PLAY RESURGENCE ON PC - ALL YOU NEED TO KNOW", April 28, 2026. OFFICIAL. Read directly.**

- Under the heading "CAN I PLAY WITH MOUSE AND KEYBOARD? A CONTROLLER?": "either mouse and keyboard or a controller of your choice"
- "fully cross-play on PC and mobile (iOS and Android)"
- Friends: "as long as you are in the same regional server"
- PC version size: around 17GB, with at least 30GB free recommended.
- Source: https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/1rUYWPgMV9hXYZ6FcLOkpX/play-resurgence-on-pc-all-you-need-to-know
- Page date: April 28, 2026.

**D. "Steam wishlists are live", June 5, 2026. OFFICIAL. Read directly.**

- Ubisoft acknowledges controller feedback on PC and says it can bring improvements for controller players, such as "sensitivity fixes or an option for inverting the Y axis".
- On the PC interface: "still heavily inspired from the mobile version"
- This is a statement of planned improvements, not a patch note. Whether an invert Y option shipped: see 1.3 and "What I could not verify".
- Source: https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/719dybE7YToT3yuzln9KrD/steam-wishlists-are-live
- Page date: June 5, 2026.

**E. "Regional Beta Patch Notes", June 12, 2023 (pre-launch beta, historical only). OFFICIAL. Read directly.**

- Under "CONTROLLER": a new battle interface that is "exclusive to controllers only"
- "operation logic and trigger adaptation for controllers have been optimized"
- This describes the 2023 beta build. Do not present it as a description of the 2026 game without checking a recording.
- Source: https://www.ubisoft.com/en-ca/game/the-division/resurgence/news-updates/5GVqytscyYzwEfCr8svbNL/regional-beta-patch-notes
- Page date: June 12, 2023.

**F. Official X post, @TheDivMobile, April 5, 2026. OFFICIAL. Verified through X's public embed data.**

- "Have you tried #TDResurgence with a controller?"
- "Connect yours directly with Bluetooth"
- Source: https://x.com/TheDivMobile/status/2040806673187537201
- Post date: April 5, 2026.

**G. Official video "The Division Resurgence - Controls & Gameplay Settings" (Ubisoft Mobile YouTube channel). OFFICIAL, content not reviewed.**

- It is item 21 of 53 in the official news list (between the March 18 and March 26, 2026 posts). Title and channel confirmed through YouTube's public embed data. I cannot watch video, so what it shows about controller settings is not verified.
- Link for the owner to capture: https://www.youtube.com/watch?v=RGbEmMvIgyE (no timestamp available, I could not view it).
- News page: https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/RGbEmMvIgyE/the-division-resurgence-controls-gameplay-settings
- Page date: no date shown.

**H. Ubisoft press release, Steam launch, August 5, 2026 (republished by Game Developer). OFFICIAL text, third-party host. Read directly.**

- "The game supports full cross-play and cross-progression"
- Platforms named: PC via Ubisoft Connect and Steam, iOS and Android.
- Source: https://www.gamedeveloper.com/press-release/tom-clancy-s-the-division-resurgence-is-now-available-on-pc-via-ubisoft-connect-and-steam
- Page date: August 5, 2026.

### 1.2 Ubisoft help center (the support link on the Steam listing points here)

All 62 help center articles were downloaded and searched. Only three mention a controller or gamepad (the PC article and two patch notes, see 1.3). The help center shows relative ages ("Last Updated: 229d"); the calendar dates below are counted back from November 15, 2026.

- **PC article, updated version.** OFFICIAL. Read directly. Title "PLAY ON PC (STEAM OR UBISOFT CONNECT) ALL YOU NEED TO KNOW". Same controller sentence as 1.1 C: "either mouse and keyboard or a controller of your choice". Adds that on Steam you are prompted to install a light version of the Ubisoft Connect launcher, and that purchases follow the Ubisoft Connect account across platforms.
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2509-play-on-pc-steam-or-ubisoft-connect-all-you-need-to-know/
  - Page date: "Last Updated: 103d" (about August 4, 2026).
- **Compatible device list.** OFFICIAL. Read directly. "the minimum RAM required to play is 4Gb" and minimum systems are "iOS 14 for Apple Devices and Android 6 for Android devices". Note the App Store listing says iOS 15.0 (see 1.6); the two official sources disagree on the iOS minimum.
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2456-the-division-resurgence-compatible-device-list/
  - Page date: "Last Updated: 229d" (about March 31, 2026).
- **Mobile storage.** OFFICIAL. Read directly. Around 10,5GB for the game, 17GB free recommended.
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2468-how-much-storage-space-do-i-need-on-my-device/
  - Page date: "Last Updated: 229d".
- **Emulators.** OFFICIAL. Read directly. "You are allowed to play The Division Resurgence using an emulator."
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2469-can-i-play-this-on-an-emulator/
  - Page date: "Last Updated: 229d".
- **Stale entry to be aware of.** OFFICIAL. Read directly. The FAQ "For which platforms is the game available?" still answers "The game is available for iOS and Android devices." It predates the PC release and was not updated.
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2465-for-which-platforms-is-the-game-available/
  - Page date: "Last Updated: 229d".
- **Release date.** OFFICIAL. Read directly. Released March 31st 2026.
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2463-when-was-the-game-released/
  - Page date: "Last Updated: 229d".
- Help center home: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/

### 1.3 Patch notes that mention controllers

- **Patch Note 1.2.1, May 20, 2026.** OFFICIAL. Read directly. Under "Other known issues still currently under investigation": "Issues with gamepad support on iOS". No detail on which controllers or what fails.
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2513-patch-note---1-2-1-update-20-may-2026/
  - Page date: titled 20/May/2026, "Last Updated: 179d".
  - I found no later official patch note that says this was fixed (checked the 1.1.2.2 notes of May 29, Season 1 Phase 3 and Season 2 Phase 2 notes).
- **Season 2 Phase 2 patch notes, September 2026.** OFFICIAL. Read directly, in two official places with identical wording. "Improved navigation and controller support", including "controller navigation, and Steam Deck control configuration" and Android back-button behavior.
  - Source 1: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2566-patch-note---season-2-phase-2/ (page shows "Last Updated: 62d", about September 14, 2026)
  - Source 2 (Steam announcement by Ubisoft, September 15, 2026): https://steamcommunity.com/games/3749720/announcements/detail/687516524528797093
- **Patch Note 1.1.2, April 28, 2026.** OFFICIAL. Read directly. No controller line, but it lists improvements to mouse and keyboard input options and fixes for stuck UI elements (quick wheel, roulette, tutorials).
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2508-patch-note---1-1-2-update-28-apr-2026/
  - Page date: titled 28/Apr/2026.
- **Season 1 Phase 3 notes.** OFFICIAL. Read directly. "Fixed multiple UI display and navigation issues (specifically on PC)". No controller line.
  - Source: https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2521-patch-note---season-1-phase-3/
  - Page date: "Last Updated: 142d" (about June 26, 2026).
- **Season 2 Phase 1 patch notes (August 5, 2026, the Steam launch patch).** Not read. Ubisoft's post says they are "directly available on Reddit", which our tools cannot fetch. They are not on the help center and not in the Steam announcements. This is the most likely place for the sensitivity and invert Y changes promised on June 5. UNVERIFIED.
  - Pointer: https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/1R5zWiBS0MQZNcWGYkroYT/season-2-has-just-begun (August 5, 2026)

### 1.4 Steam store listing (app 3749720)

OFFICIAL. Read directly (store page and Steam's public app data), November 15, 2026.

- Title: The Division Resurgence. Developer and publisher: Ubisoft. Released: Aug 5, 2026. Free to play. Windows only (no macOS, no Linux build).
- **Controller support on the listing: none listed.** The public Features list is: Single-player, MMO, Online PvP, Online Co-op, Cross-Platform Multiplayer, Steam Achievements, Steam Trading Cards, In-App Purchases. There is no "Xbox Controllers", "PlayStation Controllers", "Partial Controller Support" or "Full Controller Support" line. The page's embedded controller data has every flag set to false (full Xbox, partial Xbox, PS4, PS5, Steam Input API) and Steam's app data has no controller_support field.
  - So: Ubisoft's own FAQ says a controller works on PC, but the Steam listing does not advertise controller support. State it that way; do not write "full controller support on Steam".
- **Steam Deck: no rating.** Valve's compatibility report for the app returns category 0 with no test results (that is "Unknown", not Verified, Playable or Unsupported), and the store page shows no Deck compatibility block.
- Anti-cheat notices on the listing: "Uses Kernel Level Anti-Cheat" and "Anti-Cheat Expert (ACE) - Requires manual removal after game uninstall". Also "Requires agreement to a 3rd-party EULA".
- Cross-play text in the description: "Toggle full cross-play support on or off at will" and "Keep your progress synchronized across platforms with cross-progression".
- Languages: English (full audio), plus interface and subtitles in French, Italian, German, Spanish (Spain), Japanese, Korean, Portuguese (Brazil), Simplified Chinese, Spanish (Latin America), Traditional Chinese.
- Support link on the listing: the Ubisoft Mobile help center (see 1.2). Website link: https://www.thedivisionresurgence.com/ (redirects to Ubisoft's game page).
- **System requirements, exactly as listed on Steam:**

| | Minimum | Recommended |
|---|---|---|
| Note | Requires a 64-bit processor and operating system | Requires a 64-bit processor and operating system |
| OS | Windows 11 | Windows 11 |
| Processor | Intel i5-8400 / AMD Ryzen 5 3400G | Intel i5-8400 / AMD Ryzen3 3100 |
| Memory | 8 GB RAM | 8 GB RAM |
| Graphics | Intel UHD 630 Integrated GPU / AMD Vega 11 Integrated GPU | Nvidia GTX 1650 (4GB) / AMD RX 5500 (4GB) / Intel ARC A380 (6GB) |
| DirectX | Version 11 | Version 11 |
| Network | Broadband Internet connection | Broadband Internet connection |
| Storage | 30 GB available space | 30 GB available space |

- Sources: https://store.steampowered.com/app/3749720/The_Division_Resurgence/ and https://store.steampowered.com/api/appdetails?appids=3749720&cc=us&l=english and https://store.steampowered.com/saleaction/ajaxgetdeckappcompatibilityreport?nAppID=3749720
- Page date: no date shown (release date Aug 5, 2026; fetched November 15, 2026).
- Community data on Deck and Linux, not official: ProtonDB's summary for the app shows tier "gold" from 28 reports. UNVERIFIED (community reports). https://www.protondb.com/app/3749720

### 1.5 Ubisoft Store PC listing and Ubisoft News PC specs

- **Ubisoft Store listing.** OFFICIAL. Read directly. Release date April 28, 2026. Developer field: "Massive Entertainment, Ubisoft". Platforms: "PC (Digital), Steam". Needs a Ubisoft account and the Ubisoft Connect application. No controller statement on the listing. Its requirements table has four tiers and adds an SSD note that Steam does not show:
  - Minimum (1080p Low graphic, 30 FPS): Windows 11; Intel i5-8400 / AMD Ryzen5 3400G; Intel UHD 630 Integrated GPU / AMD Vega 11 Integrated GPU; 8GB Dual channel; 30GB Recommended (SSD Required).
  - Recommended (1080p High graphic, 60 FPS): Windows 11; Intel i5-8400 / AMD Ryzen 3 3100; Nvidia GTX 1650 (4GB) / AMD RX 5500 (4GB) / Intel ARC A380 (6GB); 8GB Dual channel; 30GB Recommended (SSD Required).
  - High (2K High graphic, 60 FPS): Windows 11; Intel i5-10400 / AMD Ryzen5 5500; Nvidia GTX 1660 (6GB) / AMD RX 5500 XT (8GB) / Intel ARC A580 (8GB); 8GB Dual channel; 30GB Recommended (SSD Required).
  - Ultra (4K Very High graphic, 60 FPS): Windows 11; Intel i7-8700K / AMD Ryzen5 3600; Nvidia GTX 1660 Ti (6GB) / AMD RX 5600 XT (6GB) / Intel ARC A750 (8GB); 8GB Dual channel; 30GB Recommended (SSD Required).
  - Source: https://store.ubisoft.com/us/the-division-resurgence/62e7cc7251f14849aaca73c8.html
  - Page date: release date April 28, 2026 shown; fetched November 15, 2026.
- **Ubisoft News, "Play Free on Steam August 5", July 30, 2026 (by Brittany Spurlin).** OFFICIAL. Read directly. Same four tiers (named Minimum, Recommended, High, Very High) with API DX 11. The article has typos ("Intel Ie-8400", "Integrated PCU"); prefer the Steam or Ubisoft Store wording.
  - Source: https://news.ubisoft.com/en-us/article/5FtgpT4eqjzL49ROhjC99c/the-division-resurgence-play-free-on-steam-august-5
  - Page date: July 30, 2026.

### 1.6 Apple App Store listing (id1606349410)

OFFICIAL. Read directly, November 15, 2026. This is the listing Ubisoft's game page links to.

- Header badge: "Controller" with the value "Supported".
- Under "Supports", Game Controllers: "Enhance your gaming experience by playing with a compatible PlayStation, Xbox, or MFi controller." (This is Apple's standard wording for apps that declare controller support. It does not say "Optional" or "Required" in the text I retrieved.)
- Compatibility: "Requires iOS 15.0 or later" and "a device with the A12 Bionic chip or later" (iPhone). iPad: iPadOS 15.0 or later, A12 Bionic or later. Listed for iPhone and iPad.
- Size 4 GB. Age rating 18+. Seller Ubisoft. Languages: English and 9 more. Current version shown: 1.69730, dated Nov 2.
- Source: https://apps.apple.com/us/app/the-division-resurgence/id1606349410
- Page date: version history shows 1.69730, Nov 2 (2026).

### 1.7 Google Play listing

OFFICIAL. Read directly, November 15, 2026.

- **No controller statement.** The words controller and gamepad do not appear in the listing text.
- Minimum Android: the listing's embedded data shows Android 6.0 (API level 23) as the minimum, with target API 36. This matches the help center's "Android 6". The visible "Requires Android" line sits in a dialog I could not open, so the value comes from the page data.
- "Updated on Oct 28, 2026". Current version 1.69730.0. 1M+ downloads. Rated Mature 17+. Developer: Ubisoft Entertainment.
- No device requirement beyond the Android version is stated on the listing. The 4GB RAM minimum comes from the help center (1.2).
- Source: https://play.google.com/store/apps/details?id=com.ubisoft.the.division.mobile.combat.shooting.open.world.rpg&hl=en_US&gl=US
- Page date: Updated on Oct 28, 2026.

### 1.8 Cross-play and cross-progression (official statements)

- "fully cross-play on PC and mobile (iOS and Android)". OFFICIAL. Ubisoft, April 28, 2026 (1.1 C).
- Same account: progress continues on any device "using the same Ubisoft Connect account" (same source). Guests must link to Ubisoft Connect on mobile before logging in on PC (help center PC article, 1.2).
- Same server: "as long as you are in the same regional server" (same source). Help center: "The Division Resurgence is fully cross-platform." https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2470-can-i-play-with-friends-on-other-platforms/ ("Last Updated: 229d")
- Purchases and progress: "your progress and in-app purchases will be saved and shared". OFFICIAL. https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2480-is-my-progress-shared-across-platforms-what-about-in-app-purchases/ ("Last Updated: 229d")
- Characters are tied to their server: you can switch servers, but characters and purchases stay on the server they were made on. OFFICIAL. https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2486-can-i-change-servers-once-i-ve-started-playing/ ("Last Updated: 229d")
- Cross-play can be switched off on PC: Steam description, "Toggle full cross-play support on or off at will". OFFICIAL (1.4). The Season 2 Phase 2 notes also mention a fix for "crossplay settings incorrectly displaying the wrong state".
- Steam launch post: "full cross-play and cross-progression across mobile and PC". OFFICIAL. Read directly. Steam announcement by Ubisoft, August 5, 2026: https://steamcommunity.com/games/3749720/announcements/detail/711153447479547542
- No progression link with The Division 1 or 2. OFFICIAL. https://ubisoft-mobile.helpshift.com/hc/en/41-the-division-resurgence/faq/2476-will-the-game-be-cross-play-or-have-cross-progression-with-the-hd-titles/ (this entry still says the game is "only available for mobile devices", written before the PC release)

### 1.9 Which controllers Ubisoft names, exact wording

| Wording | Where | Date |
|---|---|---|
| "PlayStation 5 controllers" | Controller layout update (1.1 A) | March 18, 2026 |
| "Xbox controllers" | Controller layout update (1.1 A) | March 18, 2026 |
| "Backbone controllers" | Controller layout update (1.1 A) | March 18, 2026 |
| "a Bluetooth controller" | Ubisoft News launch article (1.1 B) | March 31, 2026 |
| "Connect yours directly with Bluetooth" | @TheDivMobile on X (1.1 F) | April 5, 2026 |
| "a controller of your choice" (PC) | PC FAQ (1.1 C, 1.2) | April 28, 2026 |
| "a compatible PlayStation, Xbox, or MFi controller" | App Store listing, Apple's standard text (1.6) | seen November 15, 2026 |
| "Steam Deck control configuration" | Season 2 Phase 2 patch notes (1.3) | September 2026 |

Not named by Ubisoft anywhere I could find: DualSense or DualShock 4 by name, "Xbox Wireless Controller" by name, Backbone One or Backbone Pro by model, Razer Kishi, GameSir, SCUF, 8BitDo, Switch Pro Controller. Do not attribute any of those names to Ubisoft.

### 1.10 Limitations Ubisoft has stated

- May 20, 2026: "Issues with gamepad support on iOS" listed as under investigation (1.3). OFFICIAL.
- June 5, 2026: controller players on PC need "sensitivity fixes" and an option for inverting the Y axis (1.1 D). OFFICIAL.
- June 5, 2026: the PC interface is "still heavily inspired from the mobile version" (1.1 D). OFFICIAL.
- September 2026: controller navigation and Steam Deck control configuration were improved (1.3). OFFICIAL. This implies they needed work before; it does not describe what remains.
- **Nothing official found** on: aim assist when using a controller, controller versus touch matchmaking, in-game button remapping for controllers, menus that require touch, which Backbone models, wired USB controllers, or controller support on emulators.

### 1.11 Attributed statements that are not Ubisoft publications

- **Developer interview.** REVIEW SITE (TechRadar, quoting executive producer Fabrice Navrez), April 2, 2026. Read directly. "we did a [lot of work] to make it compatible" (about controllers). He also says "I'm a bit faster on touch than with a game controller". He compares the layout to The Division 2's control scheme; keep that as his comparison only, do not import Division 2 bindings.
  - Source: https://www.techradar.com/gaming/mobile-gaming/the-division-resurgence-developer-says-theyre-very-satisfied-with-the-touch-controls-of-the-more-tactical-game
- **TechRadar review, May 10, 2026.** REVIEW SITE. Read directly. "Mobile controller support is top-notch". The reviewers say they tested pads from GameSir, Nacon, SteelSeries and 8BitDo (named in the review: Nacon MGX-Pro, 8BitDo Ultimate Bluetooth Controller, GameSir G8+ Bluetooth controller, SteelSeries Stratus+). The review also says the settings include sensitivity for touch, controller, mouse and keyboard and gyro, and aim assist options. These are reviewer observations, not Ubisoft statements.
  - Source: https://www.techradar.com/gaming/the-division-resurgence-review
- **TheSixthAxis review, April 6, 2026 (updated April 7).** REVIEW SITE. Read directly. On gamepad rough edges at launch: "menu navigation with a gamepad relies on a Destiny-like cursor" and "an inability to D-pad between dialogue buttons". The reviewer says you can fall back to tapping. This predates the September 2026 controller navigation patch.
  - Source: https://www.thesixthaxis.com/2026/04/06/the-division-resurgence-review/
- **Pocket Gamer review, April 4, 2026.** REVIEW SITE. Read directly. Says controller and keyboard layouts have classic button mapping "and the chance to change it as you will" (a remapping claim; not confirmed by Ubisoft).
  - Source: https://www.pocketgamer.com/the-division-resurgence/review/
- **Notebookcheck, April 30, 2026.** REVIEW SITE. Read directly. Says PS5 and Xbox controllers "work out of the box" on PC. It reads as a summary of Ubisoft's posts, not a hands-on test.
  - Source: https://www.notebookcheck.net/The-Division-Resurgence-sneaks-onto-PC.1286590.0.html

---

## 2. Manufacturer support listings

### Backbone: listed as supported

- **Backbone game page for The Division Resurgence.** MANUFACTURER. Read via page summary (two separate reads agreed). The page shows "Controller Support: Yes" and says the game "supports controllers, including the Backbone One, on the App Store and Google Play." Backbone Pro is not mentioned on that page. Parts of the page copy are stale (it still talks about the Regional Beta and pre-registration).
  - Source: https://playbackbone.com/bg/games/JrpeVRo3v1/the-division-resurgence (the same page appears in search results as https://app.backbone.com/games/JrpeVRo3v1/tom-clancys-the-division-resurgence/ titled "Tom Clancy's The Division: Resurgence Controller Support"; that URL would not load for our tools)
  - Page date: no date shown.
- **Backbone x The Division Resurgence reward bundle.** MANUFACTURER. Read via page summary. Blog headline: "Backbone x The Division Resurgence: Claim Exclusive In-Game Rewards". The post says "with Backbone controller support". Reward is called the "Backbone Exclusive Reward Bundle". Claim path: install the game, log into Ubisoft Connect in game, claim the perk in the Backbone app, redeem the emailed code, then collect in the Events Center, Rewards Claim tab. Footnote: "Code redeemable once per eligible user account for a limited time." No end date and no region limits are stated. The page does not say Backbone+ is required.
  - Source: https://backbone.com/blogs/news/backbone-x-the-division-resurgence-exclusive-in-game-rewards
  - Page date: no date shown.
  - Backbone's X post about it, May 7, 2026 (verified through X's embed data): "Play with Backbone on mobile, or jump in on PC via Ubisoft Connect." https://x.com/backbone/status/2052418185539072018
  - TechRadar's report, May 5, 2026 (REVIEW SITE, read directly) names three Superior-tier items in the bundle: Ericht Chest System, Small Laser Pointer, Maxillan Respirator. Those are TechRadar's spellings; check the item names against the game before printing them. https://www.techradar.com/gaming/ubisoft-teams-up-with-backbone-to-offer-the-division-resurgence-players-exclusive-in-game-rewards-heres-how-you-can-claim-yours
  - Whether the bundle can still be claimed in November 2026: not verified.
- **Backbone's general statement.** MANUFACTURER. Read via page summary; article metadata read directly. Backbone works with "all your favorite games that support controllers".
  - Source: https://help.backbone.com/hc/en-us/articles/25536673267607-What-games-can-I-play-with-a-Backbone-controller
  - Page date: updated February 26, 2026.

### Razer: not verified

- Razer's launcher app is now called Razer Cortex Mobile (the old razer.com/mobile/razer-nexus address redirects to it). Its page describes "a curated catalog of thousands of controller-compatible mobile games" but the catalog loads inside a search widget and is not readable as a list. I found no Razer page that names The Division Resurgence, and a search for the game name with Razer Cortex Mobile or Razer Nexus returned nothing relevant.
  - Source: https://www.razer.com/mobile/razer-cortex-mobile (MANUFACTURER, read directly, no date shown)
  - Status: **not verified** that Razer lists the game. A Kishi is a standard controller, so Ubisoft's general controller support would apply, but that is an inference, not a listing.

### GameSir: not verified

- GameSir has a "Supported Games List" section on gamesir.com (search results show pages numbered up to at least 26), but the site blocks direct download and the tool that could reach the site returned a different page for that address. A search restricted to gamesir.com for "Division Resurgence" returned no game-list entry.
  - Source attempted: https://gamesir.com/blogs/supported-games-list
  - Status: **not verified** that GameSir lists the game.
- Related, from a review site rather than GameSir: TechRadar's review says the GameSir G8+ Bluetooth worked with the game (see 1.11). REVIEW SITE.

---

## 3. Product facts (no prices)

ASIN notes: "Amazon title" means the ASIN appeared in search results for an amazon.com page with that product title. I could not open Amazon pages, so availability and the exact variant shown on the page today are not checked.

### Backbone One, 2nd gen (USB-C and Lightning; PlayStation Edition)

MANUFACTURER. Product names, SKUs and descriptions read directly from Backbone's public product data; compatibility and audio facts read directly from Backbone's help center.

- Current store names:
  - "Backbone One - USB-C (2nd gen)", SKU BB-51-P-BR. https://backbone.com/products/backbone-one-usb-c
  - "Backbone One - Lightning (2nd gen)", SKU BB-02-P-BR. https://backbone.com/products/backbone-one
  - "Backbone One - PlayStation® Edition - USB-C (2nd gen)", SKU BB-51-P-WS. https://backbone.com/products/backbone-one-usb-c-playstation
  - "Backbone One - PlayStation® Edition - Lightning (2nd gen)", SKU BB-02-P-WS. https://backbone.com/products/backbone-one-playstation
  - Also sold: "Backbone One - XBOX Edition - USB-C (2nd gen)", SKU BB-51-P-GX. https://backbone.com/products/backbone-one-usb-c-xbox-edition
- Phones (USB-C model): the store description says iPhone 18/17/16/15 or Android. The help center lists iPhone 15 through the iPhone 18 Pro family, iPhone Air, iPhone 17e and iPhone Duo. Android phones "must have Android 10.0 or later, USB-C, and USB OTG".
  - https://help.backbone.com/hc/en-us/articles/40397786888087-Which-iPhone-models-are-compatible-with-Backbone-One (updated November 6, 2026)
  - https://help.backbone.com/hc/en-us/articles/40398282123927-Which-Android-phones-are-compatible-with-the-Backbone-One (updated September 1, 2026)
- Phones (Lightning model): Lightning iPhones, iPhone 14 and earlier, with iOS 17 or later (same iPhone article).
- Connection: wired through the phone's USB-C or Lightning port. No Bluetooth in the controller (Lightning product page, read via page summary: the One "doesn't have Bluetooth"). Your phone's own Bluetooth still works while docked. The One has no battery ("Backbone One does not have a battery!") and draws a small amount of power from the phone. https://help.backbone.com/hc/en-us/articles/40397486582295-Do-I-need-to-charge-the-Backbone-One (updated May 11, 2026)
- Pass-through charging: yes, a charging port on the bottom of the controller. https://help.backbone.com/hc/en-us/articles/33211896582423-Pass-through-Charging (updated August 24, 2026)
- **Headphone jack: changed in 2026.** Units purchased before August 1, 2026: "Your controller has a 3.5mm headphone jack on the bottom left handle." Units purchased on or after August 1, 2026: "These controllers no longer include the 3.5mm headphone jack." The pass-through port is "for charging only and does not carry audio".
  - https://help.backbone.com/hc/en-us/articles/40397813174039-Can-I-use-headphones-with-the-Backbone-One (updated August 17, 2026)
  - The same change applies to adapters: before August 1, 2026 two magnetic adapter sets; on or after, one pair of pre-installed rubber adapters. https://help.backbone.com/hc/en-us/articles/40397389155351-What-are-the-differences-between-the-Backbone-One-editions (updated September 1, 2026)
  - The USB-C product page still advertised a 3.5mm headset jack when read via page summary. Old stock and new stock may both be on sale, so the guide should not promise a headphone jack on a new Backbone One.
- Sticks and extras: "Compact precision joysticks, analog triggers" (help center comparison). No hall-effect claim and no back buttons on the One. 2nd gen has a reshaped D-pad and fit adapters.
- App: the Backbone app is free and optional; Backbone+ is a paid membership inside it. "you don't need either to game with your Backbone controller". https://help.backbone.com/hc/en-us/articles/13755190142103-Do-I-need-the-Backbone-App-or-Backbone-to-use-a-Backbone-controller (updated February 26, 2026)
- PC and tablet use: Wired Mode (Play On Any Screen) lets the One act as a wired controller for iPad, Mac and PC. "A Backbone+ subscription is not required to use Wired Mode". https://help.backbone.com/hc/en-us/articles/4413358384151-Play-On-Any-Screen-with-a-Wired-Connection (updated July 10, 2026)
- PlayStation Edition: "Inspired by the look and feel of the PS DualSense wireless controller" (store description). It is the only Backbone One edition that works with PS Remote Play on Android (editions article above).
- ASINs:
  - USB-C 2nd gen: **B0CCT2LWT8**, re-checked. Amazon title "BACKBONE One Mobile Gaming Controller, USB-C, 2nd Gen"; also tied by IGN's Backbone One product card and Engadget's link.
  - A second Amazon listing carries the same short title: B0GV2134KV (this is the one WIRED links for "Backbone One"). Which listing is the post-August 2026 hardware: not verified.
  - Lightning 2nd gen: B0CT1BRLZ9, Amazon title "BACKBONE One Mobile Gaming Controller for iPhone 14, Lightning, 2nd Gen". A second listing with the same title exists (B0F7C6N214).
  - PlayStation Edition USB-C: B0CCT2TJW4, Amazon title "BACKBONE One Mobile Gaming Controller (PlayStation Edition), USB-C". A newer listing also exists (B0GV1SDGMC, title mentions iPhone 18/17/16/15 and 2nd Gen).
  - PlayStation Edition Lightning 2nd gen: B0CT17GPNT, Amazon title "BACKBONE One Gaming Controller (PlayStation Edition), Lightning, 2nd Gen".

### Backbone Pro

MANUFACTURER. Read directly (product data and help center).

- Names: "Backbone Pro" (SKU BB-N1-B-R) and "Backbone Pro - XBOX Edition" (SKU BB-N1-G-X). https://backbone.com/products/backbone-pro and https://backbone.com/pages/pro
- Phones: USB-C devices from Apple, Samsung, Google, Xiaomi, Oppo, Vivo, Huawei, Realme and Motorola, including the iPhone 18 series and iPhone Duo. System minimum: "iOS 17.3 or later for iPhone users and Android 10.0 or later". "Lightning-type connectors (iPhone 14 and earlier) are not compatible." Lightning phones can still connect over Bluetooth, with app features such as button mapping unavailable in that mode.
  - https://help.backbone.com/hc/en-us/articles/30478576294423-Which-phones-are-compatible-with-the-Backbone-Pro (updated November 6, 2026)
  - The Backbone Pro marketing page gave iOS 15 or later when read via page summary; the help center figure above is the one I read directly.
- Connection: three modes. Handheld (phone docked on USB-C), Wireless (Bluetooth, which Backbone calls FlowState) and Wired (USB-C cable to another device). "Backbone Pro currently only supports BLE (Bluetooth Low Energy)". Works wirelessly with tablet, PC, Mac and other devices.
  - https://help.backbone.com/hc/en-us/articles/30478499092375-FlowState-Wireless-Gameplay-with-Backbone-Pro and https://help.backbone.com/hc/en-us/articles/33831719753111-Backbone-Pro-Gameplay-Modes (both updated February 26, 2026)
- Battery: "Up to 40 hours of playtime in Wireless mode".
- Pass-through charging: yes, "pass-through charging via USB-C" (comparison article).
- Headphone port: the FlowState article places the Pair button "next to the headphone port", so the Pro has one. WIRED's May 2026 guide also says it keeps the headphone port.
- Controls: "Full-sized ALPS joysticks, hall effect triggers, rear buttons". Two back buttons (M1, M2), unassigned by default. Button remapping and profiles in the Backbone app without Backbone+.
  - https://help.backbone.com/hc/en-us/articles/30459005817623-What-are-the-differences-between-the-Backbone-One-and-Backbone-Pro and https://help.backbone.com/hc/en-us/articles/30980164375703-Customization-with-Backbone-Pro-Button-Remapping (both updated February 26, 2026)
  - Note: the sticks are ALPS joysticks, not hall effect. Only the triggers are hall effect.
- PC note for the guide: Backbone has a help article on using the Pro with Steam Input. https://help.backbone.com/hc/en-us/articles/32778329341591-Using-Backbone-Pro-with-Steam-Input (updated February 26, 2026)
- ASIN: B0DQM23MLZ, Amazon title "BACKBONE Pro Gaming Controller"; also the ASIN in WIRED's Backbone Pro link. Xbox Edition: B0FPXNLRBV, Amazon title "BACKBONE Pro Gaming Controller, Xbox Edition".

### Razer Kishi V3, V3 Pro, V3 Pro XL (current line) and Kishi Ultra

MANUFACTURER. Read directly. Razer's US mobile controllers page currently lists three products: Kishi V3, Kishi V3 Pro, Kishi V3 Pro XL. The Kishi Ultra page is still live but is not in that list.

- **Razer Kishi V3.** https://www.razer.com/mobile-controllers/razer-kishi-v3 (no date shown)
  - "Made for iPhone and Android". iPhone footnote: "iPhone 15 series and up". FAQ: it "supports many Android phones, as well as iPhone 15, 16, and 17 series". iPhone Air only with a compatible case. (The page does not mention iPhone 18.)
  - Connection: USB-C. "USB C with Passthrough Charging & 3.5 mm Audio".
  - Controls: "full-sized TMR thumbsticks and dual mouse click back buttons". Razer calls TMR sticks anti-drift and "superior to Hall Effect designs" (Razer's claim).
  - PC: works as a wired PC controller over USB-C (cable sold separately).
  - App: Razer Cortex Mobile, free, for remapping, firmware and launching games.
  - ASIN: B0F233Y5YL (Black), Amazon title "Razer Kishi V3 Gaming Controller for iPhone & Android, USB-C, Black". Phantom White: B0FSH85QSH.
- **Razer Kishi V3 Pro.** https://www.razer.com/mobile-controllers/razer-kishi-v3-pro (no date shown)
  - "Fits Phones, iPad Mini & Android Tablets Up to 8”". FAQ: supports USB Type C phones, iPad Mini and Android tablets up to 8 inches. Same iPhone 17 and iPhone Air notes as the V3.
  - USB-C with pass-through charging and 3.5 mm audio. Cases up to 16 mm thick.
  - Controls: full-sized TMR thumbsticks with swappable caps, two mouse click back buttons plus two claw grip bumpers ("4 Remappable Buttons").
  - Sensa HD Haptics: requires Android 12 or above or Windows 11; "not currently supported on iOS".
  - PC: wired PC controller over USB-C.
  - ASIN: B0F231T7BG, Amazon title "Razer Kishi V3 Pro Gaming Controller for iPhone, Android & Tablets, USB-C"; same ASIN in TechRadar's and GamesRadar's buy links.
- **Razer Kishi V3 Pro XL.** https://www.razer.com/mobile-controllers/razer-kishi-v3-pro-xl (no date shown)
  - A tablet controller: "Fits iPads & Android Tablets up to 13”" (USB Type C iPads and Android tablets). Same controls and ports as the V3 Pro. Not a phone pick.
  - ASIN: B0DVKWZ5SX, Amazon title "Razer Kishi V3 Pro XL Gaming Controller, iPad & Android Tablets (13") USB-C". A second listing exists (B0F2JD1HS2).
- **Razer Kishi Ultra** (older model, still sold). https://www.razer.com/mobile-controllers/razer-kishi-ultra (no date shown)
  - For Android, iPhone 15 and 16 series, iPad Mini (6) and iPad Mini (A17 Pro); Android tablets up to 8 inches. USB-C, 3.5 mm audio, 15 W pass-through charging. Full-sized Hall Effect triggers, extra L4 and R4 bumpers, Chroma RGB. HD haptics need Android 12 or above or Windows 11. Virtual Controller Mode (touch remapping) is Android only.
  - ASIN: B0CXGMPLWK, Amazon title "Razer Kishi Ultra Gaming Controller for Mobile, Phone, Tablet (USB-C)"; same ASIN in IGN's and WIRED's links.

### GameSir G8 Galileo, G8 Plus, G8 Plus MFi

MANUFACTURER. gamesir.com blocks direct download, so everything here was read via page summary. GameSir's current mobile collection (12 products, first 8 seen) shows: X5 Lite for XBOX (plus Fortnite and 25th Anniversary editions), G8 Plus Fortnite Edition, Pocket Taco (two colors), G8 Plus MFi, X5s. The G8 Galileo was not among the 8 visible, but its product page is live with buy buttons.

- **GameSir G8 Galileo** ("GameSir G8 Galileo Stretchable Mobile Gamepad"). https://gamesir.com/products/gamesir-g8-galileo (no date shown)
  - Connection: built-in wired Type-C. Pass-through charging: listed. 3.5mm audio jack: listed. Hall Effect sticks and Hall Effect analog triggers. 2 back buttons. GameSir App.
  - Device length 110 to 185 mm (4.3 to 7.3 in).
  - Platform field on GameSir's spec page: "Android". The page read did not list iPhone. Amazon's titles say "for Android & iPhone 15 Series (USB-C)" and WIRED says it officially works with Android and USB-C iPhone. Treat iPhone support as stated by Amazon's listing and WIRED, not by the GameSir spec table I could read.
  - ASIN: B0CM3C9HRG. WIRED's link is amazon.com/GameSir-G8-Galileo-Controller-Joysticks/dp/B0CM3C9HRG; same ASIN in GamesRadar's link.
- **GameSir G8 Plus** ("GameSir G8 Plus Bluetooth Mobile Gaming Controller"). https://gamesir.com/products/g8-plus-bluetooth-mobile-controller and FAQ https://gamesir.com/pages/faq-questions-about-g8-plus (no dates shown)
  - "It supports mobile devices such as Switch, iOS, and Android phones and tablets." Bluetooth for those; wired or wireless dongle for PC.
  - Device length 120 to 215 mm (4.72 to 8.46 in). Battery 1000mAh total (500mAh per side). Hall Effect sticks. GameSir app features are described for Android.
  - Pass-through charging, headphone jack and back buttons: not stated in the text I could retrieve.
  - ASIN: B0D8JJRCJN, Amazon title begins "GameSir G8 Plus Bluetooth Mobile Game Controller for Switch & iOS & Android".
- **GameSir G8 Plus MFi** ("GameSir G8 Plus MFi Type-C Mobile Controller (Apple Certified)"). https://gamesir.com/products/gamesir-g8-plus-mfi (no date shown)
  - "Officially MFi certified". Compatible platforms: "iPhone, iPad, and Android". Built-in Type-C wired connection, no battery.
  - Device length 125 to 215 mm (4.92 to 8.46 in). Hall Effect sticks and Hall Effect analog triggers. 3.5 mm headphone jack. GameSir App.
  - Pass-through charging and back buttons: not in the text I could retrieve from GameSir. Amazon's listing title says "2 Programmable Back Buttons" (Amazon title, not GameSir's page).
  - ASIN: B0FYQ1SHHS, Amazon title "GameSir G8 Plus MFi iPhone Controller, Hall Effect Sticks".

### GameSir X5 Lite (current budget telescopic line) and X5s

MANUFACTURER. Read via page summary.

- **GameSir X5 Lite for XBOX** ("GameSir X5 Lite for XBOX | USB-C Mobile Controller"). https://gamesir.com/products/gamesir-x5-lite-for-xbox (no date shown)
  - "Xbox Licensed & MFi Certified". Compatible devices: "Apple Devices (iPhone, iPad, Mac) and Android Devices". Built-in USB-C wired connection, no battery.
  - Device length 105 to 213 mm (4.13 to 8.39 in). Hall Effect sticks, Hall Effect analog triggers. Pass-through charging stated ("Charge your device while you play"). GameSir App.
  - 3.5mm jack and back buttons: not stated in what I could retrieve.
  - ASIN: B0GQ3JV9SS (Black), Amazon title "GameSir X5 Lite for XBOX, Phone Controller, Hall Effect Sticks (Black)". White: B0H29J81S2.
  - The earlier non-Xbox "GameSir X5 Lite" is still on Amazon: B0DXPMVCWC (Amazon title "GameSir X5 Lite Mobile Gaming Controller for Android, Hall Effect Joystick"). I did not find it in GameSir's current collection view.
- **GameSir X5s** ("GameSir X5s Wireless Mobile Game Controller"). https://gamesir.com/products/gamesir-x5s-wireless-mobile-game-controller (no date shown)
  - Platforms: Switch, Switch2, Android, iOS, PC. Connection: Bluetooth, USB-C wired, 2.4GHz wireless. Battery 840 mAh total. Device length 105 to 213 mm. Hall Effect sticks and triggers, 6-axis gyroscope, dual HD rumble. GameSir app.
  - Back buttons, audio jack, pass-through charging: not listed.
  - ASIN: B0FGP8CBQ7 (GamesRadar's link; Amazon titles in several regions read "GameSir X5s Bluetooth Mobile Gaming Controller for Switch 2/Switch/Android/iPhone...").
- **GameSir X2s Type-C** (budget pick at TechRadar and IGN). Manufacturer page not retrieved. IGN says it also works with iPhone 15 and newer but most GameSir app features are Android only (REVIEW SITE). ASIN per IGN's product card: B0D5GTM2PL (single source).

### SCUF Nomad

MANUFACTURER. Read directly. https://www.scufgaming.com/us/en/p/scuf-nomad-black (no date shown)

- Compatibility: "iOS 16+", iPhone, "Not compatible with Android".
- Connection: "BLUETOOTH 5.0" (the controller is wireless and has its own battery). USB-C port for charging the controller.
- Battery: "Up to 16 Hours of Battery Life".
- Controls: two customizable rear paddles, "Endurance Hall effect thumbsticks", symmetrical stick layout. Free SCUF app, no subscription.
- Pass-through charging and headphone jack: not stated by SCUF. IGN says it lacks pass-through charging (REVIEW SITE).
- In the box: an "iPhone 14/15 Adapter" is listed. The page does not name newer iPhones.
- Stock: SCUF's own page showed "Notify Me When In Stock" on November 15, 2026.
- ASIN: B0D49HBW9D, Amazon title "SCUF NOMAD Wireless iPhone Mobile Gaming Controller"; same ASIN on IGN's product card.

### 8BitDo Ultimate Mobile Gaming Controller

MANUFACTURER. Read directly. https://www.8bitdo.com/ultimate-mobile-gaming-controller/ (no date shown)

- "Bluetooth connection. Compatible with Apple and Android devices."
- Compatibility list: iOS 18.5 and above, iPadOS 18.5 and above, tvOS 18.5 and above, macOS 15.5 and above, visionOS 2.4 and above, Android 13.0 and above.
- "Fits mobile devices ranging from 100mm to 170mm in length".
- Battery: 300mAh, "13 play hours with 1.5 hours charging time".
- Controls: Hall Effect triggers and joysticks, 2 Pro back paddle buttons, profile button, turbo. 8BitDo Ultimate Software V2 for mapping.
- Pass-through charging and headphone jack: not listed (it is a Bluetooth controller).
- ASIN: **B0DK37CSHP**, from 8BitDo's own "Order on Amazon now (US)" link. Caution: Amazon's titles for this ASIN in other regions say "for Android devices" and "(White)", wording from before Apple support was added. Check the US listing text before linking it for iPhone readers.
- WIRED lists a co-branded "Viture x 8BitDo Ultimate Mobile Gaming Controller" (ASIN B0F5WRZ3LJ) and says it officially works with Android 13 or later.

### Sony DualSense wireless controller

MANUFACTURER. Read directly. https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/ (no date shown)

- "Connect using a USB Type-C® cable or Bluetooth® technology" to Windows PC, Mac, and "Android and iOS mobile phones and tablets".
- Apple minimums in Sony's footnote: "Devices with macOS 11.3, iOS 14.5, iPadOS 14.5 or tvOS 14.5 or later supported."
- 3.5mm headset jack and built-in microphone. Built-in battery, charges over USB Type-C (cable not included).
- Haptic feedback and adaptive triggers "may require USB connection" and depend on the game. Nothing says The Division Resurgence uses them.
- No phone clip is included; it is a full-size pad.
- ASIN: **B0CQKLS4RP**, re-checked. Amazon titles on amazon.com, amazon.ca and amazon.com.mx read "PlayStation DualSense® Wireless Controller - White". (WIRED links a different DualSense ASIN, B0CQKKHT5J.)

### Xbox Wireless Controller

MANUFACTURER. Read directly. https://www.xbox.com/en-US/accessories/controllers/xbox-wireless-controller (no date shown)

- "Works with XBOX consoles • Windows PC • iOS & Android".
- "Wirelessly connect to Windows 10/11 PCs, tablets, iOS and Android using Bluetooth."
- 3.5mm stereo headset jack. Hybrid D-pad, Share button, button mapping.
- No phone clip is included.
- ASIN: **B08DF248LD**, re-checked. Amazon titles read "Xbox Core Wireless Controller - Carbon Black"; a reseller page that mirrors Amazon data lists ASIN B08DF248LD for the Carbon Black model QAT-00001. (WIRED links a different color listing, B0F1HTGDTL.)

### Other controllers that current roundups put at or near the top

- **ELO Vagabond** (GamesRadar's best overall, November 2026). MANUFACTURER. Read directly. https://eloesports.com/products/elo-vagabond-mobile-gaming-controller (no date shown)
  - "Vagabond Mobile Gaming Controller for iPhone & Android". USB-C. "MFi Certified by Apple", footnote "iPhone 15 & above". Lists iPad Mini and iPhone 16 and 17 families (including Air). Fits devices up to 208mm (8.2") in height.
  - Hall Effect joysticks and triggers, 2 remappable back buttons, pass-through charging, "Unleashed" app for remapping and firmware.
  - Headphone jack: not stated on the page text I read.
  - ASIN: B0DBQBP3D5, Amazon title "ELO Vagabond Mobile Gaming Controller, Made for iPhone, USB-C, Android"; same ASIN in GamesRadar's link.
- **Asus ROG Tessen** (picked by TechRadar, GamesRadar and IGN). Manufacturer page not retrieved. REVIEW SITE facts only: IGN and WIRED both say it works with Android only, not iPhone; folding design, back paddles, pass-through charging (WIRED). ASIN B0D4YTBSFZ (same ASIN in TechRadar, GamesRadar, IGN and WIRED links).
- **Others named once** (ASINs from the single review link, not cross-checked): Turtle Beach Atom B0BDXQV4Y2 (TechRadar), SteelSeries Stratus+ B09TRGJ7YR (GamesRadar; Android and PC, not iPhone per GamesRadar), GameSir Pocket Taco B0GJSWSMFN (GamesRadar), 8BitDo Pro 2 B0CSPGMGBT (WIRED), GuliKit KK3 Max B0CFX7PKFV (WIRED), GameSir X4 Aileron B0CY1ZTS76 (WIRED).

### Platform facts that help the "what works" sections

- **Apple.** MANUFACTURER (Apple Support). Read directly. "Connect a wireless Xbox, PlayStation, or other Bluetooth game controller" to iPhone, iPad, Apple TV, Mac or Apple Vision Pro. Some controllers pair automatically over a USB cable. With iOS 16 or later, controller buttons can be customized in Settings, General, Game Controller.
  - Source: https://support.apple.com/en-us/111099
  - Page date: Published Date: September 14, 2026.
- **WIRED's FAQ** (REVIEW SITE, May 8, 2026) notes iPhones do not support USB-OTG for plugging in a regular USB-A controller, and that the same iOS Game Controller settings can remap buttons per game.

---

## 4. Expert consensus (late 2025 to 2026)

Five current roundups were read directly. There is no single agreed winner.

| Site | URL | Date on page | Top pick | Other picks |
|---|---|---|---|---|
| GamesRadar+ | https://www.gamesradar.com/best-mobile-controller/ | last updated 12 November 2026 | ELO Vagabond (best overall) | Best value: GameSir G8 Galileo. Most comfortable: Razer Kishi V3 Pro. Most portable: Asus ROG Tessen. Best for iPhone: Scuf Nomad. Best budget: GameSir X5s. Best retro: GameSir Pocket Taco. Best gamepad (for Android users): SteelSeries Stratus+. |
| WIRED | https://www.wired.com/story/best-mobile-gaming-controllers/ | May 8, 2026 | Backbone One (best mobile gaming controller) | Best upgrade: Backbone Pro. Best magnetic: ohsnap! Mcon. Best Hall-effect: GameSir G8 Galileo. Best for tablets: Razer Kishi Ultra. Best traditional: 8BitDo Pro 2. Best upgraded traditional: GuliKit KK3 Max. Best for smart glasses: Viture x 8BitDo Ultimate Mobile Gaming Controller. |
| Tom's Guide | https://www.tomsguide.com/best-picks/best-mobile-game-controllers | last updated 1 May 2026 | GameSir G8 Plus (best overall) | Best plug and play: Backbone One (2nd Generation). Best compact: Razer Kishi V2. Best iPhone controller: Scuf Nomad. Best pro: GameSir X3. Most portable: GameSir X4 Aileron. Best for tablets: Razer Kishi V3 Pro XL. Best universal: GameSir X5s. |
| TechRadar | https://www.techradar.com/gaming/best-mobile-controllers | last updated 9 April 2026 | Backbone One 2nd Gen (best overall) | Best budget: GameSir X2s Type-C. Best premium: Razer Kishi V3 Pro. Best for Call of Duty: Mobile: Asus ROG Tessen. Best Bluetooth: Turtle Beach Atom. Its FAQ adds that the Kishi V3 Pro is the best on the market but the most expensive. |
| IGN | https://www.ign.com/articles/best-phone-controller | Updated Feb 6, 2026 | Backbone Pro (best overall) | Best pro-level: Razer Kishi Ultra. Best customizable: Scuf Nomad. Best casual: Backbone One. Best portable: Asus ROG Tessen. Best budget: GameSir X2s. |

All five: REVIEW SITE, read directly.

**How to describe the consensus accurately**

- Backbone is the top pick at three of five (WIRED and TechRadar choose the Backbone One, IGN the Backbone Pro) and is in four of the five lists (Tom's Guide has the Backbone One second, as "best plug and play"). GamesRadar mentions the Backbone One in its introduction but does not list it.
- The GameSir G8 family is the main rival: best overall at Tom's Guide (G8 Plus), second place and best value at GamesRadar (G8 Galileo), best Hall-effect at WIRED (G8 Galileo).
- Razer's Kishi V3 Pro is the premium or comfort pick at TechRadar and GamesRadar; the older Kishi Ultra is still IGN's pro-level pick and WIRED's tablet pick; the V3 Pro XL is Tom's Guide's tablet pick.
- "Best for iPhone": GamesRadar and Tom's Guide both name the Scuf Nomad (iPhone only, Bluetooth). IGN lists it as best customizable. WIRED and TechRadar do not have an iPhone category.
- "Best for Android": none of the five has a category with that name. Android-only products that appear: Asus ROG Tessen (IGN and WIRED say Android only) and SteelSeries Stratus+ (GamesRadar, "for Android users"). Say this plainly instead of inventing an Android winner.
- "Best budget": GameSir X2s (TechRadar, IGN) and GameSir X5s (GamesRadar's budget pick, Tom's Guide's "best universal"). All budget picks are GameSir.
- GamesRadar's newest list (November 2026) is the only one topped by the ELO Vagabond.

**Checked but not usable**

- Engadget, "The best mobile gaming controllers for 2025", Updated: Dec. 31, 2024. Outside the window. Picks then: 8BitDo Pro 2 (PlayStation-style), SteelSeries Stratus+ (Xbox-style), Backbone One ("Best for iPhone gaming"). https://www.engadget.com/gaming/best-mobile-game-controllers-140023505.html REVIEW SITE, read directly, stale.
- RTINGS: no controller category exists in its sitemap (checked November 15, 2026), so there is no RTINGS mobile controller list to cite.
- The Verge and PCMag: both sites are blocked for our fetch tool and searches did not surface a current mobile controller roundup from either. Not verified.
- Android Authority: no roundup found. It has a Backbone Pro review titled "The Backbone Pro is the best mobile controller that you absolutely don't need" (https://www.androidauthority.com/backbone-pro-review-3559339/, not read).

---

## 5. Search results check

Each query was run twice (standard and extended mode) on November 15, 2026. **resurgencebuilds.com did not appear in any of the eight result sets.**

### "The Division Resurgence controller support"

1. Backbone game page, "Tom Clancy's The Division: Resurgence Controller Support". https://go.playbackbone.com/PZ150OvyQMb . Backbone's listing of the game as controller supported (see section 2).
2. Ubisoft, "Controller layout update". https://www.ubisoft.com/en-us/game/the-division/resurgence/news-updates/1wetWFRDXzvICd2JuTQwBO/controller-layout-update . The official statement (1.1 A).
3. Notebookcheck, "The Division Resurgence gets PS5, Xbox, and Backbone controller support". https://www.notebookcheck.net/The-Division-Resurgence-gets-PS5-Xbox-and-Backbone-controller-support.1259524.0.html . March 26, 2026 news summary of Ubisoft's post; no hands-on testing.
4. Sportsdunia, "The Division Resurgence Controller Support Guide". https://www.sportsdunia.com/gaming/the-division-resurgence-controller-support-guide . Modified Apr 06, 2026. PS5 and Xbox button layouts, says Backbone One has "complete native support", says third-party pads work over Bluetooth, dongle or cable. Unsourced.
5. MobileMatters, "Does The Division Resurgence Have Controller Support? All Supported Devices". https://mobilematters.gg/gaming/the-division-resurgence-controller-support . March 31, 2026. Says yes, claims Ubisoft stated "full controller support" (I could not find that phrase in any Ubisoft source), recommends a Razer Kishi.
6. GamingonPhone, "The Division Resurgence Controller Support Guide: How to play with a controller". https://gamingonphone.com/guides/the-division-resurgence-controller-support-guide-how-to-play-with-a-controller/ . March 31, 2026, updated April 6, 2026. Bluetooth pairing steps, an Xbox button layout, a "Controller UI" toggle under Generic Settings, sensitivity values, inverted axis toggles. Embeds the official April 5 X post.
7. DTG Reviews blog, "Division Resurgence Controller Guide: Best Settings, PS5/Xbox Setup & Backbone Fixes". https://www.dtgre.com/2026/03/division-resurgence-controller-guide.html . March 30, 2026. Generic advice, says the game is "mobile-only" (out of date), names an "Inner Deadzone" setting. Unsourced.
8. Fan wiki pages: https://the-division-resurgence.wiki/controls/ and https://www.thedivisionresurgence.wiki/support/the-division-resurgence-xbox-controller and https://www.thedivisionresurgence.wiki/pc/the-division-resurgence-pc-controller . SEO style guides with broad claims (XInput, DualSense haptics, remapping tables). One of them places the game in "New York and Washington D.C.", which is wrong for this game. Do not cite.
9. Wikipedia article for the game. https://en.wikipedia.org/wiki/Tom_Clancy%27s_The_Division_Resurgence

### "best controller for The Division Resurgence"

1. Backbone game page (as above).
2. Sportsdunia guide (as above).
3. MobileMatters article (as above); also "How To Connect Controller In The Division Resurgence", https://mobilematters.gg/gaming/division-resurgence-how-to-pair-controller , December 9, 2023, generic Bluetooth pairing steps written before launch.
4. DTG Reviews blog (as above).
5. TechRadar interview, "developer says they're 'very satisfied with the touch controls'". https://www.techradar.com/gaming/mobile-gaming/the-division-resurgence-developer-says-theyre-very-satisfied-with-the-touch-controls-of-the-more-tactical-game . April 2, 2026 (see 1.11).
6. GamingonPhone, "The Division Resurgence best settings and sensitivity guide". https://gamingonphone.com/action/the-division-resurgence-best-settings-and-sensitivity-guide . Settings guide (not read in full).
7. Fan wiki, "The Division Resurgence Gamepad Support: Complete Controller Guide 2026". https://www.thedivisionresurgence.wiki/pc/the-division-resurgence-gamepad-support . Same wiki family as above.
8. Notebookcheck (German edition of the March 26 article).

Nobody in these results actually answers "which controller is best for this game" with testing. There is no page that compares phone controllers specifically for The Division Resurgence.

### "does The Division Resurgence support controller"

1. GamingonPhone, "The Division Resurgence will support controllers at the global launch". https://gamingonphone.com/news/the-division-resurgence-will-support-controllers-at-global-launch/ . July 15, 2022. Based on a tweet from @DivMobile_news ("The Division Resurgence News & Updates"), which is not Ubisoft's account (the official one is @TheDivMobile). Treat as unverified history.
2. Sportsdunia guide, GamingonPhone guide, MobileMatters article, DTG Reviews blog, fan wiki pages (all as above).
3. Notebookcheck article (as above).
4. Ubisoft "Controller layout update" (regional editions).
5. TouchTapPlay page (https://www.touchtapplay.com/?p=152099). Could not be loaded (blocked). Not read.

### "The Division Resurgence Backbone"

1. Backbone on X, May 7, 2026, reward bundle announcement. https://x.com/backbone/status/2052418185539072018
2. Backbone blog, "Backbone x The Division Resurgence: Claim Exclusive In-Game Rewards". https://backbone.com/blogs/news/backbone-x-the-division-resurgence-exclusive-in-game-rewards
3. Backbone app game page. https://app.backbone.com/games/JrpeVRo3v1/tom-clancys-the-division-resurgence/
4. Yahoo Tech and MSN copies of TechRadar's report on the collaboration, and TechRadar's original (May 5, 2026). https://www.techradar.com/gaming/ubisoft-teams-up-with-backbone-to-offer-the-division-resurgence-players-exclusive-in-game-rewards-heres-how-you-can-claim-yours
5. Notebookcheck article (as above), Sportsdunia guide (as above), Wikipedia.
6. In standard mode the query mostly returned general pages about the game (Ubisoft News 2023 article, wikis, Pocket Gamer review, Discord).

Reddit: no Reddit thread surfaced in these result sets. Ubisoft's own posts point to Reddit for the full Season 2 patch notes (see 1.3), which our tools cannot read.

---

## What I could not verify

1. **Razer listing the game.** No Razer page or Razer Cortex Mobile catalog entry for The Division Resurgence was found.
2. **GameSir listing the game.** The GameSir supported games list could not be read; no entry found by search.
3. **Aim assist with a controller, controller versus touch matchmaking, in-game controller remapping, touch-only menus.** No Ubisoft statement found on any of these. Only reviewer observations exist (1.11).
4. **Whether the "Issues with gamepad support on iOS" known issue (May 20, 2026) was fixed**, and what exactly it was.
5. **Whether an invert Y option and the controller sensitivity fixes shipped on PC.** Promised on June 5, 2026; the Season 2 Phase 1 notes that might confirm it are on Reddit and were not read. GamingonPhone describes inverted axis toggles in the mobile settings, unverified.
6. **Steam Deck.** Valve has not rated the game (Unknown). Ubisoft's patch notes mention "Steam Deck control configuration" but Ubisoft has not published a statement that the Deck is supported. Community reports exist (ProtonDB gold) but are not official. One low-quality blog describes a map-screen control glitch on Deck; not verified.
7. **Specific controller models.** Ubisoft names no models. Whether DualShock 4, Switch Pro Controller, Backbone Pro over Bluetooth, GameSir, SCUF or 8BitDo pads work is not confirmed by Ubisoft. TechRadar's review reports several third-party pads working.
8. **In-game setting names and locations** ("Controller UI", sensitivity sliders, deadzone). These come from third-party guides. They need one of our own recordings before they go in the guide. The official video "Controls & Gameplay Settings" (https://www.youtube.com/watch?v=RGbEmMvIgyE) is the best capture target.
9. **The phrase "full controller support"** attributed to Ubisoft by MobileMatters. Not found in any Ubisoft source.
10. **The 2022 "controller support at global launch" tweet.** It came from @DivMobile_news, not from Ubisoft's account.
11. **App Store "Optional" or "Required" wording for controllers.** The listing shows "Controller: Supported" and Apple's standard sentence; I did not see the words Optional or Required.
12. **iOS minimum.** App Store says iOS 15.0 and A12 Bionic; Ubisoft's help center says iOS 14. I did not resolve which is current beyond noting the store listing is what gates installs.
13. **Google Play's visible "Requires Android" line.** Android 6.0 was read from the listing's embedded data, not the on-screen dialog.
14. **Amazon pages.** None could be opened. ASINs are tied through search-result titles, 8BitDo's own link, and review-site links. Availability, the variant shown, and listing text were not checked. Several products have more than one live listing (Backbone One USB-C, Backbone One Lightning, PlayStation Edition, Kishi V3, Kishi V3 Pro XL, X5 Lite).
15. **Backbone One hardware revision of August 1, 2026** (no headphone jack, rubber adapters): which Amazon listing sells which revision is not verified, and Backbone's product page still mentioned a 3.5mm jack when read through the summary tool.
16. **GameSir specifications.** All GameSir facts came through the summary tool, not a direct read. The G8 Plus (Bluetooth) spec table was not retrieved; pass-through charging for the G8 Plus MFi and iPhone support on GameSir's own G8 Galileo spec page were not shown in the text retrieved.
17. **Backbone game page and blog post wording.** Read through the summary tool only (site blocks direct download). Whether the reward bundle is still claimable is unknown.
18. **Asus ROG Tessen and GameSir X2s manufacturer pages.** Not retrieved; only review-site statements are given.
19. **The Verge and PCMag roundups.** Blocked or not found. RTINGS has no controller category. Android Authority roundup not found.
20. **Season 2 Phase 1 patch notes** (Reddit) and **TouchTapPlay's article** (blocked): not read.
21. **Content of Ubisoft's bug reporter** for the game (https://www.ubisoft.com/en-us/game/the-division/the-division-resurgence/bug-reporter/issues): it needs JavaScript and could not be read, so controller bugs tracked there are unknown.

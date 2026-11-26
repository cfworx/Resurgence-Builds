# In-game screenshots for posts

Every post image is an in-game picture (CLAUDE.md). This folder is where they are made.

- `masters/<folder>/<name>.webp`: the full-size pictures, one per post. `<folder>` is where the site copies go
  (`builds`, `guides`, `news`, `patch-notes`). Owner screenshots go straight in here; frames cut from our recordings are
  written here by `make_hero.py`.
- `heroes.json`: every frame cut from a recording: which video and second, the crop, extra HUD boxes to clear, the title
  and subtitle drawn on it, and word swaps on signs. Rerunning `make_hero.py` rebuilds them exactly, as long as the
  recordings are in the session uploads (they are too big for the repo; the video name and second find the shot again).
- `make_hero.py`: cuts a frame, clears the HUD (the floating health bar is found by its exact orange; other pieces are
  listed as boxes), fills the gaps from nearby frames or the surrounding texture, crops to 1600 x 840, and can draw the
  title in the site's guide style or swap a word on a poster (`"word"`, used for "Stop the spread of bugs"). A marker
  pinned to a place in the world (an objective marker floating in front of a trailer) hides the same scenery in every
  nearby frame, so it is filled from a moment later in the recording, lined up on the scenery around it (`"warp"`),
  and the thin line under it is blended across (`"bridge"`); both were added for the Noise Complaint build.
- `ai-images-to-replace.md`: the AI images still on the site.
- `icons/`: small pictures cut from owner screenshots for the build pages, where the game database has no icon of
  its own (the Shotgun Extended Magazine mod, from GGReborn's October 31 video). The source card is kept here; the
  icon itself is in `public/images/builds/`.

After adding or changing a master, run `node scripts/build-post-images.mjs`. It writes 480, 800, 1200 and 1600 px copies
to `public/images/<folder>/` and their sizes to `src/data/post-images.json`; posts point `featuredImage` at the 1200 px
copy, and the cards and post pages add `srcset`/`sizes` from the manifest. Use a new master file name for a changed
picture: `/images/*` is cached for 30 days.

Build loadout screenshots from creators' YouTube videos are captured by the owner (we can't download YouTube); ask for
the link and timestamp.

## Frames cut from video files the owner sends

When the owner sends a creator's video as a file, frames can be cut from it directly. They go into `masters/` like any
other picture. What was done to each, so it can be redone:

| Master | Video file | Where in it | What was done |
|---|---|---|---|
| `builds/division-resurgence-triple-threat-aegis-hybrid-build-demo2x-loadout` | `qFG1it9DFBA` | 10:38.8 | Black side bars cropped (x 134 to 1786 of 1920). The screen recorder's grey touch dot (centre 960, 392, radius 20) painted out with OpenCV inpainting; nothing else changed. |
| `builds/division-resurgence-demo2x-hazardous-area-combat-enhancer-teamfight-sets` | `qFG1it9DFBA` | 10:49.3, 10:55.5 and 11:02.7 | The "Combo Set Bonus" block of three skill cards, stacked. Each is from the last frame before the video's red circle is drawn over it. The touch dot is left in. |
| `builds/division-resurgence-unflinching-bulwark-build-tiktokandy-loadout`, `builds/division-resurgence-tiktokandy-big-drum-unflinching-ii-card` | `4GoB017732U` | see the build page's commit | Cropped to the game screen (no webcam). |
| `guides/division-resurgence-stats-sheet-double-barrel-in-hand`, `guides/division-resurgence-stats-sheet-vector-in-hand` | `RVgOTMB4B8o` | see the stats guide's commit | Cropped to the stats panel. |
| `guides/division-resurgence-precious-cargo-four-bosses` | `niOtrLdkPrI` | 10:56 | Cropped to the objective tracker. |
| `guides/division-resurgence-echo-locations-echo-hologram` | `8tbQ7WIrXu8` | 0:30 | Cropped above the subtitles and the Skip button; the recorder's touch dot painted out. Creator not credited (owner's request). |
| `guides/division-resurgence-echo-locations-collectibles-screen` | `8tbQ7WIrXu8` | 0:17 | Full frame; mouse cursor painted out. |
| `guides/division-resurgence-shd-crate-locations-in-game-map` | `LH_49KKa_eg` | 0:06 | Cropped to the map (no tabs, no filter column); cursor and touch dot painted out. |
| `guides/division-resurgence-collectibles-guide-mysteries-screen` | `VOZD9huBi2c` | 1:30.5 | Full frame; mouse cursor painted out. |
| `guides/division-resurgence-collectibles-guide-tracked-artifact-map` | `VOZD9huBi2c` | 0:00.5 | Cropped below the tabs and left of the filter column; touch dot and cursor painted out. |
| `news/division-resurgence-winter-update-snowy-street-christmas-tree` | `8tbQ7WIrXu8` | 0:44 | Cropped below the Skip button and above the speaker label; the recorder's touch dot painted out. Creator not credited (owner's request). |
| `news/division-resurgence-season-2-trailer-three-agents-street` | `LsL2vqPnIac` (Ubisoft's Season 2 Phase 1 launch trailer) | 0:29 | Full frame, no text. Featured image of the Deadlock post. |
| `news/division-resurgence-season-2-trailer-agent-gramophone-echo` | `LsL2vqPnIac` | 0:20 | Full frame, no text. Not used on a page yet. |
| `news/division-resurgence-season-2-trailer-squad-ruined-street` | `LsL2vqPnIac` | 2:21.1 | Full frame, before the logo appears. Not used on a page yet. |
| `news/division-resurgence-deadlock-season-2-pass-card` | `LsL2vqPnIac` | 2:32 | Cropped to the three pass columns of the closing card. |
| `guides/division-resurgence-weekly-bounty-target-instance-gearhead` | `2x8dTe9CeMw` | 0:00.5 | Cropped to the Target Instance card. Endgame tips, Weekly Bounties. |

Rules for these: never a frame with another player's name readable in it (crop it out or pick another frame), never a
creator's logo, webcam or caption, and never paint a logo or watermark out: pick a clean frame or skip the picture.

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
  title in the site's guide style or swap a word on a poster (`"word"`, used for "Stop the spread of bugs").
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

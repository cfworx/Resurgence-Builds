# Fact check: ten review, gear and gift pages (resurgencebuilds.com)

Checked November 16, 2026 (UTC). Read only; no project file was changed. Amazon was not opened by any route.

Method
- Every factual sentence, front matter fact, FAQ answer and table cell on the ten pages was compared with the two research files in `research/gear/`, the photos in `public/images/reviews/` and `public/images/guides/`, and fresh WebFetch reads of the publisher, maker and Ubisoft pages listed below.
- Pages fetched today (all loaded): GameSir G8 Plus FAQ; Tom's Guide best mobile controllers (updated 1 May 2026); Ubisoft Resurgence game page (en-sg); Ubisoft News Broken Dawn article (March 26, 2019); Ubisoft "Find out more about The Division with the books of the game" (January 9, 2019); Ubisoft "The Division 2 Shopping Guide" (April 16, 2019); Ubisoft "Dark Horse Comics and Ubisoft expand The Division's lore"; Ubisoft News "5 facts you might not know about The Division" (March 19, 2019); Dark Horse product pages for Extremis Malis HC, Remission HC and The World of Tom Clancy's The Division HC; Dark Horse SDCC 2018 blog; Chronicle Books New York Collapse; Random House The Art of Tom Clancy's The Division; Titan Books Limited Edition; Penguin Random House Broken Dawn.
- Not re-fetched (taken from the research files, which read them on November 15, 2026): AbeBooks, Porchlight, Turnaround, Barnes & Noble, Ubisoft Gear Shop, Ubisoft Store, Steam, App Store, Backbone help center, Apple Support, TechRadar review, WIRED, IGN, GamesRadar, TechRadar roundup, Gamewave, Geek Native, Aconyte, Audible.
- Global checks, all pages: no U+2013 or U+2014 characters (also checked U+2012, U+2015). No score, rating or star markup. No Amazon price; every price shown is printed on the owner's copy (confirmed in photos) or from a dated non-Amazon shop. Every Amazon link has the form `https://www.amazon.com/dp/<ASIN>?tag=resurgencebuilds-20`, plus one search link with the same tag (gift guide line 93); no other tag, no shortened link. Every internal link resolves to an existing page (`src/content/reviews/*`, `src/content/guides/*`, `src/pages/tier-list/index.astro`, `src/pages/builder.astro`). Every bare image path (`/images/reviews/x.webp`) is in `src/data/post-images.json`, so the figure plugin resolves it.

## ISBN-10 and ASIN check (computed, ISBN-13 check digits also verified)

| Book | ISBN-13 (edition linked) | Computed ISBN-10 | ASIN in link | Match | ISBN-13 also on our copy |
|---|---|---|---|---|---|
| The Art of Tom Clancy's The Division | 9781783298341 | 1783298340 | 1783298340 | yes | yes, back cover label (art-of-the-division-back-cover-900.webp) |
| New York Collapse | 9781452148274 | 1452148279 | 1452148279 | yes | not visible in the photos (back cover shows no barcode) |
| Extremis Malis HC | 9781506710426 | 1506710425 | 1506710425 | yes | yes, "978-1-50671-042-6" (extremis-malis-front-back-cover-1600.webp) |
| Remission HC | 9781506722399 | 1506722393 | 1506722393 | yes | yes, "978-1-50672-239-9" (remission-front-back-cover-1600.webp) |
| The World of Tom Clancy's The Division | 9781506711041 | 1506711049 | 1506711049 | yes | yes, "978-1-50671-104-1" (world-of-the-division-back-cover-900.webp) |
| Broken Dawn, US mass market | 9781984803177 | 1984803174 | 1984803174 | yes | yes, "978-1-9848-0317-7" (broken-dawn-front-back-cover-1600.webp) |
| Recruited, paperback | 9781839081163 | 1839081163 | 1839081163 | yes | not owned |
| Compromised, paperback | 9781839081866 | 1839081864 | 1839081864 | yes | not owned |
| Hunted, paperback | 9781839082740 | 1839082747 | 1839082747 | yes | not owned |
| Broken Dawn UK (named, not linked) | 9781789091878 | 178909187X | none | n/a | not owned |

Non ISBN ASINs: Broken Dawn Kindle B07L7S8W4Q and Hearts on Fire B098XQ75B7 (Audible Audio Edition) were tied in the books research file by Amazon search result titles only (one source each, medium confidence).

Controller ASINs against controllers research section 3:

| Product on page | ASIN | Research tie | Firmness |
|---|---|---|---|
| PS5 DualSense | B0CQKLS4RP | Amazon titles (.com, .ca, .com.mx) "PlayStation DualSense Wireless Controller - White", re-checked | firm; note it is the White listing |
| Xbox Wireless Controller | B08DF248LD | Amazon titles "Xbox Core Wireless Controller - Carbon Black" plus a reseller page with model QAT-00001, re-checked | firm |
| Backbone One, USB-C (2nd gen) | B0CCT2LWT8 | Amazon title, IGN product card, Engadget link, re-checked | firm for the product; which hardware revision (with or without the 3.5 mm jack after August 1, 2026) is not known; a second listing B0GV2134KV exists |
| GameSir G8 Plus | B0D8JJRCJN | Amazon search result title only | single source, medium |
| GameSir G8 Galileo | B0CM3C9HRG | WIRED and GamesRadar buy links | firm |
| Backbone Pro | B0DQM23MLZ | Amazon title plus WIRED link | firm |
| Razer Kishi V3 Pro | B0F231T7BG | Amazon title plus TechRadar and GamesRadar links | firm |
| Scuf Nomad | B0D49HBW9D | Amazon title plus IGN product card | firm |
| ELO Vagabond | B0DBQBP3D5 | Amazon title plus GamesRadar link | firm |

Every Amazon link on the ten pages sits next to the product it names.

---

## 1. reviews/the-division-broken-dawn-novel.md

**UNSUPPORTED** (attribution) line 73: "Ubisoft places it in the months between The Division and The Division 2, and describes it as both a prequel to the second game and a follow-up to New York Collapse."
Also line 79: "Ubisoft calls this novel a follow-up to it, and April Kelleher is in both." and line 56 (FAQ): "Ubisoft describes it as a prequel to The Division 2 and a follow-up to the companion book New York Collapse."
- Evidence: no Ubisoft page calls Broken Dawn a "follow-up" to New York Collapse. The cited Ubisoft News article (March 26, 2019, https://news.ubisoft.com/en-us/article/2Q6Nchof1ack3qWsQBuHLs/the-division-broken-dawn-novel-explores-effects-of-global-collapse) says it "takes place in the months between the The Division and The Division 2", calls April Kelleher "the protagonist of New York Collapse", and says the story "plays out separately from the events of The Division 2". It does not say prequel. The "prequel" wording is in a different Ubisoft article, January 9, 2019 ("a suspenseful and action-packed prequel story of The Division 2", https://www.ubisoft.com/en-sg/game/the-division/news-updates/htXU6ZOzs6tbQr08OIe5u/find-out-more-about-the-division-with-the-books-of-the-game), which calls New York Collapse only "Irvine's previous entry in the franchise". The April 16, 2019 shopping guide also does not say follow-up. The research file's "Ubisoft calls it ... a follow-up to New York Collapse" could not be traced to any page.
- Replacement line 73: "Ubisoft places it in the months between The Division and The Division 2, and a January 2019 Ubisoft article calls it a prequel to the second game. Its April Kelleher is the woman from New York Collapse."
- Replacement line 79: "The link that matters is backwards, to New York Collapse: April Kelleher, the woman whose notes fill that book, is one of this novel's main characters."
- Replacement line 56: see next item. Add the January 9, 2019 Ubisoft article to `sources`.

**UNSUPPORTED** line 56 (FAQ): "It is sold as a standalone novel."
- Evidence: the Penguin Random House page (https://penguinrandomhouse.com/books/600407/tom-clancys-the-division-by-alex-irvine/9781984803177) does not say standalone; it calls it a "new story" set in the world of The Division 2. Neither Ubisoft article says standalone.
- Replacement answer: "Penguin Random House sells it as a new story in the world of The Division 2, and Ubisoft calls it a prequel to that game. It starts months after the New York outbreak that the first game covers, so knowing that background helps. Its April Kelleher is the woman from the companion book New York Collapse."

**RISKY** line 37: "You would rather look than read. The two comics cover the same months."
- Evidence: Extremis Malis is set "months after" the New York attack (back cover; Ubisoft) and Remission is only called a prequel to The Division 2 (Dark Horse). Nobody says the three cover the same months.
- Replacement: "You would rather look than read. The two comics are set in the same gap between the games."

Confirmed (photo broken-dawn-front-back-cover-1600.webp): cover price "$9.99 USA" on the back; ISBN 978-1-9848-0317-7; front credits "Alex Irvine, author of New York Collapse"; back cover text: months after an outbreak that started in New York City on Black Friday, Aurelio Diaz hunting a colleague who "abandoned his duty", April Kelleher "traveled out of New York and into a troubled American Midwest", her husband's murder, an antiviral. Alt text and caption match the photo. PRH: imprint G.P. Putnam's Sons, mass market, 368 pages, March 26, 2019, Add to Cart present ($10.99 list now; the $9.99 is the printed price, allowed). UK Titan March 15, 2019 and ISBN 9781789091878 from the research file (World of Books). Kindle and paperback links match. Lowest cover price among the six owned books: true ($9.99 against $14.99, $19.99, $24.95, $39.95, $39.99 printed). Lore is kept as the book's, with the Resurgence section correctly saying it will not explain the mobile game.

Claims checked and confirmed: 27 of 32.

---

## 2. reviews/new-york-collapse-division-book.md

**UNSUPPORTED** line 58 (FAQ): "Ubisoft describes the novel Broken Dawn as a follow-up to New York Collapse, and it continues April Kelleher's story. Both were written by Alex Irvine."
- Evidence: as in section 1; Ubisoft News (March 26, 2019) only says April Kelleher is "the protagonist of New York Collapse". Chronicle credits New York Collapse to "Ubisoft ; Melcher Media ; Alex Irvine" (https://www.chroniclebooks.com/products/tom-clancy-s-the-division-new-york-collapse).
- Replacement: "You do not have to, but they are linked. Ubisoft says April Kelleher, the woman whose notes fill New York Collapse, is one of the main characters of Broken Dawn. Alex Irvine is credited on both."

**RISKY** line 14 (product summary, shown on the page): "The printed book is long out of the shops, so price is the catch."
- Evidence: the body hedges ("It no longer looks to be in print", "Appears to be out of print", dated November 15, 2026), but the summary states it flatly and undated. AbeBooks still listed new copies (from US$100.00) per the research file.
- Replacement: "It appears to be out of print, and copies now sell at collector prices, so price is the catch."

**RISKY** (photo rule) line 86 image new-york-collapse-missing-poster-800.webp: the poster carries a large, clear photograph of a woman's face.
- Evidence: the photo itself. It is a printed prop, but the rules say no picture shows a face, and the person in the prop photo is presumably a real model.
- Suggested fix: crop to the headline and "Last seen in Hell's Kitchen" line, or blur the face, and keep the caption.

**STYLE** (experience wording) line 78: "The guide itself is sober reading: sections on how a city depends on outside supplies, why a pandemic is the worst case, what to pack."
- Evidence: the three section topics are all visible in the owner's photos (Dependency on Outside Supplies, new-york-collapse-fragile-systems-pages-1000.webp; Why a Pandemic Is the Biggest Threat, new-york-collapse-pandemic-pages-1000.webp, not used on the page; The Go-Bag). "Sober reading" describes a reading experience.
- Replacement: "The printed guide is plain and practical: our photos show sections on how a city depends on outside supplies, why a pandemic is the biggest threat, and what to pack in a go-bag."

Confirmed: cover reads "New York Collapse: A Survival Guide to Urban Catastrophe", "Warren Merchant"; front shows no Tom Clancy or Ubisoft name; back opens with handwritten "Property of April Kelleher" (new-york-collapse-front-back-cover-1200.webp; this also settles the subtitle question left open in the books research file). Entries are dated ("12/5", "12/9"). Map, transit card and poster match captions and alt text. Chronicle: March 8, 2016 (03/08/2016), paperback, 176 pages, $24.95, ISBN 9781452148274, "seven removable artifacts" naming a city map and transit card, handwritten account of a woman learning why New York fell, no add to cart. AbeBooks prices dated. Hell's Kitchen appears in `guides/division-resurgence-safe-codes.md` line 230. Resurgence bridge uses only Ubisoft's own words (game page: New York City, "first wave of SHD agents").

Claims checked and confirmed: 26 of 29.

---

## 3. reviews/the-division-extremis-malis-comic.md

**WRONG** (attribution) line 53 (FAQ): "Dark Horse and Ubisoft both describe it as a prequel to The Division 2."
- Evidence: Dark Horse's page says "This prequel to Tom Clancy's The Division 2" (https://www.darkhorse.com/Books/3003-527/Tom-Clancys-The-Division-Extremis-Malis-HC), and so does the back cover of our copy. Ubisoft's article (https://www.ubisoft.com/en-us/game/the-division/news-updates/37xIA4UhSPwuADfUmoAxad/dark-horse-comics-and-ubisoft-expand-the-divisions-lore) does not use "prequel"; it calls the series "the perfect introduction to the post-pandemic world of Tom Clancy's The Division 2". Ubisoft's April 2019 shopping guide uses the same wording.
- Replacement: "It is set months after the bioweapon attack on New York. Dark Horse and the back cover call it a prequel to The Division 2, and Ubisoft calls it an introduction to that game's world."

**UNSUPPORTED** (experience claim) line 14 (product summary): "It is a slim hardcover you can finish in a sitting."
- Evidence: nobody has timed reading it; the rules forbid implying an experience. Page count (72) is a fact.
- Replacement: "It is a slim 72-page hardcover."

**RISKY** (alt text) line 74: "a full-color comic spread of Division agents moving and fighting among trees"
- Evidence: extremis-malis-pages-30-31-1000.webp shows agents walking and talking in a wood, one aiming a shotgun, and wild turkeys; there is no fight.
- Replacement alt: "Pages 30 and 31 of The Division: Extremis Malis, a full-color comic spread of Division agents meeting in a wood, with wild turkeys around them".

Confirmed (photo extremis-malis-front-back-cover-1600.webp): front credits "Christofer Emgård", "Fernando Baldó", "Michael Atiyeh"; back: "This prequel to Tom Clancy's The Division 2", "Months after a bioweapon devastated New York City", Caleb Dunne's partner killed, the woman he pursues to Philadelphia, Fort Meade and Washington, D.C., "$14.99 US", ISBN 978-1-50671-042-6, Dark Horse Books logo. Dark Horse: July 23, 2019, 72 pages, HC, $14.99, colorist Atiyeh, covers J. P. Leon (Dark Horse spells the artist "Baldo"; the cover and Ubisoft use Baldó, so the page is right). Issue #1 January 9, 2019 (Ubisoft) and #3 April 3, 2019 (research). Motto "Extremis malis extrema remedia" printed on the World cover (world-of-the-division-front-cover-900.webp). Chapter Two page matches caption. Porchlight "Sold Out" dated in research.

Claims checked and confirmed: 24 of 27.

---

## 4. reviews/the-division-remission-graphic-novel.md

**WRONG** (alt text, contradicted by the photo) line 9: "the front showing two armed figures on the steps of the Lincoln Memorial"
- Evidence: remission-front-back-cover-1600.webp shows three figures on the steps (a bearded armed man on the left, a smaller figure with a backpack in the middle, a woman with a backpack on the right).
- Replacement: "Front and back covers of the hardcover graphic novel Tom Clancy's The Division: Remission, the front showing three figures with weapons and backpacks on the steps of the Lincoln Memorial".

No other issues. Confirmed: cover "Based on a Ubisoft creation", "JD Morvan", "The Tribe"; back cover premise (deadly virus, Division agents protecting Washington, DC from violent factions, "this prequel to the hit Ubisoft video game Tom Clancy's The Division 2", four survivors once childhood friends); ISBN 978-1-50672-239-9; Dark Horse: writer Jean-David Morvan, art The Tribe, Dec. 8, 2021, 64 pages, HC. French original March 8, 2019 and Turnaround stock from the research file. "Newest book on this shelf" is true for the six owned titles. Pages 44 and 45 caption matches.

Claims checked and confirmed: 21 of 22.

---

## 5. reviews/world-of-tom-clancys-the-division-book.md

**WRONG** (attribution) line 68: "Dark Horse describes it as covering the Division's history, training and structure, its key characters and factions, and a timeline from the outbreak to the events of The Division 2."
- Evidence: Dark Horse's product page (https://www.darkhorse.com/books/3003-528/world-of-tom-clancys-the-division-hc) and its 2018 blog only say "the tactical methods, the high-tech tools, and the all-important mission of the Division". The history, training, structure, factions, key characters and timeline wording is Ubisoft's (Ubisoft News, March 19, 2019, https://news.ubisoft.com/en-us/article/5GlPfs8rLuSsn9TctM2g9v/5-facts-you-might-not-know-about-the-division).
- Replacement: "Ubisoft describes it as covering the Division's history, training and structure, its key characters and factions, and a timeline from the outbreak to the events of The Division 2."

**UNSUPPORTED** line 91: "This book explains those words: what SHD is, what the first wave was, how activation works. ... Treat it as the background the game assumes you have."
- Evidence: the photos show Chapter 1 (what the SHD is) and Chapter 3 (activation and deployment), but no source or photo shows the book discussing a "first wave"; Ubisoft's 5 facts article does not mention one. "The background the game assumes you have" presents console game lore as Resurgence's background, which rule 3 forbids.
- Replacement: "Ubisoft's page for Resurgence says you play one of the first wave of SHD agents in New York City. This book explains the Division as the console games describe it: what the SHD is and how its agents are activated. None of it was written about Resurgence, so do not expect the mobile game's characters or missions."

**RISKY** line 54 (FAQ): "It is still useful background: Resurgence is set in New York City and you play one of the first wave of SHD agents, which is exactly what the early chapters explain."
- Evidence: same as above; implies the book's lore explains Resurgence.
- Replacement: "It is still useful background on the Division itself. Ubisoft's page for Resurgence says the game is set in New York City and you play one of the first wave of SHD agents; the book's early chapters explain what the SHD is and how its agents are activated in the console games."

Confirmed: cover seal and motto, back cover agents over Washington with Dark Horse, Ubisoft and Massive logos, "$39.99 US", ISBN 978-1-50671-104-1 (photos). Dark Horse: writer Rick Barba, March 19, 2019, FC 200 pages, HC 9 x 12 in. Other page counts 192 (Dark Horse 2018 blog, fetched) and 160 (Ubisoft News, fetched; also Ubisoft January 2019 article). Limited Edition April 9, 2019 contents from research. Chapter 1 text (executive powers, "rules of engagement unfettered by legal constraints") supports "what its agents are allowed to do". Chapter 3 Activation and Deployment, Recruitment (Chapter 2) and the Washington D.C. situation report (Preface) match captions and alt text. Internal link /guides/which-specialization-to-pick/ exists.

Claims checked and confirmed: 22 of 25.

---

## 6. reviews/art-of-tom-clancys-the-division-book.md

**RISKY** lines 41 and 49 (buy button "Publisher's page" and `about.url`) point to randomhouse.com.
- Evidence: the Random House page names no publisher (Titan appears only in reader quotes), no page count and no image count (https://www.randomhouse.com/books/253165/the-art-of-tom-clancys-the-division-by-paul-davies/). The 192 pages and "over 300 images" come from Titan's Limited Edition page (https://titanbooks.com/the-art-of-tom-clancys-the-division-limited-edition-8641).
- Replacement: relabel the button "Penguin Random House page (US distributor)", or point it at a Titan Books page for the standard edition if one exists. Keep the Titan Limited Edition link in sources, since it carries the 192 page and 300 image figures.

**RISKY** (alt text and caption) line 72: "a dark subway platform lit by blue strip lights" / "A subway platform across two full pages."
- Evidence: art-of-the-division-subway-concept-art-1000.webp shows a tiled subway passage hung with plastic sheeting and blue lamps; the printed caption on the spread calls it a decontaminated area. It is not a platform.
- Replacement alt: "A two-page spread of concept art from The Art of Tom Clancy's The Division: two agents in a tiled subway passage hung with plastic sheeting and lit by blue lamps". Caption: "A subway passage across two full pages."

Confirmed: back cover price label "$39.95 US / $50.95 CAN / £29.99", ISBN 9781783298341, TITANBOOKS.COM (art-of-the-division-back-cover-900.webp), so "Titan Books price label" is right. Titan: published 8 March 2016, 192 pages, over 300 images, Limited Edition in slipcase with deluxe clamshell case and print signed by Oscar Sjöstedt. Random House: Paul Davies, hardcover, $39.95, March 22, 2016 US on sale. Church, subway and Hudson Refugee Camp spreads are in the photos; the Hudson spread quotes "Tom Garden" by name. The Art of The Division 2 lithographs as a collector's edition item: research file (Ubisoft source). Resurgence "ten years later" (March 2016 to March 31, 2026): correct.

Claims checked and confirmed: 20 of 22.

---

## 7. reviews/gamesir-g8-plus-division-resurgence.md

**RISKY** (misleading) line 38 (notFor): "You do not want one more thing to charge: a plug-in pad draws power from the phone"
- Evidence: the G8 Plus is Bluetooth with its own 1000 mAh battery (GameSir FAQ, https://gamesir.com/pages/faq-questions-about-g8-plus); Tom's Guide lists "Needs to be charged" as a con. The second half of the sentence reads as if it describes this pad.
- Replacement: "You do not want one more thing to charge. This pad has its own battery; plug-in pads such as the Backbone One have none and run off the phone."

**RISKY** (alt text) line 76: "an agent crouched behind a snow-covered police car"
- Evidence: gamesir-g8-plus-in-hands-playing-1400.webp (screen enlarged): the agent stands at the side of a snow-covered white sedan with stripes; no light bar or police marking is legible, and the agent is not crouched behind it. The L1, R1, "L1 + R1" prompts over the skills and the triangle by the weapon panel are visible, so the caption is right.
- Replacement alt: "Two hands holding a GameSir G8 Plus with The Division Resurgence on the phone, an agent beside a snow-covered car, with L1 and R1 prompts over the skill buttons at the bottom of the screen".

**RISKY** (photo rule) line 76 same image: the blurred background is a lit autumn garland on what looks like a mantel or shelf in the owner's home (also visible in the gift guide hero, see section 10). Low risk because it is out of focus; flagging for the owner's judgment.

Confirmed against GameSir's FAQ (fetched): pairing button next to the charging port held 2 seconds until the light blinks fast; Home plus A, B, X or Y changes mode; Home light yellow Android, blue DS4, red Switch, cyan G-Touch; M plus LT or RT for hair trigger; most phone cases fit if snug; 120 to 215 mm (4.72 to 8.46 in); 1000 mAh, 500 mAh per side; Hall effect sticks and Hall effect analog triggers; app adjustments on Android. GameSir product data (research): Switch, iOS, Android phones and tablets, Bluetooth, wired or dongle for PC. Tom's Guide (fetched, updated 1 May 2026): best overall, charging passthrough No, headphone jack No, two rear buttons mapped "in the GameSir app". Photos: L4 and R4 back buttons, pairing button with wireless symbol beside USB-C, LT and RT triggers, offset sticks, M button below the D-pad, blue Home light, no model name on the pad (back label blurred). Ubisoft statements, iOS known issue (May 20, 2026), TechRadar review and roundup picks: research file. Owner plays on this pad, so "hands-on" and "works" are allowed. No battery life or feel claims; untested items stated as untested.

Claims checked and confirmed: 41 of 44.

---

## 8. guides/division-resurgence-controller-guide.md

**RISKY** (unsupported) line 109: "On PC the simple route is an Xbox or PlayStation controller, which Steam handles itself."
- Evidence: the Steam listing has every controller flag set to false and no controller support line (controllers research 1.4); Ubisoft's FAQ says only "a controller of your choice". Nothing confirms Steam Input handles this game for either pad.
- Replacement: "On PC, Ubisoft says you can use a controller of your choice, and an Xbox or PlayStation pad is the obvious one to try. The Steam store page does not list controller support, so we cannot promise how Steam handles it."

**RISKY** (unsupported) line 72 (table): "Also the usual pick on PC."
- Evidence: no source for this.
- Replacement: "Also works with Windows PCs, per Microsoft." (Xbox page: "Works with XBOX consoles, Windows PC, iOS and Android", research section 3.)

Confirmed: Ubisoft statements and dates (March 18, March 31, April 5, April 28, June 5, May 20, September 2026), App Store "Controller: Supported", Google Play silent, Steam lists no controller support, Steam Deck unrated, TechRadar review on aim assist and sensitivity, Apple Support pairing and iOS 16 remapping, Backbone August 1, 2026 jack change, Backbone Lightning model still sold, iPhone 14 and older Lightning, Sony and Microsoft Bluetooth statements, every table cell (connection, phones, review site picks: WIRED and TechRadar Backbone One, Tom's Guide G8 Plus, IGN Backbone Pro, GamesRadar ELO Vagabond, Galileo best value at GamesRadar and best Hall effect at WIRED, Kishi V3 Pro premium at TechRadar and most comfortable at GamesRadar, Scuf Nomad best for iPhone at GamesRadar and Tom's Guide, not Android per Scuf), Galileo pass-through and jack per GameSir (read via page summary, weaker). Codes guide has the Backbone steps and an October 25, 2026 check date. Featured image and caption match the photos; the HUD shows no legible player name.

Claims checked and confirmed: 46 of 48.

---

## 9. guides/the-division-books-in-order.md

**RISKY** line 34: "There are ten Division books and audio titles so far" and line 17 (FAQ): "Ten as of November 2026".
- Evidence: the books research file says its search budget ran out before it could rule out new 2025 to 2026 titles ("What I could not verify", item 2). The count (4 + 1 + 2 + 1 + 1 + 1 = 10) is internally right.
- Replacement line 34: "We know of ten Division books and audio titles so far, and there is no official reading order." FAQ: "Ten that we know of as of November 2026: ..."

**STYLE** (precision) line 112: "Extremis Malis and Remission each showed as sold out or out of stock at one bookseller we checked."
- Evidence: Remission's out of stock listing was Turnaround, a UK distributor, not a bookseller (research section 2; the Remission review itself says "distributor").
- Replacement: "Extremis Malis showed as sold out at one bookseller (Porchlight), and Remission as out of stock at one UK distributor (Turnaround)."

Confirmed: story placement statements and who makes them (Hearts on Fire, Ubisoft; New York Collapse, Chronicle; Extremis Malis, Ubisoft "months after" and Dark Horse "prequel"; Remission, Dark Horse; Broken Dawn, Ubisoft; Recruited, Thomas Parrott on Aconyte's page), the two stated limits, every publication date, author and publisher in the table, the Amazon links (ISBN-10 check above), Hearts on Fire details (six episodes, 5 hrs 30 mins, Kc Wayland, Katee Sackhoff, Shannon Woodward, firefighter-paramedic), Operation Crossroads summaries, ebook and audiobook formats, tabletop RPG dates (announced March 24, 2026; Kickstarter May 12 to June 3, 2026) and the hedge on shipping, Barnes & Noble stock for Broken Dawn and the Art book. Ubisoft game page (fetched): "first wave of SHD agents", "a unique perspective of the events around The Division 1 & 2", New York City, new campaign and canon storyline, so line 95 is a fair paraphrase. Hero photo shows the six owned books named in the alt text.

Claims checked and confirmed: 44 of 46.

---

## 10. guides/the-division-gift-guide.md

**RISKY** (misleading) line 99: "Resurgence is free, and what it sells is sold as in-app purchases through the App Store or Google Play. A gift card for whichever store they use covers it."
- Evidence: the game is also on PC through Steam and Ubisoft Connect (Steam listing; Ubisoft Store listing), and Ubisoft's game page links an "Official Store" run by Coda for in-game purchases (books research 3c). A phone store gift card does not cover a PC player.
- Replacement: "A gift card for the store they play through. Resurgence is free and sells extras in the game: through the App Store or Google Play on a phone, and through Steam or Ubisoft Connect on PC. Ask which one they use."

**RISKY** line 105: "The agent watch replica only ever came inside the first game's Sleeper Agent Collector's Edition."
- Evidence: research found it bundled there and "No standalone official watch replica was found on sale"; that does not prove "only ever".
- Replacement: "As far as we could find, the agent watch replica only came inside the first game's Sleeper Agent Collector's Edition."

**RISKY** (photo rule) featured image the-division-gift-guide-books-and-controller-1600.webp (line 9 of the front matter): the left panel shows the owner's room behind the controller: a lit autumn garland on a mantel or shelf and a dark object below it, a wider view than the GameSir review uses.
- Suggested fix: crop the left panel tighter to the hands and phone, or use the controller guide's table shot (division-resurgence-controller-guide-gamesir-1600.webp), which shows only leaves and a table.

**STYLE** lines 17 and 78: "The shop's footer says it is run by Snow Commerce under license from Ubisoft."
- Evidence: per the books research file the footer says Snow Commerce is the seller of all merchandise under license from Ubisoft and that the site is not administered by Ubisoft. "Run by" is a slight paraphrase.
- Replacement: "The shop's footer says Snow Commerce sells the merchandise under license from Ubisoft."

Confirmed: Ubisoft Store digital only; Gear Shop 11 items (mug, mouse pad, beanie, two snapbacks, two T-shirts, sweatshirt, hoodie, zip-up hoodie, hockey jersey), all SHD or phoenix crest, prices $15.95 to $79.95 dated November 15, 2026 (non Amazon, allowed); nothing for Resurgence; Ubicollectibles figurine 2017; tabletop RPG crowdfunded May and June 2026; Definitive Edition on the Ubisoft Store with its expansions; help center says no progression with the other Division games; Xbox One case photo shows a "PRE-OWNED" sticker (the-division-xbox-one-front-back-1600.webp), so the caption is right; controller rows match the controller research; every book row matches its review. "Everything with a review link is something we own" is true.

Claims checked and confirmed: 38 of 42.

---

## Consistency across the ten pages

- Page counts match everywhere: Extremis Malis 72, Remission 64, Broken Dawn 368 (US), World 200 (Dark Horse product page, with 192 and 160 noted), Art 192, New York Collapse 176.
- Dates match everywhere (Extremis Malis HC July 23, 2019; Remission December 8, 2021 and French March 8, 2019; World March 19, 2019; Broken Dawn US March 26, 2019 and UK March 15, 2019; Art March 2016; New York Collapse March 8, 2016).
- Owned items match: six books plus the GameSir G8 Plus and an Xbox One copy of the 2016 game.
- Availability matches and is dated everywhere except the New York Collapse product summary (section 2).
- The "follow-up to New York Collapse" attribution to Ubisoft appears on two pages (Broken Dawn lines 56, 73, 79; New York Collapse line 58) and must be fixed on both.

## Could not check

- New York Collapse ISBN against our copy (no photo of a barcode or copyright page).
- AbeBooks, Porchlight, Turnaround, Barnes & Noble, Gear Shop, Steam and App Store states were not re-fetched today; the pages rely on the research file's November 15 reads, which are dated on the pages.
- GameSir product pages and Backbone pages are only readable through the summary tool (research file notes this); the GameSir FAQ was again read through the summary tool today.
- Gamewave (French Remission date) and the Aconyte pages were not re-fetched.
- Which Amazon listing the Backbone One link (B0CCT2LWT8) sells now, with or without the headphone jack.

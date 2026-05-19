# Division Resurgence Community Knowledge Base
## Dataset README & AI Ingestion Guide

**Source:** r/thedivisionresurgence (Reddit)  
**Date Range:** February 16, 2026 – May 18, 2026 (~90 days)  
**Compiled:** 2026-05-19  
**Game:** Tom Clancy's The Division Resurgence (mobile)

---

## Contents

| File | Description | Size |
|------|-------------|------|
| `division_resurgence_threads.jsonl` | Full structured data — every post + all comments, one JSON object per line | ~9.5 MB |
| `division_resurgence_kb.md` | Human + AI readable Markdown — organized by topic/flair, top threads per category | ~0.5 MB |
| `division_resurgence_qa.md` | Distilled Q&A — top 500 high-engagement threads with best community answers | ~0.9 MB |

---

## Dataset Statistics

| Metric | Count |
|--------|-------|
| Total posts | 3,527 |
| Total comments | 30,048 |
| Posts with comments | 2,905 |
| Estimated total words | ~931,000 |
| Unique flair categories | 15 |

---

## Topic Breakdown (by flair)

| Flair | Posts |
|-------|-------|
| Question | 1420 |
| Discussion | 681 |
| General | 598 |
| Bug Report | 171 |
| Weapon And Gear Help | 155 |
| Suggestion | 138 |
| Builds | 98 |
| Media | 76 |
| Guide | 60 |
| Humor | 54 |
| PSA | 33 |
| Megathread | 27 |
| Custom Removal Reason | 8 |
| Dev Team | 6 |
| Rule 7: LFG | 2 |

---

## JSONL Schema (division_resurgence_threads.jsonl)

Each line is a valid JSON object with this structure:

```json
{
  "post_id": "string",
  "title": "string",
  "author": "string (Reddit username)",
  "date": "YYYY-MM-DD",
  "score": "integer (upvotes)",
  "upvote_ratio": "float (0.0–1.0)",
  "num_comments": "integer",
  "flair": "string (topic category)",
  "url": "string (full Reddit URL)",
  "body": "string (post text, may be empty for image/link posts)",
  "comments": [
    {
      "id": "string",
      "author": "string",
      "score": "integer",
      "date": "YYYY-MM-DD",
      "body": "string",
      "parent_id": "string (t1_COMMENTID or t3_POSTID)"
    }
  ]
}
```

---

## Recommended AI Usage Patterns

### 1. RAG / Vector Embedding
- Use `division_resurgence_threads.jsonl` — embed each thread as a unit
- Recommended chunking: one document per thread (title + body + top 5 comments concatenated)
- Metadata fields for filtering: `flair`, `date`, `score`, `num_comments`

### 2. Fine-tuning / Instruction Tuning
- Use `division_resurgence_qa.md` — already formatted as context + Q&A pairs
- Focus on threads with `score >= 10` and `num_comments >= 5` for highest signal

### 3. Direct Context Injection
- Use `division_resurgence_kb.md` for structured topic context
- Feed specific flair sections based on user query topic

### 4. Knowledge Graph / Topic Extraction
- Cluster by `flair` field for topic nodes
- Link by `parent_id` chains in comments for reply trees
- High-upvote comments = community-validated answers

---

## Key Topics Covered (from community data)

Based on flair and post analysis, this dataset covers:

- **Gameplay Questions** — mechanics, controls, missions, open world
- **Build Theory** — weapons, gear, talents, optimization
- **Bug Reports** — known issues, platform-specific bugs, workarounds
- **Game Updates** — patch notes reactions, content releases, developer posts
- **Weapon & Gear Help** — specific weapon comparisons, gear rolls
- **Suggestions** — community wishlist, QoL feedback
- **Guides** — player-written tutorials, tips
- **Dark Zone** — PvPvE mechanics, strategies
- **Humor / Memes** — community culture and sentiment
- **PSA** — important player announcements
- **Megathreads** — consolidated discussion on major topics

---

## Notes

- Deleted/removed post bodies appear as empty strings (`""`)
- Deleted authors appear as `"[deleted]"`
- Comments are sorted by score (highest first) within each thread
- Image-only posts have empty `body` fields
- All timestamps are UTC

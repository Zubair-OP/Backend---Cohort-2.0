# Local SEO Prompt Framework (Claude + Chrome)

> Reference notes distilled from a shared article. Promotional/agency CTAs omitted.
> Scope: local SEO for home-services / local businesses (plumbers, HVAC, lawyers, cleaners, etc.).
> Many prompts assume browser access plus logins to SEMrush / Ahrefs / Google Search Console / GA4.

## Step 0 — Load business context first
Before running any prompt, give the assistant a single "business context" block so every
audit/strategy references your specifics instead of generic advice. Include:

- **Basics:** name, address, phone, website, GBP URL, years in business, team size
- **Services + market:** primary + secondary services, service areas, target customer, avg job value
- **SEO goals:** top 5 target keywords, keywords you rank for, keywords you should rank for but don't
- **Current standing:** reviews (count/rating/velocity), GBP views, monthly traffic, map-pack status, biggest problem
- **Competitors:** 3x (name, GBP URL, website, why they beat you)
- **What you've tried:** prior agency/DIY work, what worked, what didn't
- **Working preferences:** prioritize quick wins, label impact (high/med/low) + time-to-results,
  use spreadsheet format for comparisons, flag uncertainty instead of guessing

---

## Part 1 — Google Business Profile (Prompts 1–8)
1. **GBP category audit** — compare primary/secondary categories vs top map-pack competitors per keyword; find missing categories ranked by how many competitors share them.
2. **GBP attributes audit** — compare attributes (veteran-owned, free estimates, 24/7, etc.); list table-stakes vs differentiation, with ranking + CTR impact.
3. **Competitor review teardown** — review velocity (30/60/90-day counts), most-mentioned services/neighborhoods/staff, recurring complaints, keyword phrases to seed in your own reviews.
4. **Review response strategy** — response rate/time/tone analysis + a template system (3 variations each for 5/4/3/1–2-star), 40–80 words, keyword + city woven in naturally.
5. **GBP posts strategy** — audit competitor posting cadence/types; build an 8-week calendar (2–3 posts/wk) with seasonal, before/after, neighborhood, review, team, and educational posts.
6. **Services section optimization** — cross-reference GBP services vs website; write 40–60-word descriptions per service (keyword + service area + concrete benefit).
7. **GBP description optimization** — 3 versions under 750 chars (keyword-focused / conversion-focused / trust-focused) to A/B test over time.
8. **GBP photo audit** — analyze photo count/velocity/types/quality vs competitors; 8-week upload plan with shot list, naming convention, and geotagging to service areas.

## Part 2 — Website (Prompts 9–13)
9. **Keyword gap audit** — (SEMrush Keyword Gap) find keywords competitors rank 1–20 for that you don't; filter to vol 100–2000, KD <40, local intent; label "optimize existing" vs "create new."
10. **Money page audit** — (GSC) find pages ranking 4–15 for high-value terms (one push to top 3), high-impression/low-CTR title-meta problems, cannibalization; priority action list.
11. **Service + city page builder** — one page per service × city; full on-page spec (title, meta, H1, intro, why-us, service details, social proof, FAQ, CTA) + slug + internal links + citations.
12. **GSC analysis** — the "page-2 goldmine": keywords at position 11–20 with ≥100 impressions; 30-day sprint (titles/H1 → thin content → internal links → meta descriptions) with exact copy.
13. **Review sentiment analysis** — extract emotional language / outcomes / fears from competitor reviews; rewrite GBP description, homepage headline, review-request script, social proof.

## Part 3 — Backlinks + Authority (Prompts 14–16)
14. **Competitor backlink audit** — (Ahrefs) find domains linking to competitors but not you; 90-day plan (month 1 easy citations → month 2 local news/sponsors → month 3 authority) + outreach emails.
15. **Local citation audit** — check NAP consistency across GBP/Yelp/Bing/Apple/FB/BBB/Angi/etc.; flag inconsistencies + fix order + missing high-value directories + maintenance checklist.
16. **Local search intent mapping** — categorize keywords into 4 buyer stages (problem-unaware → ready-to-hire); map each to page type; pick 5 Stage-4 keywords to win in 90 days.

## Part 4 — Content + Tracking (Prompts 17–20)
17. **Content gap analysis** — (SEMrush Content Gap) find missing content keywords (50–500 vol, question words); briefs for top 20 organized by awareness stage.
18. **Entity optimization** — check knowledge panel / Wikidata / schema; produce LocalBusiness JSON-LD, entity-building site list, brand-mention/anchor plan.
19. **Competitor GBP posting pattern analysis** — forensic post-by-post analysis (day/time/type/topic/CTA) to reverse-engineer a market-specific posting cadence + first 4 weeks of posts.
20. **Monthly SEO performance report** — pull GSC + GBP + GA4, MoM deltas; one-page report focused on calls/conversions, not vanity traffic (3 wins, 3 problems, 1 top action).

---

## Suggested 12-week rollout
- **Wk 1:** context + prompts 1–2 (categories, attributes) — fastest wins
- **Wk 2:** 3–5 (reviews, responses, posts)
- **Wk 3:** 6–8 (services, description, photos) — GBP fully optimized
- **Wk 4:** 9, 12 (keyword gap, GSC)
- **Wk 5–6:** 10, 11, 13 (site audit, city pages, sentiment)
- **Wk 7–8:** 14–16 (backlinks, citations, intent)
- **Wk 9–10:** 17–19 (content gaps, entity, posting patterns)
- **Wk 11–12:** 20 (reporting) — measure, double down, fix

## Caveats worth remembering
- Prompts requiring SEMrush/Ahrefs/GSC/GA4 need those accounts + logins; results depend on data access.
- "Ranking impact high/med/low" claims are heuristics, not guarantees — verify against your own metrics.
- Auto-generating many near-duplicate city×service pages risks thin/doorway-page penalties; keep them genuinely differentiated.

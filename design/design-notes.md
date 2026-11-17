# Mala Mama design

## Expanded counter and portion rendering

Added 33 ingredient illustrations with the built-in image generation tool, retaining the transparent gouache style. Final assets: `public/art/ingredients-extra-1.png`, `public/art/ingredients-extra-2.png`, and `public/art/ingredients-extra-3.png`. Each uses equal square sprite cells and no labels or trays baked into the artwork.

Prompt set: consistent three-quarter overhead hand-painted hotpot ingredients, generous cell padding, no text or background. Sheet 1 (4×3): instant noodles, Spam, crab stick, rice cake; sausage, cheese, spinach, bean sprouts; duck blood, beef tripe, baby Chinese cabbage, chicken. Sheet 2 (4×3): potato, fish fillet, cuttlefish, black fungus; bean curd, egg, cheese tofu, seaweed; pumpkin, lobster ball, squid ring, ramen. Sheet 3 (3×3): bacon, pork roll, corn noodles; Taiwan sausage, pork meat ball, fortune bag; pork chittering, enoki mushroom, dumpling. A background-extraction edit removed the third sheet's backdrop while preserving its positions and artwork.

The counter now scrolls and supports text search combined with the existing category filters. Long labels wrap. The bowl renders one stable sprite per selected portion, without the former seven-type limit, and scales its arrangement to fit. Three tofu portions visibly render three illustrations. Desktop (1440×1000) and mobile (390×844) browser checks verified all 45 selections, duplicate removal, receipt weights and prices, searches, filtering, all four asset sheets, and next-guest clearing without runtime errors or horizontal overflow.

Concept: warm cream (#f7f4eb), deep green (#23483e), sage cabinet (#809272), burnt-orange actions (#cc5b36). Fraunces display headings paired with DM Sans interface text. A metal four-column ingredient cabinet next to a paper customer order and illustrated bowl. At narrow widths the order, three-column cabinet, and bowl stack in playing order. Receipt opens as a centered paper dialog.

The concept's receipt inset describes the post-round state; it is not permanently visible beside the game. All controls, labels, score calculations, and timer are native UI. Food, bowl, and customer portraits use a generated transparent 4×4 sprite atlas. Local fallbacks keep typography readable if Google Fonts is unavailable.

Generated with the built-in image generation tool. Concept prompt: complete cozy malatang game screen, cream and green palette, stainless counter with twelve food trays, customer budget and required ingredients, patience, bowl, weigh-and-serve action, and receipt state including three scores, stars, and tips.

Asset prompt: transparent 4×4 atlas, softly realistic gouache ingredients. Row 1 bok choy, broccoli, shiitake, lotus root. Row 2 beef rolls, shrimp, fish balls, tofu. Row 3 udon, glass noodles, corn, quail eggs. Row 4 cream ceramic bowl and three smiling guest portraits. No text, grid, trays, or labels.

## Visual verification

Compared the concept and rendered desktop screenshot using image inspection, at a 1536×1024 viewport, plus mobile at 390×844. Palette retains ivory, dark green, sage, and orange. Display serif and sans-serif controls retain the editorial hierarchy. The primary four-column metal cabinet, right-side paper order, and bowl remain in the same arrangement. Generated food and portraits preserve the hand-painted direction and transparent cutouts. Labels, filters, add controls, and orange serve action remain real UI. The receipt preserves itemization, totals, three score columns, stars, and next-guest action.

Intentional production adaptations: the concept's receipt inset is a modal shown after serving; the header is simplified to a divider; the headline is smaller and left-aligned to give gameplay space; decorative flourishes are omitted. Added functional copy includes portions, clear, countdown seconds, timer-start explanation, progress totals, and scoring instructions. Mobile places the customer before the cabinet and bowl. Reduced-motion settings remove transitions. Fixed an artwork hitbox overlapping removal controls and tightened tray height; enlarged order text. Concept receipt sample values were internally inconsistent, so production values are calculated from game rules.

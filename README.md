# Mala Mama

A responsive malatang bowl-building browser game built with React and Vite.

## Run

```sh
npm install
npm run dev
```

`npm test` checks the scoring rules. `npm run build` creates the static production build in `dist`.

## Play

Each customer has a random budget, a ±RM 1.50 acceptable range, distinct required ingredients, and a patience timer. Everything costs RM 3 per 100 g. Pick repeatable portions from the cold cabinet and remove portions from the bowl. Weights are intentionally hidden until serving. The timer starts on the first pick and pauses while instructions are open. It continues when the browser is in the background, using a wall-clock deadline.

Serving locks the bowl and reveals an itemized receipt, total weight and price, ideal weight, signed deviation, three score percentages, 0–3 stars, and a tip. Next guest resets the round; later customers have less patience and three required ingredients. Lifetime guests and tips are stored locally in this browser. No account or server is required for gameplay.

Weight accuracy = max(0, 100 − absolute weight error / target × 100). Speed = percentage of patience remaining. Order = percentage of required ingredients included. Overall score = 50% weight + 20% speed + 30% order. Three stars require ≥90 overall plus all requirements and an in-range price; two require ≥65; one requires ≥35. Expired or empty orders receive zero stars and no tip. Tips = price × (20%, 10%, or 5% for three, two, or one star) × overall score / 100, rounded to cents.

Artwork is in `public/art/ingredients.png`; concept and art-generation notes are in `design/`. Sound is synthesized locally with Web Audio and can be muted. Google Fonts has system fallbacks. Dialogs trap keyboard focus, ingredient controls are labeled, and reduced-motion preferences are respected.

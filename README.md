# Mala Mama 🍜

**A little spice. A lot of instinct.**

A cozy malatang browser game: build a customer's bowl from a chilled ingredient cabinet, estimate its weight, and serve before their patience runs out. Built with React and Vite, with illustrated food, customer portraits, and a receipt for every round.

[Hosted game](https://mala-mama.juinhong05.chatgpt.site) · [Repository](https://github.com/juinhong05/Malatang)

The hosted game currently has owner-only access. Anyone can clone this repository and play locally.

## Features

- Random customer budgets from RM 12 to RM 24, an acceptable range of ±RM 1.50, and required ingredients.
- Twelve ingredients across vegetables, protein, noodles, and extras, with category filters and repeatable portions.
- A bowl that fills as you select ingredients; remove individual portions or clear the bowl.
- Hidden portion weights until weigh-in, encouraging estimation and learning from receipts.
- A patience bar that starts with the first ingredient and pauses while instructions are open.
- Itemized receipts showing selected items, weight, price, budget, ideal weight, and signed weight difference.
- Separate weight, speed, and order percentages, up to three stars, customer tips, and a next-guest action.
- Increasing difficulty, responsive layouts, optional sound, keyboard-accessible controls, and reduced-motion support.
- Lifetime guests served and tips saved in the current browser using local storage.

## Quick start

Use Node.js 22.12+ or Node.js 24 LTS, with npm. Development was verified with Node.js 24.

```sh
git clone https://github.com/juinhong05/Malatang.git
cd Malatang
npm ci
npm run dev
```

Open the local URL printed by Vite. Gameplay runs entirely in the browser; no API keys, environment variables, database, or backend are needed.

## How to play

1. Read the customer's budget, acceptable price range, and must-have ingredients.
2. Tap ingredient trays to add portions. Your first pick starts the timer.
3. Tap an ingredient listed beneath your bowl to remove one portion, or use **Clear** to empty it.
4. Select **Weigh & serve** to reveal the bowl's weight and price. Everything costs **RM 3.00 per 100 g**.
5. Review your receipt and select **Next guest** to continue.

The timer continues while the browser is in the background. If patience expires, the round ends with zero stars and no tip. Later customers allow less time; from guest four onward, each order requires three ingredients.

## Scoring

The perfect weight is `budget ÷ 3 × 100` grams. For example, an RM 18 budget corresponds to 600 g.

| Metric | Calculation | Contribution |
| --- | --- | --- |
| Weight | `max(0, 100 − abs(actual − target) / target × 100)` | 50% |
| Speed | Percentage of patience remaining when served | 20% |
| Order | Percentage of must-have ingredients included | 30% |

Individual percentages and the combined score are rounded to whole numbers.

| Stars | Requirements | Tip rate |
| --- | --- | --- |
| ★★★ | At least 90 overall, every must-have, and price within range | 20% |
| ★★ | At least 65 overall | 10% |
| ★ | At least 35 overall | 5% |
| None | Below 35, an empty bowl, or expired patience | 0% |

Missing a required ingredient or being outside the acceptable range caps the result at two stars. Tips are `total price × tip rate × overall score / 100`, rounded to cents.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm test` | Run six game-rule tests with Node's test runner |
| `npm run build` | Produce the static site in `dist/` |
| `npm run preview` | Preview the production build locally |

Tests cover achievable orders, exact-weight scoring, required ingredients, budget boundaries, timeouts, empty bowls, and tip calculations. Browser checks during development covered desktop and mobile play, adding/removing ingredients, filtering, receipt rendering, timer pausing, expiry, and next-guest reset.

## Project structure

```text
src/
  main.jsx          React interface and round lifecycle
  game.js           Ingredients, customer orders, totals, and scoring
  game.test.js      Game-rule tests
  styles.css        Responsive styling and animation
public/art/
  ingredients.png   Transparent food, bowl, and portrait sprite atlas
design/
  concept.png       Original visual concept (not a gameplay screenshot)
  design-notes.md   Art direction and implementation notes
.openai/
  hosting.json      Existing Sites deployment configuration
```

To change ingredients, portion weights, budgets, or scoring, start with `src/game.js`.

## Deployment and assets

Run `npm run build` and deploy the contents of `dist/` to a static host. The current asset paths assume hosting at the domain root. Subdirectory hosting requires adjusting Vite's base and the artwork URL in `src/styles.css`.

Artwork was generated with OpenAI's image generation tool; prompts and design notes are in `design/`. Sound is synthesized locally with Web Audio. Typography uses Google Fonts with system fallbacks. No analytics or application backend is included.

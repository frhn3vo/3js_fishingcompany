# Changelog

Every change to the game gets a version number: vMAJOR.MINOR.PATCH.

- MAJOR = big change or rewrite
- MINOR = new feature
- PATCH = small fix

Newest version at the top.

## v0.2.1 (2026-11-04)

- Changed: parked ideas moved out of `PLAN.md` into a new `IDEAS.md`, so ideas live in one place.

## v0.2.0 (2026-11-04)

- New look: the whole screen overlay is now "The Fish Counter". Info cards look like fish-market price cards (bright yellow, orange, pink and ice white, black numbers, thick black borders). Styling lives in `css/style.css`; the rules are written in `DESIGN.md`.
- New: a black strip under the cards says what to do next (for example "Press F to cast your line"). The text changes with the game state.
- New: every button shows its key (F, E, Q), and the upgrade rows show 1 to 4. Unaffordable upgrades are hatched and say how much money is missing ("$160 short").
- New: a cast meter fills on the "Reel In" button until the next catch.
- New: the Hold card turns pink and says FULL when the hold is full. You cannot start fishing with a full hold.
- New: "Sell" only shows when you have fish, and shows what you will get ("Sell 74 fish · $148").
- New: SELL and CONTRACT arrows point to the sell dock and the contract platform when they are off screen or hidden behind the cards.
- New: a banner shows the new goal when a contract is accepted. The win screen shows fish caught and money earned.
- Game keys stop working while the win screen is open.
- The emoji icons are gone. All text uses one font family (Archivo).
- Note: the fish counter for the contract still counts fish that did not fit in a full hold. That is how the game already worked, so it was not changed.

## v0.1.2 (2026-11-03)

- Fixed: the action buttons jumped to the left when you pressed and held them. They now shrink a little in place.
- Added `PRODUCT.md` (who the game is for and what it does) and `DESIGN.md` (how it looked at that time).

## v0.1.1 (2026-11-03)

- Fixed: the level goals were test numbers (10, 20, 30), so the game could be won in a few catches. They are back to 500, 1500 and 3000 and now live in one list, `LEVEL_GOALS`, in `js/main.js`.
- Moved the zone time to `15 * 1000` so the 15 seconds is easy to read.

## v0.1.0 (2026-11-03)

First version with a number. What the game has at this point:

- A 3D sea you cross by boat with WASD or the arrow keys.
- Fishing zones that fade and move every 15 seconds. Press F inside one to fish.
- A sell dock: press E to sell fish for 2 money each.
- Four upgrades: bigger hold, faster line, boat engine and fish research (keys 1 to 4).
- Three contracts (500, 1500 and 3000 fish). Press Q on the yellow platform to complete one. The sky changes to sunset, then night.
- A win screen after the third contract.

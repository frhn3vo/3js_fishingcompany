# Plan

Current version: v0.2.0 (see `CHANGELOG.md`).

## The idea

Fishing Tycoon is a small game you play in the browser. You sail a boat, fish in zones that move, sell the fish, buy upgrades, and finish three contracts. It is for casual players on a desktop with a keyboard. More detail is in `PRODUCT.md`. How it looks is in `DESIGN.md`.

## The plan

- Done: the game loop, three contracts, the new price-card screen overlay (v0.2.0).
- Next, if you say yes: make the old code follow the coding style in `CLAUDE.md` (full names, no plain numbers). One file at a time, starting with `js/main.js`.

## Parked ideas

Ideas for later. Do not build these until you say so.

- Small tape tab on each card, and a slight tilt, so the cards feel like real paper.
- A "price tag slap-down" animation for the contract banner.
- Sound (not decided).
- Save progress between visits (not decided).
- Make the contract counter count only the fish that fit in the hold. Today it also counts fish lost when the hold is full.
- Touch and phone controls (not planned: the game is keyboard only).

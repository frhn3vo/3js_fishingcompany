# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Casual web players who open the game from a link for a short session on a desktop browser. They use a keyboard (WASD or arrows to move; F to fish, E to sell, Q to complete a contract). No install and no account.

## Product Purpose
"Fishing Tycoon" is a browser game built with Three.js. The player sails a boat to fishing zones, casts a line, sells the catch, and spends the money on upgrades. Each of three contracts sets a fish quota. Completing the third shows the win screen. Success is a player who finishes the three contracts and wants to play again.

## Positioning
An idle-style tycoon loop: fish in a zone, sell, upgrade, hit the quota. Fishing zones move and fade over time, so the player must keep repositioning the boat rather than wait in one place.

## Operating Context
- Runs as a static page: `index.html`, `css/style.css`, `js/main.js`. Three.js 0.160.0 is loaded from a CDN.
- HUD and shop are HTML overlays on top of the 3D canvas.
- Each contract changes the scene: level 2 is sunset, level 3 is night, and the house model upgrades.

## Capabilities and Constraints
- Desktop keyboard only. Touch and small screens are not planned.
- Game systems: inventory cap, fishing speed, boat engine and fish research upgrades (each with a max level), selling at a flat rate per fish, three contracts with goals of 500, 1500 and 3000 fish.
- Terms in use: contract (a level), quota, fishing zone, catch, upgrades.
- Undecided: audio, save/progress persistence, and any online features. None exist today.

## Brand Commitments
The title "Fishing Tycoon" is the only established name. No logo, voice guide or other brand assets exist.

## Evidence on Hand
No screenshots, playtest data or external content. The only material is the code in this repository. Do not invent player counts, reviews or metrics.

## Product Principles
- The loop stays readable at a glance: catch, sell, upgrade, quota.
- The next action is always obvious; the game never makes a casual player hunt for what to do.
- Keyboard play comes first, and every action has a key.
- Each contract should feel different from the last, in scene and in pace.
- The game runs from a single link with no setup.

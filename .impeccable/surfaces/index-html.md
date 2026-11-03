---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Fishing Tycoon HUD overlay (index.html)

Scope: whole HTML overlay on the 3D canvas: info cards, objective strip, action buttons, Upgrades panel, floating text, contract banner, win screen. Visitor mode: Operate, code-led. Desktop keyboard only, no build step, Three.js from CDN. Game rules, keys and numbers unchanged.

Audience and job: casual desktop player on a short session; reads contract, money, hold and zone at a glance and always knows the next action.

Required (from critique): objective strip that follows game state; key letters on action buttons; 1-4 badges on upgrade rows; edge arrows toward sell house and contract platform; text at least 4.5:1 on all three skies; hold-full state; Sell hidden at 0 fish with payout on the button; cast progress cue; contract-complete banner stating the new goal; one font on every control; game keys ignored while win screen is up; word "Contract" everywhere.

Defaults taken: win screen gets a short recap (fish caught, money earned); 3D sea and sky colours stay as they are.

Unresolved: none blocking.

## Direction contract

THESIS: Every number in the HUD is a fishmonger's price card, so the loop reads at a glance. It refuses the dark frosted-glass HUD with emoji icons and a coloured left edge.

OWN-WORLD: Day-glo card stock (fluorescent yellow, orange, pink) and ice white with black marker ink, 3px black borders on every card, one gutter and one baseline grid. Huge black numerals against tiny uppercase labels; hierarchy by scale alone. State by fill pattern (solid, hatched) as well as colour. Square-cornered cards, hard offset shadow on buttons, no blur, no gradient, no emoji.

STORY: A casual player understands within seconds that the numbers are prices and the strip tells them what to do: sail into a ring, fish, sell, upgrade, return for the contract. They believe the game is simple and friendly, and they keep playing through three contracts.

FIRST VIEWPORT: Top-left a stack of four 250px cards (Contract n with progress bar, Money, Hold with fill bar, Zone) with 44px numerals (48px overflows the 250px card on four-digit hold and contract values), a black objective strip below them. Pink means act now (hold full, Sell); the zone card turns solid black when in zone. Top-centre two square buttons with key letters, only the usable ones shown. Top-right a 340px ice-white Upgrades price list, each row with a key badge, effect line and a price card, hatched with "$ short" when unaffordable. Centre and bottom stay clear for the sea and boat.

FORM: fishmonger price cards on crushed ice, candidate 5 of my grounded list, raised by scale-only hierarchy, fill-pattern state and a strict hairline grid; seed: 8f1ee09697969935.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

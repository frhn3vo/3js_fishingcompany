---
name: Fishing Tycoon
description: A fishmonger's counter laid over a 3D sea: day-glo price cards, black marker ink, hatched fills for state.
colors:
  card-yellow: "#fff200"
  card-orange: "#ff7a1a"
  card-pink: "#ff4fa3"
  crushed-ice: "#e8f1f5"
  marker-ink: "#111111"
  paper-white: "#ffffff"
typography:
  numeral:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "56px"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Archivo, Segoe UI, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
  label:
    fontFamily: "Archivo, Segoe UI, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
spacing:
  gutter: "20px"
  stack-gap: "10px"
  button-gap: "12px"
components:
  price-card:
    backgroundColor: "{colors.card-yellow}"
    textColor: "{colors.marker-ink}"
    padding: "8px 12px 10px"
    width: "250px"
  price-card-money:
    backgroundColor: "{colors.card-orange}"
  price-card-hold-full:
    backgroundColor: "{colors.card-pink}"
  price-card-zone-in:
    backgroundColor: "{colors.marker-ink}"
    textColor: "{colors.card-yellow}"
  objective-strip:
    backgroundColor: "{colors.marker-ink}"
    textColor: "{colors.card-yellow}"
    typography: "{typography.body}"
    padding: "10px 12px"
  button-action:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.marker-ink}"
    typography: "{typography.title}"
    padding: "13px 20px"
  button-sell:
    backgroundColor: "{colors.card-pink}"
  button-fish-start:
    backgroundColor: "{colors.card-yellow}"
  button-fish-stop:
    backgroundColor: "{colors.card-orange}"
  upgrade-panel:
    backgroundColor: "{colors.crushed-ice}"
    width: "340px"
    padding: "12px"
  upgrade-price:
    backgroundColor: "{colors.card-yellow}"
    typography: "{typography.title}"
    padding: "5px 12px"
  upgrade-price-maxed:
    backgroundColor: "{colors.marker-ink}"
    textColor: "{colors.paper-white}"
  win-card:
    backgroundColor: "{colors.crushed-ice}"
    width: "520px"
    padding: "32px 36px"
---

# Design System: Fishing Tycoon

## Overview

**Creative North Star: "The Fish Counter"**

Every number in the HUD is a fishmonger's price card slapped on crushed ice: fluorescent card stock, black marker ink, a 3px black border on everything. Hierarchy comes from scale alone, huge numerals against tiny uppercase labels, so the loop (sail into a ring, fish, sell, upgrade, return for the contract) reads at a glance over the saturated 3D sea.

State is carried by fill as well as colour: solid means live, hatched means unavailable or empty. The system is flat and square-cornered, with hard offset shadows only on things you press. It rejects the dark frosted-glass HUD with emoji icons and a coloured left edge that came before it.

**Key Characteristics:**
- Three day-glo card colours plus ice and ink; nothing else.
- 3px ink border on every card, chip and button.
- Scale-only hierarchy: 44px numerals, 12px uppercase labels.
- Hatched 45-degree stripes mark state; they are the only gradients.
- No blur, no rounded corners, no emoji.

## Colors

Fluorescent card stock on crushed ice, outlined in marker ink.

### Primary
- **Card Yellow** (#fff200): the default price card, the usable-thing colour: contract card, Fish (start), affordable upgrade price, objective text and border, win-recap tile, fish floating tag.

### Secondary
- **Card Orange** (#ff7a1a): money. Money card, Fish (stop), money floating tag, second recap tile.
- **Card Pink** (#ff4fa3): act now. Hold card when full, Sell button, spend floating tag.

### Neutral
- **Crushed Ice** (#e8f1f5): resting surfaces: Hold card, Upgrades panel, win card, hatch stripe.
- **Marker Ink** (#111111): borders, hard shadows, text, bar fills, in-zone card, objective strip, maxed price.
- **Paper White** (#ffffff): default button face, key badges, hatch counterstripe, hint-bar text.

### Named Rules
**The Pink Means Act Now Rule.** Pink appears only when the player should act immediately (hold full, Sell, a spend). Never use it decoratively.

**The Fill Is State Rule.** Colour never carries state alone: pair it with solid versus hatched (zone out is hatched ice, zone in is solid ink; unaffordable price is hatched, affordable is yellow, capped is solid ink).

## Typography

**Display Font:** Archivo Black (with Arial Black, sans-serif), numerals, buttons, row names, banner, win headline
**Body Font:** Archivo (with Segoe UI, Arial, sans-serif), 500/700 weights, labels and effect lines

**Character:** A blunt poster face for prices against a plain grotesque for the small print. One of each, on every control.

### Hierarchy
- **Display** (Archivo Black, 56px, 1.05): win-screen headline only.
- **Numeral** (Archivo Black, 44px, 1.1, -0.02em): card values. Suffix `small` 22px. Zone value 30px. Win recap 36px. Banner 34px.
- **Title** (Archivo Black, 16-22px, 1.2): button text (16px, restart 20px), upgrade name (16px), upgrade price (22px), floating tags (20px).
- **Body** (Archivo 500, 13-20px, 1.3): effect lines (13px), hint bar (13px), win paragraph (20px); objective strip is 700 at 15px.
- **Label** (Archivo 700, 12px, 0.12em, uppercase): card labels, panel heading, recap terms.

### Named Rules
**The 44 Rule.** Card numerals are 44px, not larger: 48px overflows the 250px card on four-digit hold and contract values.

**The Scale Is The Hierarchy Rule.** Do not add weight, colour or decoration to rank text; change its size.

## Layout

A fixed HUD over a full-bleed canvas, one 20px gutter from the viewport edge. Top-left: a 250px grid stack with 10px gaps (contract, money, hold, zone cards, then the objective strip). Top-centre: the action buttons in a flex row with 12px gaps, only usable ones shown. Top-right: the 340px Upgrades panel. Bottom-left: a small ink hint bar. The centre and lower viewport stay clear for the sea and boat. Upgrade rows are a three-column grid (28px key badge, flexible body, price card) with 10px column gap and 10px row padding. Edge arrows and the banner (top 36%, centred) are transient overlays. The win card is 520px, capped at viewport width minus 40px. No breakpoints are defined; the layout is built for desktop keyboard play.

## Elevation & Depth

Flat. Cards sit on the sea with a border and no shadow; depth is the border and the fill. The only shadows are hard, blur-free ink offsets on pressable things and the two large overlays.

### Shadow Vocabulary
- **Button rest** (`box-shadow: 4px 4px 0 #111111`): action buttons, restart.
- **Button hover** (`5px 5px 0 #111111` with translate(-1px,-1px)): lifts 1px.
- **Button press** (`2px 2px 0 #111111` with translate(2px,2px)): sinks 2px.
- **Banner** (`6px 6px 0 #111111`): contract-complete banner.
- **Win card** (`8px 8px 0 #fff200`): yellow offset on the ice card, over a 90% ink scrim.

### Named Rules
**The Hard Shadow Rule.** Shadows are offset, zero-blur, and ink (or the yellow on the win card). They signal pressable or modal, never decoration.

## Shapes

Square. Border-radius is 0 everywhere. Every card, button, badge, bar and tag has a 3px ink border (key badges, kbd chips and the cast meter use 2px; upgrade rows divide with 2px rules). Progress bars are 12px tall hatched tracks with a solid ink fill. The only non-rectangular shape is the edge-arrow glyph, a clip-path chevron in ink.

## Components

### Price Cards
Yellow by default, orange for Money, ice for Hold, hatched ice for Zone. 8px 12px 10px padding, 12px uppercase label over a 44px numeral. Hold turns pink when full; Zone turns solid ink with yellow text when the boat is in. The contract label gains " · MET" when complete.

### Objective Strip
Ink background, yellow 15px bold text, 3px yellow border. Key letters inside are yellow kbd chips with ink text. It follows game state and always names the next action.

### Buttons
- **Shape:** square, 3px ink border, hard 4px ink offset shadow.
- **Face:** white by default; Fish yellow (start) or orange (stop), Sell pink, Contract yellow with a 0.9s pulse. Archivo Black 16px, padding 13px 20px, key letter in a kbd chip.
- **States:** hover lifts 1px; active sinks 2px; focus-visible is a 3px ink outline offset 3px.
- **Cast meter:** inside Fish, an 8px hatched track with an ink fill, inset 12px from the sides.

### Upgrade Rows (price list)
Key badge (white, 2px ink border), name in Archivo Black, effect line in Archivo, price card at right. Price is yellow when affordable (turns white on hover), hatched with a "$N short" line when not, solid ink with white "MAX" when capped. Rows are separated by 2px ink rules.

### Floating Price Tags
Bordered 20px Archivo Black tags that drift up 60px over 1s: fish yellow, money orange, spend pink. Reduced motion swaps the drift for a fade.

### Edge Arrows and Banner
Yellow bordered chip with an ink chevron and uppercase label pointing toward off-screen sell house and contract platform. The banner is a yellow card with a 6px hard shadow that scales in over 0.35s.

### Win Screen
Ice card with 8px yellow offset shadow on a 90% ink scrim, 56px headline, and a two-tile recap (yellow fish caught, orange money earned) with 36px values, then a yellow restart button.

## Do's and Don'ts

### Do:
- **Do** put every number on a bordered card (3px ink) with a small uppercase label above it.
- **Do** mark unavailable or empty states with the hatch pattern, and live states with a solid fill.
- **Do** use pink only for act-now moments, orange only for money, yellow as the default.
- **Do** keep numerals at 44px on 250px cards.
- **Do** keep all shadows hard, zero-blur offsets, and press feedback as a translate plus a smaller shadow.
- **Do** honour `prefers-reduced-motion`: no pulse, no banner scale, fade instead of drift.

### Don't:
- **Don't** use gradients other than the 45-degree hatch stripe, and no blur or backdrop-filter.
- **Don't** round corners.
- **Don't** use emoji or glyph icons.
- **Don't** rank text by colour or weight; change size.
- **Don't** convey state by colour alone.
- **Don't** reintroduce frosted glass, translucent panels or coloured left edges.

---
name: Fishing Tycoon
description: A bright, glossy arcade HUD of frosted glass panels and gradient pill buttons floating over a saturated 3D sea.
colors:
  water-blue: "#2196f3"
  water-blue-deep: "#1976d2"
  quota-gold: "#ffea00"
  quota-gold-deep: "#ffd600"
  sell-green: "#00e676"
  sell-green-deep: "#00c853"
  stop-red: "#f44336"
  stop-red-deep: "#d32f2f"
  max-red: "#ff5252"
  money-gold: "#ffd54f"
  catch-aqua: "#00ffcc"
  day-sky: "#87CEEB"
  sunset-sky: "#FF4500"
  night-sky: "#000033"
  glass-black: "rgba(0, 0, 0, 0.5)"
  panel-night: "rgba(20, 20, 30, 0.7)"
  slate-button: "#333333"
  slate-button-hover: "#444444"
  slate-button-disabled: "#222222"
  slate-border: "#555555"
  ink-on-green: "#003300"
  ink-on-gold: "#333333"
  white: "#ffffff"
typography:
  display:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "'Segoe UI', sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.4
  title:
    fontFamily: "'Segoe UI', sans-serif"
    fontSize: "18.7px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "25px"
spacing:
  xs: "8px"
  sm: "10px"
  md: "15px"
  lg: "20px"
components:
  button-fish-start:
    backgroundColor: "{colors.water-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-fish-stop:
    backgroundColor: "{colors.stop-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-sell:
    backgroundColor: "{colors.sell-green}"
    textColor: "{colors.ink-on-green}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-contract:
    backgroundColor: "{colors.quota-gold}"
    textColor: "{colors.ink-on-gold}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  hud-box:
    backgroundColor: "{colors.glass-black}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "10px 15px"
  upgrade-panel:
    backgroundColor: "{colors.panel-night}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "15px"
    width: "240px"
  button-upgrade:
    backgroundColor: "{colors.slate-button}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "10px"
  button-upgrade-hover:
    backgroundColor: "{colors.slate-button-hover}"
  button-upgrade-disabled:
    backgroundColor: "{colors.slate-button-disabled}"
  max-label:
    backgroundColor: "{colors.max-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  button-restart:
    backgroundColor: "{colors.water-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "15px 30px"
---

# Design System: Fishing Tycoon

## Overview

**Creative North Star: "The Sunny Toybox"**

Fishing Tycoon looks like a toy you want to pick up: a saturated tropical sea, a bright sky, and chunky, glossy controls that feel pressable. The 3D scene carries the color. The interface sits on top as dark frosted glass with a single bold accent edge, so numbers stay legible against any sky. Action buttons are the loud, candy-colored exception: gradient pills with a white outline.

The mood is bright, playful and arcade. Every state change should read as a reward or a warning at a glance: green for money, gold for quota, red for stop and max. The look changes with the contract. The sea stays a constant, while the sky moves from day blue to sunset orange to night navy.

**Key Characteristics:**
- Dark frosted-glass panels (blurred, semi-transparent) over a bright 3D scene
- Glossy two-stop gradient pill buttons with a white 2px outline
- One semantic color per action: blue fish, green sell, gold contract, red stop
- Emoji as icons, one per label
- A sky that changes per contract while the HUD stays fixed

## Colors

A saturated, Material-leaning palette: strong primaries for actions, neutral dark glass for information, and a sky color that changes with the contract.

### Primary
- **Harbor Blue** (#2196f3, deep #1976d2): The default HUD accent. Left edge of the info boxes, the "Upgrades" title, the start-fishing button gradient, and the restart button.

### Secondary
- **Quota Gold** (#ffea00, deep #ffd600): Everything about the contract. The contract box's edge, the "Complete Contract" button, the win headline and its glow.
- **Sell Green** (#00e676, deep #00c853): Selling and money-ready states. The sell button gradient, with dark green text (#003300) for contrast.

### Tertiary
- **Stop Red** (#f44336, deep #d32f2f): The stop-fishing state, shown by the same button as it flips from blue to red.
- **Max Badge Red** (#ff5252): The "MAX" label on a fully upgraded item.
- **Coin Gold** (#ffd54f): Money amounts, both in the upgrade panel and as floating text.
- **Catch Aqua** (#00ffcc): Floating text when fish are caught.

### Neutral
- **Day Sky** (#87CEEB): The page and 3D background for contract 1. Sunset (#FF4500) and night (#000033) take over for contracts 2 and 3.
- **Glass Black** (rgba(0, 0, 0, 0.5)): HUD info boxes.
- **Night Panel** (rgba(20, 20, 30, 0.7)): The upgrade panel.
- **Slate** (#333, hover #444, disabled #222, border #555): Upgrade buttons and panel dividers.
- **White** (#ffffff): All text on dark glass and the outline of action buttons.

### Named Rules
**The One Color, One Job Rule.** Each saturated color owns one meaning: blue is the default action, green is money, gold is the contract, red is stop or max. Never reuse one for decoration.

**The Sky Is the Variable Rule.** Only the sky, fog and sun change per contract. HUD colors stay identical so the player's learned meanings hold.

## Typography

**Display Font:** Segoe UI (with Tahoma, Geneva, Verdana, sans-serif)
**Body Font:** Segoe UI (same stack)

**Character:** One system sans throughout. Weight and size do the work, not font pairing. Big bold numbers and labels over a busy scene.

### Hierarchy
- **Display** (bold, 60px, 1.2): The win-screen headline only, in Quota Gold with a glow.
- **Headline** (regular, 24px): The win-screen subtitle.
- **Title** (bold, ~18.7px): The "Upgrades" panel title, in Harbor Blue.
- **Body** (regular, 15px): HUD info boxes. Money in the panel is bold at 1.2em.
- **Label** (regular, 13px): Upgrade button text. The key hint is 12px. The MAX badge is bold 10px.
- **Action** (bold, 16px): Action pill buttons. Floating catch/money text is weight 900 at 20px with a hard black drop shadow.

### Named Rules
**The Readable Over Anything Rule.** Text that sits on the scene itself (key hint, floating numbers) always carries a dark text shadow. Text on panels relies on the glass instead.

## Layout

A fixed overlay on a full-viewport canvas with no scrolling. Three anchored groups, each 20px from the edge: info boxes top-left, action buttons top-center, upgrade panel top-right (240px wide). Spacing steps are 8, 10, 15 and 20px. Info boxes stack with an 8px gap. Action buttons sit in a row with a 15px gap.

The overlay is desktop only and has no breakpoints. The HUD wrapper lets clicks pass through to the scene; the boxes themselves take them back.

## Elevation & Depth

Depth comes from blur plus a soft shadow, not from tonal layering. Panels and boxes use `backdrop-filter: blur(5px)` so the scene shows through. Shadows are small and ambient.

### Shadow Vocabulary
- **HUD box** (`box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)`): The info boxes.
- **Action button** (`box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2)`): Pill buttons, so they lift off the scene.
- **Upgrade panel** (`box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2)`): The largest, because the panel is the largest surface.
- **Win glow** (`text-shadow: 0 0 20px #ffea00`): The win headline only.

### Named Rules
**The Glass Over Solid Rule.** In-game surfaces are translucent and blurred. The only fully dark overlay is the win screen (rgba(0, 0, 0, 0.85)).

## Shapes

Rounded and friendly, with a clear size ladder: 4px for tiny badges, 8px for boxes and standard buttons, 12px for the big panel, 25px full pills for the main action buttons. Info boxes have a 4px colored left edge as their one signature accent. No sharp corners anywhere.

## Components

### Buttons
- **Shape:** Action buttons are full pills (25px radius) with a 2px white outline. Panel and win-screen buttons use 8px corners.
- **Primary (action pills):** A 135-degree two-stop gradient per meaning. Blue (#2196f3 to #1976d2) fishes, green (#00e676 to #00c853) sells, gold (#ffea00 to #ffd600) completes the contract, red (#f44336 to #d32f2f) stops fishing. Padding 12px 24px, bold 16px white text. The green and gold ones use dark ink (#003300, #333).
- **Hover / Focus:** Action pills have no hover style. Pressing scales to 0.95 over 0.1s. The "Reel In" state is the same button in red. Upgrade buttons lighten from #333 to #444 with a #777 border over 0.2s.
- **Disabled:** Upgrade buttons drop to #222 with #555 text and a not-allowed cursor.

### Cards / Containers
- **HUD info box:** Glass Black, 8px corners, padding 10px 15px, 4px Harbor Blue left edge (Quota Gold for the contract box), 15px white text.
- **Upgrade panel:** Night Panel, 12px corners, 1px #444 border, 15px padding.
- **Upgrade row:** A full-width left-aligned button with an emoji icon, a name, a small level/cost line, and an optional MAX badge pinned right.

### Signature Component
**Floating reward text.** Bold 20px numbers that rise 60px and fade over 1s while growing to 1.2x. Aqua for fish, gold for money. This is the game's main moment of feedback.

## Do's and Don'ts

### Do:
- **Do** keep one color for one job: blue for the default action, green for sell, gold for the contract, red for stop and max.
- **Do** put information on frosted glass (blur 5px, translucent dark) with white text.
- **Do** give every action button a 2px white outline and a 135-degree two-stop gradient.
- **Do** use an emoji as the icon and keep it at the start of the label.
- **Do** give text that sits directly on the scene a dark text shadow.

### Don't:
- **Don't** change HUD colors when the sky changes; only the sky, fog and sun change per contract.
- **Don't** add sharp corners. The smallest radius in the system is 4px.
- **Don't** use a solid opaque panel in-game. Only the win screen is near-opaque.
- **Don't** introduce a second typeface; weight and size carry the hierarchy.
- **Don't** use the gold or green accents for decoration; they signal contract and money.

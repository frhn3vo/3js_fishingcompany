# Game Dev Studio - Design

## Idea

A universal game dev studio in Claude Code.
Built once in ~/.claude/, used in every game project.
It has agents (the team) and skills (step-by-step guides).

## Folder layout

- ~/.claude/CLAUDE.md -- my rules
- ~/.claude/studio/ -- studio notes (design.md, changelog.md)
- ~/.claude/agents/ -- agents
- ~/.claude/skills/ -- skills

## Research rules

- Every fact must have a link.
- Facts with links go to: docs/research/GAME-NAME-research.md
- Facts without links go to: docs/made-up-facts/GAME-NAME-ideas.md
- Made-up files start with: "Not proven. Ideas only. Do not use as facts."
- Research papers are short (1 to 2 pages).

## Model choices

- game-researcher agent: sonnet
- simple skills (like update-changelog): haiku, if possible
- fable or opus: only for very hard problems

## Build order

1. CLAUDE.md (done)
2. design.md and changelog.md (done)
3. game-researcher agent (done)
4. research-game skill
5. next-step skill
6. write-gdd skill
7. update-changelog skill
8. Test everything on one real game

## Parked ideas

### Skills

- game-idea: brainstorm a game idea
- game-pitch: one-page game summary
- core-loop: design the main player loop
- scope-check: cut the game to a small first version (MVP)
- tech-choice: help pick an engine or framework
- prototype-plan: plan a small test of one mechanic
- playtest-plan: what to test and what to ask players
- plan-milestone: split work into small goals
- new-feature: explain, confirm, build and test one feature
- balance-economy: balance costs, upgrades and rewards
- code-review: check code against my rules
- bug-report: write bugs in a clear format
- release-checklist: checks before publishing
- postmortem: what went well and badly

### Agents

- game-designer
- programmer
- qa-tester

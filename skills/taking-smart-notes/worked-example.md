# Worked example — Federalist 10 into the slip-box

Reading Federalist 10 produces a per-source note at `notes/sources/federalist-10.md` with sections A–H. Atomic ideas extracted from that into the slip-box might include:

- `notes/zettel/extend-the-sphere-only-works-with-cross-cutting-cleavages.md` — Madison's extent argument depends on factional axes being orthogonal; when one cleavage dominates the whole space, extension intensifies rather than dilutes the faction. Civil War as the empirical case.
- `notes/zettel/faction-defined-by-injustice-not-size.md` — Madison's special definition: a faction is any group united by interest contrary to others' rights or to the common good. Lets a majority be the villain.
- `notes/zettel/structural-restraint-beats-virtue-restraint.md` — Don't trust majorities to restrain themselves; design the structure so an oppressive coalition is hard to coordinate. Generalizes beyond constitutional design.

The workflow for each:

```bash
# 1. Create the skeleton; --source=federalist-10 resolves to ../sources/federalist-10.md.
slipbox new extend-the-sphere-only-works-with-cross-cutting-cleavages \
  --source=federalist-10 \
  --title="Madison's extent argument requires cross-cutting cleavages..."

# 2. Fill in the body in your own words.

# 3. Link it bidirectionally to anything in the existing slip-box it connects to.
slipbox link extend-the-sphere-only-works-with-cross-cutting-cleavages faction-defined-by-injustice-not-size

# 4. Before reporting back, validate the whole slip-box.
slipbox check --strict
```

Each note is a separate file with its own frontmatter, body, and links. The `structural-restraint-beats-virtue-restraint` note hypothetically links to `notes/zettel/security-design-for-adversaries.md` because the design principle is the same one — added with `slipbox link` so both ends update atomically. The Federalist 10 per-source note links *down* to all three in its "Permanent notes extracted from this source" section; each zettel's `source:` field points *up* to the per-source note.

# Hero mark — directions

Three directions for the dominant animated mark on the homepage hero. Each
covers form, reference, draw-in animation, why it fits the brief (organic,
fluid, dominant, terracotta, with edge), and the proposed layout.

Terracotta on dark for all three. All three use an SVG path with
`stroke-dasharray` for the draw-in (per spec).

---

## Direction A — "The Sweep"

**Form.** A single calligraphic brushstroke that arcs across the hero —
uninterrupted, asymmetric, one continuous gesture. Starts high on the left,
dips through a low curve, rises again at the right. Reads as a brush
*lifted with intention* rather than dragged mechanically. Hand-drawn
imperfection baked into the path — no circular arcs, all custom curvature,
a slight tremor at the tail.

**Reference.** Franz Kline's brush paintings. Saul Bass's confident single
strokes. The apothecary mark. No literal meaning — pure gesture.

**Draw-in animation.** Single SVG `<path>` with `stroke-dasharray`.
`strokeDashoffset` animates from full path length to `0` over 1.5s on
`ease-out-soft`. The path's changing curvature makes the leading edge
*feel* like it accelerates and slows even though the animation is linear —
the eye reads the acceleration from the geometry. `stroke-linecap="round"`
softens the start/end. Breathing state: `scaleY` 1.0 ↔ 1.025 over 5s,
phase-offset sine, anchored at the mark's vertical midline.

**Why it fits.** The most Aesop-like reading — restraint doing the heavy
lifting. One gesture carries more composure than three. At 60–70% VH, a
single sweep *claims space* as a statement. The asymmetry gives it edge:
it isn't a logo, isn't decoration, it's a mark. Breathing on a single
organism feels coherent.

**Layout.** Mark dominates the upper two-thirds of the viewport, stroke
weight calibrated so it visually pins the frame. Text sits in the lower
third, aligned left, reading into the trailing end of the mark. Mark and
text are adjacent, not overlapping — the mark establishes presence; the
text arrives after the eye rests.

---

## Direction B — "The Convergence"

**Form.** Three brushstrokes, each with distinct curvature and weight,
converging toward (but not touching) a near-central point. One sweeps in
from upper-left, one curves in from the right, one rises from below. The
three are deliberately *not* identical — one feels a little hurried, one
more deliberate, one the quietest. Loosely strategy / taste / code in
feel, but you'd have to be told.

**Reference.** Constructivist composition (El Lissitzky, Rodchenko).
Japanese brush triptychs. Aesop's page dividers. Less abstract than A —
quietly literal.

**Draw-in animation.** Three SVG `<path>` elements, each with
`stroke-dasharray`. Overlapping (not synchronous) draws to avoid a
template feel:

- Stroke 1 draws 0.0 → 1.0s
- Stroke 2 draws 0.3 → 1.4s
- Stroke 3 draws 0.6 → 1.7s

Each stroke is distinct; the composition resolves as a whole. Breathing
state: the three strokes breathe in a slow ternary rhythm (1 → 2 → 3 with
phase offset), 6s period, ~2% scale. Reads as a coordinated system rather
than one organism.

**Why it fits.** It's the direct visualization of the positioning claim.
Three forces meeting is the idea. The risk — being too on-the-nose — is
mitigated by composition rather than labeling: you feel the triad before
you name it. All three in terracotta keeps them unified. Edge comes from
the *near-miss* at the convergence — tension, not resolution.

**Layout.** Strokes converge at mid-right; the composition opens toward
upper-left. Text sits in the upper-left opening, reading *toward* the
convergence. Mark and text form one composed diagonal.

---

## Direction C — "The Unclosed Ensō"

**Form.** A single imperfect hand-drawn circle — the Japanese *ensō* —
intentionally left unclosed. A gap of ~25° in the stroke. Slight variation
in path thickness implied by shape curvature. One continuous motion, one
arc. The most elemental of the three.

**Reference.** Zen ensō calligraphy, read here *without* spiritual
framing — a mark of *intent completed imperfectly*. Also a quiet rejection
of the polished tech-startup wordmark: an ensō says "a person made this,"
not "a brand deck rendered this."

**Draw-in animation.** Single SVG `<path>` with `stroke-dasharray`. 1.5s
draw on `ease-out-soft`. The final 10% of the draw is the pause at the
gap — giving the unclosed moment weight. Breathing state: scale 1.0 ↔ 1.02
over 4s centered at the circle's center. The mark quietly inhales and
exhales.

**Why it fits.** Circle is the oldest mark. An *opened* ensō brings edge —
it refuses to close. Strategic read: "never fully finished, always in
motion" — fits a founder/builder identity. Terracotta reads as ink on
paper, not as a decorative gradient.

**Layout.** Circle centered, large enough that its opening frames the
text. "Strategy, taste, and code." sits in the gap — the unclosed ensō
*points* at the text. The most composed of the three, the most
unconventional.

---

## My lean

**Direction A (the sweep)** if the site should feel quiet and confident —
restraint as posture. Most Aesop-like. Cheapest to get wrong because the
mark carries almost no conceptual weight; most costly to get right because
a single gesture has to be *right*.

**Direction B (convergence)** if the mark should work for the claim. Most
legible narrative. Risks feeling like "the infographic version" of the
tagline if the strokes aren't composed with genuine tension.

**Direction C (ensō)** if the mark should feel like identity rather than
illustration. Most distinctive silhouette. Highest chance of being
mistaken for zen / wellness / yoga branding — mitigated by terracotta on
dark (not ink on rice paper) and by the intentional opening reading as
*edge* rather than *balance*.

If forced to pick, I'd go A — single confident gesture, no conceptual
scaffolding to defend, breathes beautifully. B second if the narrative
read matters more than the mark's autonomy. C if you want the most
distinctive silhouette and trust the execution to reject the zen read.

Your call.

# Design System Specification: The Intelligence Layer

## 1. Overview & Creative North Star
**Creative North Star: "The Silent Sentinel"**

This design system is not a dashboard; it is a high-fidelity intelligence terminal. It moves away from the "cluttered spreadsheet" aesthetic of traditional finance and toward a cinematic, map-first experience. By utilizing "The Silent Sentinel" as our guide, we prioritize calm authority, deep tonal immersion, and an interface that feels like it’s breathing. 

The system breaks the "template" look by eschewing rigid boxes in favor of **Organic Asymmetry**. Elements are layered as if they are floating data points above a living world map. We use high-contrast typography scales—pairing the structural precision of *Inter* with the sophisticated, editorial curves of *Manrope*—to ensure every data point feels curated and intentional.

---

## 2. Colors: Depth and Luminance
Our palette is rooted in the abyss (`#101419`), using light not just as decoration, but as information.

### The Color Roles
*   **Primary (`#47eaed` / `#00ced1`):** The "Pulse." Reserved for intelligence markers, active trends, and critical CTAs.
*   **Surface Hierarchy:** We utilize the `surface-container` tiers to create a sense of physical distance. 
    *   `surface-container-lowest` (#0a0e13) is used for the "void" (background textures).
    *   `surface-container-highest` (#31353b) is used for active, foregrounded intelligence panels.
*   **Neutral Accents:** `secondary` (#b4cad3) provides a muted, metallic contrast to the vibrant teal, grounding the interface in professional finance.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts or subtle tonal transitions. A `surface-container-low` panel sitting on a `surface` background is sufficient to define a region. Lines create visual noise; tonal shifts create atmosphere.

### The "Glass & Gradient" Rule
To achieve a premium, custom feel, floating overlays must use **Glassmorphism**. Use `surface-container-high` at 60% opacity with a `24px` backdrop blur. 
*   **Signature Textures:** Main CTAs should not be flat. Apply a subtle linear gradient from `primary` (#47eaed) to `primary-container` (#00ced1) at a 135-degree angle to provide a "neon-gas" glow that feels three-dimensional.

---

## 3. Typography: Editorial Authority
We use a dual-font strategy to balance technical readability with premium editorial flair.

*   **Display & Headlines (Manrope):** Chosen for its modern, geometric construction. `display-lg` (3.5rem) should be used sparingly for high-impact market shifts or hero numbers. It conveys confidence and "big-picture" intelligence.
*   **Body & Labels (Inter):** The workhorse. `body-md` (0.875rem) handles the heavy lifting of financial data. Its neutral character ensures that high-density information remains legible even against dark, cinematic backgrounds.
*   **Hierarchy Note:** Use `title-lg` (Inter, 1.375rem) to introduce new data modules. The jump from `label-sm` to `headline-md` should be dramatic to guide the eye through the "story" of the data.

---

## 4. Elevation & Depth: Tonal Layering
In this system, depth is not simulated with heavy shadows; it is felt through light and stacking.

*   **The Layering Principle:** Stacking surface tiers creates a natural lift. Place a `surface-container-lowest` card on a `surface-container-low` section to create a "recessed" or "inset" feel.
*   **Ambient Shadows:** For floating modals, use an extra-diffused shadow. 
    *   *Spec:* `0px 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like a soft occlusion of the world map beneath it.
*   **The "Ghost Border" Fallback:** If a container sits on a background of the same tone, use a "Ghost Border": `outline-variant` (#3b4949) at **15% opacity**. This provides a whisper of an edge without breaking the cinematic immersion.
*   **Glow as Elevation:** The most important elements don't just sit higher; they glow. Use a `0px 0px 12px` outer glow with the `primary` color to signify "Active Intelligence."

---

## 5. Components: The Intelligence Modules

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), rounded-xl (1.5rem), with a subtle `primary` outer glow on hover.
*   **Tertiary:** No background, `on-surface` text, with a `surface-variant` background appearing only on hover.

### Intelligence Markers (Custom Component)
*   A circular teal dot (`primary`) with a nested `surface` core. 
*   **Animation:** A continuous "sonar pulse" using two concentric rings expanding and fading from 100% to 0% opacity over 3 seconds.

### Input Fields
*   **Style:** Minimalist. No bottom line. A `surface-container-low` background with `rounded-md` corners. 
*   **Focus State:** The "Ghost Border" becomes 100% opaque `primary`, accompanied by a subtle teal inner shadow.

### Cards & Lists
*   **The Divider Ban:** Never use horizontal rules. Separate list items using 12px of vertical white space or by alternating background tones between `surface-container-low` and `surface-container-lowest`.

### Data Tooltips
*   **Style:** High-gloss glassmorphism. `surface-container-highest` at 80% opacity, `backdrop-blur: 12px`. Text should be `on-surface` using `label-md`.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** prioritize the map. UI panels should feel like they are docked onto the edges of the screen, leaving the "World Intelligence" center stage.
*   **Do** use asymmetry. If a panel is on the left, let the right side breathe or contain a floating, non-aligned data point.
*   **Do** use teal (`primary`) sparingly. It is a laser, not a paint bucket.

### Don’t:
*   **Don’t** use pure white (#FFFFFF). Always use `on-surface` (#e0e2ea) to avoid "eye sear" in dark mode.
*   **Don’t** use standard "Material Design" shadows. They are too muddy for this cinematic aesthetic.
*   **Don’t** use sharp corners. Every container must follow the **Roundedness Scale** (default `0.5rem`, hero cards `1.5rem`) to maintain the "calm and confident" personality.
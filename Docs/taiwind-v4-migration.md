# Tailwind v4 CSS-First Directives: `@theme`, `@plugin`, `@source`

In Tailwind v4, you can configure Tailwind **directly in CSS** using these directives, without a `tailwind.config.js`. This approach is called **CSS-First Configuration**.

The three new at-rules are:

- **@theme** → define design tokens (colors, fonts, spacing, etc.)
- **@plugin** → add plugins directly in CSS
- **@source** → import Tailwind sources or other files

---

## 1. `@theme` — Customize design tokens

Define colors, fonts, spacing, radii, shadows, etc.

```css
@import "tailwindcss";

@theme {
  /* Custom colors */
  --color-brand: #0ea5e9; /* sky-500 */
  --color-accent: #f97316; /* orange-500 */

  /* Custom font families */
  --font-sans: "Inter", sans-serif;
  --font-display: "Poppins", sans-serif;

  /* Custom spacing */
  --spacing-72: 18rem;
  --spacing-84: 21rem;
  --spacing-96: 24rem;

  /* Custom radii */
  --radius-xl: 1.25rem;
}
```

Usage in HTML:

```html
<div class="bg-brand text-white p-84 rounded-xl font-display">Hello</div>
```

## 2. `@plugin` — Add custom utilities or components

Create Tailwind utilities or components directly in CSS.

```css
@plugin {
  .text-glow {
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
  }

  .card {
    @apply p-6 rounded-xl shadow-lg bg-white;
  }
}
```

Usage in HTML:

```html
<p class="text-glow text-lg">Glowing Text</p>

<div class="card">Card with @apply utilities</div>
```

## 3. `@source` — Import Tailwind sources or other files

Import Tailwind's base, components, and utilities or other CSS files.

```css
@source "./components/**/*.html";
@source "./widgets/**/*.js";
@source "./posts/**/*.md";
```

Tailwind will scan these files and generate CSS for the classes found.

## Combining All Directives

You can combine all three directives in a single CSS file:

```css
@import "tailwindcss";

/* Let Tailwind scan extra files */
@source "./pages/**/*.html";
@source "./scripts/**/*.js";

/* Extend design system */
@theme {
  --color-brand: #22c55e; /* green-500 */
  --color-brand-dark: #15803d;
  --font-display: "Poppins", sans-serif;
  --spacing-card: 3rem;
}

/* Custom utilities/components */
@plugin {
  .btn-brand {
    @apply px-6 py-3 rounded-lg font-semibold text-white;
    background: var(--color-brand);
  }

  .btn-brand:hover {
    background: var(--color-brand-dark);
  }

  .hero-title {
    @apply text-5xl font-display font-bold mb-4;
  }
}
```

Usage in HTML:

```html
<h1 class="hero-title">Welcome</h1>
<button class="btn-brand">Get Started</button>
```

# Svelte + Tailwind CSS Integration Guide

## Overview
This guide documents the integration of Tailwind CSS v4 with a standalone Svelte 5 project using Vite.

## Project Setup

### Initial Setup
```bash
npm create vite@latest pollkit -- --template svelte
cd pollkit
npm install
```

## Tailwind CSS v4 Integration

### Step 1: Install Dependencies
Tailwind CSS v4 uses a different approach than v3. Install the Vite plugin:

```bash
npm install -D @tailwindcss/vite tailwindcss
```

**Note:** Do NOT install `postcss` or `autoprefixer` - they're not needed with Tailwind v4 Vite plugin.

### Step 2: Configure Vite
Update `vite.config.js` to include the Tailwind CSS plugin:

```javascript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
})
```

### Step 3: Import Tailwind CSS
Update `src/app.css` with the new v4 import syntax:

```css
@import "tailwindcss";
```

**Note:** Tailwind v4 uses `@import "tailwindcss"` instead of the old `@tailwind` directives.

### Step 4: Import CSS in Main Entry
Ensure `src/main.js` imports the CSS file:

```javascript
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
```

### Step 5: Start Development Server
```bash
npm run dev
```

## Key Differences: Tailwind v3 vs v4

### Tailwind v3 (Old Way)
- Required: `tailwindcss`, `postcss`, `autoprefixer`
- Config files: `tailwind.config.js`, `postcss.config.js`
- CSS directives: `@tailwind base`, `@tailwind components`, `@tailwind utilities`
- PostCSS plugin: `tailwindcss` in `postcss.config.js`

### Tailwind v4 (New Way)
- Required: `@tailwindcss/vite`, `tailwindcss`
- Config: Plugin in `vite.config.js` only
- CSS import: `@import "tailwindcss"`
- No PostCSS config needed

## Usage in Svelte Components

### Basic Example
```svelte
<script>
  let count = 0;
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
      Hello Tailwind!
    </h1>
    <button 
      class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      onclick={() => count++}
    >
      Count: {count}
    </button>
  </div>
</div>
```

### Dark Mode Support
Tailwind v4 supports dark mode out of the box:

```svelte
<div class="bg-white dark:bg-gray-800">
  <p class="text-gray-900 dark:text-white">
    This text adapts to dark mode
  </p>
</div>
```

### Responsive Design
```svelte
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="p-4 bg-white rounded shadow">Card 1</div>
  <div class="p-4 bg-white rounded shadow">Card 2</div>
  <div class="p-4 bg-white rounded shadow">Card 3</div>
</div>
```

## Scoped Styles with Tailwind
You can still use Svelte's scoped styles alongside Tailwind:

```svelte
<div class="container mx-auto">
  <p class="custom-text">Styled text</p>
</div>

<style>
  .custom-text {
    @apply text-lg font-medium;
    /* Additional custom CSS */
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
</style>
```

## Common Issues and Solutions

### Issue: "@tailwind is unknown at rule"
**Solution:** You're using v3 syntax. Change to `@import "tailwindcss"` for v4.

### Issue: "PostCSS plugin error"
**Solution:** Remove `postcss.config.js` and use `@tailwindcss/vite` plugin instead.

### Issue: Styles not applying
**Solution:** 
1. Check that `app.css` is imported in `main.js`
2. Verify `@tailwindcss/vite` is in `vite.config.js` plugins array
3. Restart dev server

## Project Structure
```
pollkit/
├── src/
│   ├── app.css          # Tailwind import
│   ├── App.svelte       # Main component
│   ├── main.js          # Entry point
│   └── lib/             # Reusable components
├── vite.config.js       # Vite + Tailwind config
├── package.json
└── index.html
```

## Best Practices

1. **Component Organization**: Create reusable components in `src/lib/`
2. **Utility Classes**: Use Tailwind utilities for most styling
3. **Custom Styles**: Use `<style>` blocks only for unique styles
4. **Responsive First**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
5. **Dark Mode**: Include dark mode variants for better UX

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Svelte 5 Documentation](https://svelte.dev/docs)
- [Vite Documentation](https://vite.dev)
- [@tailwindcss/vite Plugin](https://github.com/tailwindlabs/tailwindcss-vite)

## Next Steps

- Set up custom Tailwind configuration (if needed)
- Create reusable UI components (Button, Card, Modal)
- Implement theme switching functionality
- Add custom color schemes
- Configure production build optimizations

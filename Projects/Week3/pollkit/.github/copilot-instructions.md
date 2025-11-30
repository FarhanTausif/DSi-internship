# Pollkit - Copilot Instructions

## Project Overview
Pollkit is a polling dashboard built with **Svelte 5** (using new runes API) and **Tailwind CSS v4** on Vite. This is a client-side only application with no backend - all state is managed in-memory using Svelte's reactive primitives.

## Tech Stack Specifics

### Svelte 5 Runes (Critical)
This project uses Svelte 5's **runes API**, not the legacy `let`/`$:` reactive syntax:
- Use `$state()` for reactive variables (not `let` for reactive state)
- Use `$derived()` for computed values (not `$:`)
- Use `$props()` for component props (not `export let`)
- Use `{@render children()}` in components (not `<slot>`)

**Example from `pollStore.svelte.js`:**
```javascript
let polls = $state([...]); // reactive state
let totalPolls = $derived(polls.length); // computed value
```

**Example from `Button.svelte`:**
```javascript
let { variant = "primary", children } = $props(); // component props
{@render children()} // render children content
```

### Tailwind CSS v4
- **Import:** Use `@import "tailwindcss"` in CSS files (not `@tailwind` directives)
- **Config:** Plugin configured in `vite.config.js`, no PostCSS or `tailwind.config.js` needed
- **Dark Mode:** Built-in support via `dark:` prefix (e.g., `dark:bg-gray-800`)
- See `Svelte+Tailwind integration guide.md` for full v3→v4 migration details

## Architecture Patterns

### State Management (Svelte Store Pattern)
The app uses **module-level state with exported getter functions** rather than traditional stores:

1. **pollStore.svelte.js** - Central poll state with `$state()` runes
   - Exports getter functions: `getPolls()`, `getTotalPolls()`, `getTotalVotes()`, `getAverageVotesPerPoll()`, `getStats()`
   - Exports actions: `addPoll()`, `vote()`, `deletePoll()`, `selectPoll()`
   - **Important**: Derived values (`$derived`) cannot be exported directly - always wrap in getter functions

2. **themeStore.svelte.js** - Theme management with localStorage persistence
   - `getTheme()` returns current theme
   - `toggleTheme()` switches and persists to localStorage
   - `initializeTheme()` applies theme class to `document.documentElement`

3. **context.js** - Svelte context API for dependency injection
   - `setPollContext(store)` - provide poll store to component tree
   - `getPollContext()` - consume poll store in child components
   - Uses Symbol key for type safety

### Component Structure
```
src/lib/components/
├── dashboard/  # Dashboard-specific components (empty, to be built)
├── layout/     # Layout components (empty, to be built)
├── poll/       # Poll-related components (empty, to be built)
└── ui/         # Reusable UI primitives
    ├── Button.svelte      # Variant-based button (primary/secondary/danger)
    ├── Card.svelte        # Container with optional title
    └── ThemeToggle.svelte # Theme switcher button
```

### UI Component Conventions
Components in `src/lib/components/ui/` follow a consistent pattern:
- Accept `class` prop as `class: className = ''` for style extension
- Use variant objects for styling (see `Button.svelte`)
- Support light/dark modes with `dark:` prefixes
- Use render tags for children: `{@render children()}`

**Button variants:**
```javascript
const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700...",
  danger: "bg-red-600 hover:bg-red-700 text-white"
};
```

## Development Workflow

### Commands
```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

### Key Files
- **`src/main.js`** - Entry point, imports `app.css` and mounts App
- **`src/app.css`** - Tailwind import point (`@import "tailwindcss"`)
- **`vite.config.js`** - Vite + Tailwind v4 plugin configuration
- **`svelte.config.js`** - Svelte preprocessing config (vitePreprocess)

## Project-Specific Patterns

### Poll Data Structure
```javascript
{
  id: Date.now(), // Unique ID generated from timestamp
  question: "...",
  options: [
    { id: 1, text: "Option 1", votes: 0 },
    // ...
  ],
  createdAt: new Date().toLocaleString(), // Formatted timestamp
  totalVotes: 0 // Denormalized for performance
}
```

### Theme Implementation
Theme is applied via:
1. Class toggle on `document.documentElement` (`dark` class)
2. Tailwind's `dark:` variant applies styles when class is present
3. State persisted to `localStorage` with key `"theme"`
4. Initialize theme in app entry point by calling `initializeTheme()`

### Adding New Features
1. **New UI component:** Add to `src/lib/components/ui/`, follow Button/Card pattern
2. **New poll feature:** Add action to `pollStore.svelte.js`, export function
3. **New page section:** Create in `dashboard/`, `layout/`, or `poll/` directories
4. **Styling:** Use Tailwind utilities first, scoped `<style>` only for unique needs

## Common Gotchas

1. **Don't mix Svelte 4 and 5 syntax** - This project uses runes exclusively
2. **Theme must be initialized** - Call `initializeTheme()` from themeStore on app mount
3. **Poll IDs are timestamps** - Not guaranteed unique for rapid operations; consider UUIDs for production
4. **No persistence** - All data lost on refresh; add localStorage/API integration as needed
5. **Empty component directories** - `dashboard/`, `layout/`, `poll/` are scaffolded but empty
6. **Cannot export derived directly** - Always wrap `$derived` in getter functions when exporting from modules

## References
- Svelte 5 Runes: See `svelte5-docs.txt` for detailed API documentation
- Tailwind v4 Integration: See `Svelte+Tailwind integration guide.md` for setup and migration guide

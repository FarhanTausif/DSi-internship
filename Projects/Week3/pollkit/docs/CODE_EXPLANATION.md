# Code Explanation - Pollkit

This document provides detailed explanations of each file in the Pollkit application, a polling app built with Svelte 5 and Tailwind CSS v4.

## Table of Contents

- [Project Structure](#project-structure)
- [Configuration Files](#configuration-files)
- [Entry Points](#entry-points)
- [Core Application](#core-application)
- [State Management](#state-management)
- [UI Components](#ui-components)
- [Layout Components](#layout-components)
- [Poll Components](#poll-components)
- [Dashboard Components](#dashboard-components)
- [Routes](#routes)

---

## Project Structure

```
pollkit/
├── src/
│   ├── main.js              # Application entry point
│   ├── app.css              # Global styles and Tailwind imports
│   ├── App.svelte           # Root component with routing
│   ├── lib/
│   │   ├── stores/          # State management
│   │   └── components/      # Reusable components
│   └── routes/              # Page components
├── public/                  # Static assets
└── docs/                    # Documentation
```

---

## Configuration Files

### `vite.config.js`

Vite configuration file that sets up the build tooling.

```javascript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
})
```

**Key Points:**
- Uses `@sveltejs/vite-plugin-svelte` for Svelte 5 support
- Uses `@tailwindcss/vite` plugin for Tailwind v4 integration
- No additional configuration needed for basic setup

### `svelte.config.js`

Svelte compiler configuration.

```javascript
export default {
  // Svelte options
}
```

**Purpose:**
- Configures Svelte compiler behavior
- Handles preprocessing and compilation options

### `package.json`

Project dependencies and scripts.

**Key Dependencies:**
- `svelte@^5.x` - Framework
- `@tailwindcss/vite@^4.x` - Styling
- `vite@^7.x` - Build tool

**Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## Entry Points

### `index.html`

The HTML entry point for the application.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pollkit - Create and Vote on Polls</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

**Key Points:**
- Single `<div id="app">` mount point
- Module script loads `main.js`
- Minimal HTML, all UI is Svelte-generated

### `src/main.js`

JavaScript entry point that mounts the Svelte app.

```javascript
import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
```

**Key Points:**
- Imports global CSS first (including Tailwind)
- Imports root `App.svelte` component
- Mounts app to `#app` element
- Exports app instance for HMR (Hot Module Replacement)

### `src/app.css`

Global styles and Tailwind configuration.

```css
@import "tailwindcss";

/* Enable class-based dark mode for Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));
```

**Key Points:**
- Uses Tailwind v4's new `@import` syntax
- Configures class-based dark mode with `@custom-variant`
- The `dark` variant activates when `.dark` class is present on any parent
- No custom CSS needed - Tailwind utilities handle all styling

---

## Core Application

### `src/App.svelte`

Root component that handles routing and theme initialization.

```svelte
<script>
    import { initializeTheme } from './lib/stores/themeStore.svelte.js';
    import Layout from './lib/components/layout/Layout.svelte';
    import Home from './routes/Home.svelte';
    import Dashboard from './routes/Dashboard.svelte';

    // Track current route based on URL hash
    let currentRoute = $state(window.location.hash.slice(1) || '/');

    function handleHashChange() {
        currentRoute = window.location.hash.slice(1) || '/';
    }

    // Initialize theme on mount using $effect
    $effect(() => {
        initializeTheme();
    });
</script>

<svelte:window onhashchange={handleHashChange} />

<Layout>
    {#if currentRoute === '/' || currentRoute === ''}
        <Home />
    {:else if currentRoute === '/dashboard'}
        <Dashboard />
    {:else}
        <!-- 404 Page -->
        ...
    {/if}
</Layout>
```

**Key Concepts:**

1. **Hash-based Routing:**
   - Uses `window.location.hash` for client-side routing
   - No external router library needed
   - Routes: `/` (Home), `/dashboard` (Dashboard)
   - Listens to `hashchange` events for navigation

2. **Svelte 5 Runes:**
   - `$state()` - Reactive route state
   - `$effect()` - Side effect for theme initialization
   - Runs once on component mount

3. **Layout Pattern:**
   - Wraps all routes in `<Layout>` for consistent header/footer
   - Uses render tags `{@render children()}` in Layout

4. **404 Handling:**
   - Shows custom 404 page for unknown routes
   - Includes link back to home

---

## State Management

### `src/lib/stores/pollStore.svelte.js`

Central state management for polls using Svelte 5 runes.

```javascript
let pollsData = $state([
    {
        id: '1',
        question: 'What is your favorite programming language?',
        options: [
            { id: '1a', text: 'JavaScript', votes: 45 },
            { id: '1b', text: 'Python', votes: 38 },
            { id: '1c', text: 'TypeScript', votes: 29 }
        ],
        totalVotes: 112,
        createdAt: Date.now()
    }
    // ... more sample polls
]);

// Export getter functions (cannot export $derived directly)
export function getPolls() {
    return pollsData;
}

let totalPolls = $derived(pollsData.length);
export function getTotalPolls() {
    return totalPolls;
}

let totalVotes = $derived(pollsData.reduce((sum, poll) => sum + poll.totalVotes, 0));
export function getTotalVotes() {
    return totalVotes;
}

let averageVotesPerPoll = $derived(
    pollsData.length > 0 ? Math.round(totalVotes / totalPolls) : 0
);
export function getAverageVotesPerPoll() {
    return averageVotesPerPoll;
}

export function addPoll(question, options) {
    const newPoll = {
        id: Date.now().toString(),
        question,
        options: options.map((text, index) => ({
            id: `${Date.now()}-${index}`,
            text,
            votes: 0
        })),
        totalVotes: 0,
        createdAt: Date.now()
    };
    pollsData.push(newPoll);
}

export function vote(pollId, optionId) {
    const poll = pollsData.find((p) => p.id === pollId);
    if (poll) {
        const option = poll.options.find((o) => o.id === optionId);
        if (option) {
            option.votes++;
            poll.totalVotes++;
        }
    }
}

export function deletePoll(pollId) {
    pollsData = pollsData.filter((p) => p.id !== pollId);
}
```

**Key Concepts:**

1. **Module-Level State:**
   - Uses `$state()` for reactive array of polls
   - Shared across all components that import this module
   - Named `pollsData` internally to avoid export conflicts

2. **Derived State:**
   - `$derived()` automatically recalculates when dependencies change
   - Cannot export derived values directly (Svelte 5 limitation)
   - Solution: Export getter functions that return derived values

3. **Getter Functions Pattern:**
   ```javascript
   let totalPolls = $derived(pollsData.length);
   export function getTotalPolls() {
       return totalPolls;
   }
   ```
   - Components call `getTotalPolls()` to get current value
   - Wrap in `$derived()` in components for reactivity
   - Example: `const total = $derived(getTotalPolls())`

4. **State Mutations:**
   - Direct mutations to `pollsData` trigger reactivity
   - `push()`, array reassignment, property updates all work
   - Deep reactivity via proxies

5. **Sample Data:**
   - Includes sample polls for demonstration
   - Would be replaced with API calls in production

### `src/lib/stores/themeStore.svelte.js`

Theme state management with localStorage persistence.

```javascript
let themeState = $state({ current: 'light' });

export function getTheme() {
    return themeState.current;
}

export function setTheme(theme) {
    themeState.current = theme;
    localStorage.setItem('theme', theme);

    // Update HTML element class
    if (theme === 'dark') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
}

export function toggleTheme() {
    setTheme(themeState.current === 'light' ? 'dark' : 'light');
}

export function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}
```

**Key Concepts:**

1. **Object-Wrapped State:**
   - Uses `{ current: 'light' }` instead of primitive `'light'`
   - Necessary for proper reactivity across module boundaries
   - Object mutations are tracked better than primitive reassignments

2. **DOM Manipulation:**
   - Adds/removes `dark` class on `<html>` element
   - Tailwind's `dark:` variants respond to this class
   - Uses explicit `add()`/`remove()` instead of `toggle()`

3. **localStorage Persistence:**
   - Saves theme preference to `localStorage`
   - Persists across page reloads
   - Falls back to `'light'` if no saved preference

4. **Initialization:**
   - `initializeTheme()` called in `App.svelte` via `$effect`
   - Restores saved theme on app load
   - Applies theme class to DOM immediately

### `src/lib/stores/context.js`

Placeholder for future Context API usage (currently unused).

```javascript
// Context API will be implemented here for global state
// that needs to be passed down the component tree
```

**Purpose:**
- Reserved for Svelte's Context API if needed
- Alternative to module-level stores for scoped state
- Currently not used in the application

---

## UI Components

### `src/lib/components/ui/Button.svelte`

Reusable button component with multiple variants and sizes.

```svelte
<script>
    let {
        variant = "primary",
        size = "md",
        disabled = false,
        onclick = undefined,
        type = undefined,
        class: className = '',
        children,
    } = $props();

    const variantClasses = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white",
        outline: "bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white",
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
</script>

<button
    class="rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed {variantClasses[variant]} {sizes[size]} {className}"
    {disabled}
    {onclick}
    {type}
>
    {@render children()}
</button>
```

**Key Concepts:**

1. **Props with `$props()`:**
   - Destructures props from `$props()` rune
   - Provides default values
   - `class: className` renames prop to avoid JS keyword

2. **Variant System:**
   - Object mapping variant names to Tailwind classes
   - Includes dark mode classes for each variant
   - Easy to extend with new variants

3. **Size System:**
   - Separate size variants for consistent spacing
   - `sm`, `md`, `lg` options

4. **Children Rendering:**
   - Uses `{@render children()}` for slot content
   - Svelte 5 render tag syntax

5. **Accessibility:**
   - Proper `disabled` state styling
   - Cursor changes for disabled buttons
   - Semantic `<button>` element

### `src/lib/components/ui/Card.svelte`

Reusable card component with variant support.

```svelte
<script>
    let {
        variant = 'default',
        class: className = '',
        children
    } = $props();

    const variants = {
        default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        elevated: 'bg-white dark:bg-gray-800 shadow-lg',
        outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600'
    };
</script>

<div class="rounded-lg p-6 {variants[variant]} {className}">
    {@render children()}
</div>
```

**Key Concepts:**

1. **Card Variants:**
   - `default`: Border with background
   - `elevated`: Shadow without border
   - `outlined`: Transparent with thick border

2. **Dark Mode:**
   - All variants have dark mode counterparts
   - Uses Tailwind's `dark:` prefix

3. **Flexible Styling:**
   - Accepts additional classes via `class` prop
   - Merges with variant classes

### `src/lib/components/ui/Modal.svelte`

Modal dialog with backdrop, transitions, and keyboard support.

```svelte
<script>
    import { fly, fade } from 'svelte/transition';
    import Button from './Button.svelte';

    let {
        isOpen = $bindable(false),
        title = '',
        children
    } = $props();

    function handleKeydown(event) {
        if (event.key === 'Escape' && isOpen) {
            isOpen = false;
        }
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            isOpen = false;
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
    <div
        class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
        onclick={handleBackdropClick}
    >
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            transition:fly={{ y: -20, duration: 300 }}
            role="dialog"
            aria-modal="true"
        >
            <!-- Modal content -->
        </div>
    </div>
{/if}
```

**Key Concepts:**

1. **`$bindable()` Rune:**
   - Two-way binding for `isOpen` prop
   - Parent can bind with `bind:isOpen={variable}`
   - Changes in modal update parent state

2. **Transitions:**
   - `fade` for backdrop (opacity animation)
   - `fly` for modal (slide + fade animation)
   - Automatic enter/exit animations

3. **Keyboard Support:**
   - ESC key closes modal
   - Uses `<svelte:window>` for global listener

4. **Click-Outside:**
   - Clicking backdrop closes modal
   - Checks `event.target === event.currentTarget`

5. **Accessibility:**
   - `role="dialog"` for screen readers
   - `aria-modal="true"` for modal context
   - Semantic header with close button

### `src/lib/components/ui/ThemeToggle.svelte`

Button to toggle between light and dark themes.

```svelte
<script>
    import { toggleTheme, getTheme } from '../../stores/themeStore.svelte.js';
    
    const currentTheme = $derived(getTheme());
</script>

<button
    onclick={toggleTheme}
    class="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
    aria-label="Toggle theme"
>
    {#if currentTheme === 'dark'}
        <span class="text-2xl" aria-hidden="true">🌙</span>
    {:else}
        <span class="text-2xl" aria-hidden="true">☀️</span>
    {/if}
</button>
```

**Key Concepts:**

1. **Derived Reactivity:**
   - `$derived(getTheme())` creates reactive value
   - Updates when theme changes
   - Re-runs getter function automatically

2. **Conditional Icon:**
   - Shows moon (🌙) in dark mode
   - Shows sun (☀️) in light mode
   - Visual feedback of current state

3. **Accessibility:**
   - `aria-label` for screen readers
   - `aria-hidden="true"` on decorative emoji
   - Keyboard accessible button

---

## Layout Components

### `src/lib/components/layout/Layout.svelte`

Main application layout with header, navigation, and footer.

```svelte
<script>
    import ThemeToggle from '../ui/ThemeToggle.svelte';

    let { children } = $props();
    
    let currentPath = $state(window.location.hash.slice(1) || '/');

    function handleHashChange() {
        currentPath = window.location.hash.slice(1) || '/';
    }

    function isActive(path) {
        return currentPath === path;
    }
</script>

<svelte:window onhashchange={handleHashChange} />

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 border-b sticky top-0 z-30">
        <!-- Logo and Navigation -->
    </header>
    
    <main class="container mx-auto px-4 py-8">
        {@render children()}
    </main>
    
    <footer class="py-6 text-center border-t">
        <!-- Footer content -->
    </footer>
</div>
```

**Key Concepts:**

1. **Sticky Header:**
   - `sticky top-0 z-30` keeps header visible on scroll
   - High z-index for layering

2. **Active Navigation:**
   - Tracks current route with `$state`
   - `isActive()` helper compares paths
   - Different styles for active link

3. **Responsive Navigation:**
   - Desktop: Horizontal nav in header
   - Mobile: Full-width nav below header
   - Uses Tailwind's responsive classes

4. **Container Pattern:**
   - `container mx-auto` centers content
   - Responsive padding with `px-4`
   - Max width handled by Tailwind

5. **Children Rendering:**
   - `{@render children()}` renders page content
   - Passed from parent `<Layout>` component

---

## Poll Components

### `src/lib/components/poll/PollOption.svelte`

Individual poll option with animated vote bar.

```svelte
<script>
    import { fly } from 'svelte/transition';

    let {
        option,
        isSelected = false,
        percentage = 0,
        totalVotes = 0,
        disabled = false,
        onclick = undefined
    } = $props();
</script>

<button class="w-full relative overflow-hidden ..." {onclick} {disabled}>
    <!-- Animated percentage bar -->
    {#if totalVotes > 0 && percentage > 0}
        <div
            class="absolute inset-0 bg-linear-to-r from-blue-100 to-blue-50"
            style="width: {percentage}%"
            transition:fly={{ x: -50, duration: 400 }}
        ></div>
    {/if}
    
    <!-- Option content -->
    <div class="relative p-4 flex justify-between">
        <span>{option.text}</span>
        <span>{option.votes} votes · {percentage}%</span>
    </div>
</button>
```

**Key Concepts:**

1. **Animated Bar:**
   - Positioned `absolute` behind content
   - Width set by inline style based on percentage
   - `fly` transition animates from left

2. **Tailwind v4 Gradient:**
   - `bg-linear-to-r` is Tailwind v4 syntax
   - Creates left-to-right gradient
   - Dark mode variant included

3. **Visual States:**
   - Selected: Blue border and background
   - Disabled: Gray colors, cursor not-allowed
   - Hover: Border color change (when enabled)

4. **Relative Positioning:**
   - Content uses `relative` to appear above bar
   - Bar uses `absolute` to fill background
   - `overflow-hidden` contains bar within borders

### `src/lib/components/poll/PollCard.svelte`

Complete poll card with voting functionality.

```svelte
<script>
    import { flip } from 'svelte/animate';
    import { vote } from '../../stores/pollStore.svelte.js';
    import PollOption from './PollOption.svelte';

    let { poll } = $props();
    
    let hasVoted = $state(false);
    let selectedOptionId = $state(null);

    function handleVote(optionId) {
        if (hasVoted) return;
        vote(poll.id, optionId);
        hasVoted = true;
        selectedOptionId = optionId;
    }

    const optionsWithPercentage = $derived(
        poll.options.map((option) => ({
            ...option,
            percentage: poll.totalVotes > 0 
                ? Math.round((option.votes / poll.totalVotes) * 100) 
                : 0
        }))
    );

    const displayOptions = $derived(
        hasVoted
            ? [...optionsWithPercentage].sort((a, b) => b.votes - a.votes)
            : optionsWithPercentage
    );
</script>

{#each displayOptions as option (option.id)}
    <div animate:flip={{ duration: 300 }}>
        <PollOption {option} ... onclick={() => handleVote(option.id)} />
    </div>
{/each}
```

**Key Concepts:**

1. **Component-Level State:**
   - `hasVoted` prevents multiple votes
   - `selectedOptionId` tracks user's choice
   - Separate from global poll store

2. **Percentage Calculation:**
   - `$derived` recalculates when votes change
   - Handles division by zero
   - Rounds to nearest integer

3. **Sorting After Vote:**
   - `displayOptions` sorts by votes after voting
   - Shows highest-voted options first
   - Original order before voting

4. **`animate:flip`:**
   - Animates reordering of options
   - Uses FLIP technique (First, Last, Invert, Play)
   - Smooth transitions when order changes
   - Requires unique `key` (option.id)

5. **Vote Locking:**
   - `disabled={hasVoted}` on options
   - Prevents changing vote
   - Shows completion message

---

## Dashboard Components

### `src/lib/components/dashboard/CreatePollForm.svelte`

Form for creating new polls with validation.

```svelte
<script>
    import { addPoll } from '../../stores/pollStore.svelte.js';
    
    let { onSuccess = () => {} } = $props();
    
    let question = $state('');
    let options = $state(['', '']);
    let error = $state('');

    function addOption() {
        if (options.length < 10) {
            options = [...options, ''];
        }
    }

    function removeOption(index) {
        if (options.length > 2) {
            options = options.filter((_, i) => i !== index);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        error = '';

        if (!question.trim()) {
            error = 'Please enter a poll question';
            return;
        }

        const validOptions = options.filter(opt => opt.trim());
        
        if (validOptions.length < 2) {
            error = 'Please provide at least 2 options';
            return;
        }

        const uniqueOptions = new Set(validOptions);
        if (uniqueOptions.size !== validOptions.length) {
            error = 'Please remove duplicate options';
            return;
        }

        addPoll(question.trim(), validOptions);
        
        question = '';
        options = ['', ''];
        onSuccess();
    }
</script>
```

**Key Concepts:**

1. **Form State:**
   - `question` and `options` are reactive
   - `error` displays validation messages
   - All use `$state()` rune

2. **Dynamic Options:**
   - Start with 2 empty options
   - Add up to 10 options total
   - Remove options (minimum 2 required)
   - Array spread creates new reference for reactivity

3. **Validation:**
   - Question required and non-empty
   - Minimum 2 valid options
   - No duplicate options allowed
   - Trims whitespace before checking

4. **Form Submission:**
   - `event.preventDefault()` prevents page reload
   - Validates all inputs
   - Calls `addPoll()` from store
   - Resets form on success
   - Calls `onSuccess()` callback to close modal

5. **Character Limits:**
   - Question: 200 characters
   - Options: 100 characters each
   - Shows character count

### `src/lib/components/dashboard/PollStats.svelte`

Statistics card for individual poll.

```svelte
<script>
    let { poll } = $props();

    const leadingOption = $derived(
        poll.options.reduce((max, option) => 
            option.votes > max.votes ? option : max, 
            poll.options[0]
        )
    );

    const averageVotes = $derived(
        poll.options.length > 0 
            ? (poll.totalVotes / poll.options.length).toFixed(1) 
            : '0.0'
    );

    const optionsWithPercentage = $derived(
        poll.options.map((option) => ({
            ...option,
            percentage: poll.totalVotes > 0 
                ? Math.round((option.votes / poll.totalVotes) * 100) 
                : 0
        }))
    );
</script>
```

**Key Concepts:**

1. **Leading Option:**
   - Uses `reduce()` to find highest votes
   - Falls back to first option
   - Recalculates when votes change

2. **Average Calculation:**
   - Divides total votes by option count
   - Fixed to 1 decimal place
   - Handles zero options

3. **Metrics Grid:**
   - Shows total votes, average, option count
   - Highlights leading option
   - Uses `tabular-nums` for aligned numbers

4. **Vote Distribution:**
   - Lists all options with vote counts
   - Shows percentages
   - Truncates long option text

---

## Routes

### `src/routes/Home.svelte`

Home page displaying all polls.

```svelte
<script>
    import { getPolls, getTotalVotes } from '../lib/stores/pollStore.svelte.js';
    import PollCard from '../lib/components/poll/PollCard.svelte';
    
    let isCreateModalOpen = $state(false);
    
    const polls = $derived(getPolls());
    const totalVotes = $derived(getTotalVotes());

    function handlePollCreated() {
        isCreateModalOpen = false;
    }
</script>

<div class="space-y-8">
    <div class="flex justify-between">
        <div>
            <h2>Active Polls</h2>
            <p>{polls.length} polls · {totalVotes} votes</p>
        </div>
        <Button onclick={() => isCreateModalOpen = true}>
            + Create Poll
        </Button>
    </div>

    {#if polls.length === 0}
        <!-- Empty state -->
    {:else}
        <div class="grid gap-6 md:grid-cols-2">
            {#each polls as poll (poll.id)}
                <PollCard {poll} />
            {/each}
        </div>
    {/if}
</div>

<Modal bind:isOpen={isCreateModalOpen}>
    <CreatePollForm onSuccess={handlePollCreated} />
</Modal>
```

**Key Concepts:**

1. **Reactive Data:**
   - `$derived()` wraps store getter functions
   - Updates when store state changes
   - No manual subscriptions needed

2. **Empty State:**
   - Shows when no polls exist
   - Includes CTA to create first poll
   - Friendly UI with emoji

3. **Grid Layout:**
   - Responsive: 1 col mobile, 2 cols desktop
   - `gap-6` for spacing
   - Equal height cards

4. **Modal Integration:**
   - `bind:isOpen` for two-way binding
   - Opens/closes modal state
   - Callback closes modal after creation

### `src/routes/Dashboard.svelte`

Dashboard page with aggregate statistics.

```svelte
<script>
    import { 
        getPolls, 
        getTotalPolls, 
        getTotalVotes, 
        getAverageVotesPerPoll 
    } from '../lib/stores/pollStore.svelte.js';
    
    const polls = $derived(getPolls());
    const totalPolls = $derived(getTotalPolls());
    const totalVotes = $derived(getTotalVotes());
    const averageVotesPerPoll = $derived(getAverageVotesPerPoll());
</script>

<div class="space-y-8">
    <!-- Summary Cards -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card class="text-center">
            <span>📊</span>
            <p>Total Polls</p>
            <p class="text-4xl font-bold">{totalPolls}</p>
        </Card>
        <!-- More cards -->
    </div>

    <!-- Individual Poll Stats -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each polls as poll (poll.id)}
            <PollStats {poll} />
        {/each}
    </div>
</div>
```

**Key Concepts:**

1. **Aggregate Statistics:**
   - Total polls count
   - Total votes across all polls
   - Average votes per poll
   - All reactive and auto-updating

2. **Summary Cards:**
   - Large numbers with emoji icons
   - Elevated card variant
   - Color-coded by metric type

3. **Poll Breakdown:**
   - Shows stats for each poll
   - Grid layout adapts to screen size
   - Uses `PollStats` component

4. **Empty State:**
   - Shows when no polls exist
   - Friendly message
   - Uses Card component

---

## Key Svelte 5 Patterns Used

### 1. Runes

- `$state()` - Reactive state
- `$derived()` - Computed values
- `$props()` - Component props
- `$effect()` - Side effects
- `$bindable()` - Two-way binding

### 2. Render Tags

- `{@render children()}` - Render slot content
- `{@render snippet()}` - Render snippets (not used in this app)

### 3. Event Handlers

- No more `on:` directive
- Use `onclick={handler}` directly
- `event.preventDefault()` in handler

### 4. Module-Level State

- State in `.svelte.js` files
- Shared across components
- Cannot export `$derived` directly
- Use getter functions instead

### 5. Transitions & Animations

- `transition:` directive still works
- `animate:flip` for list reordering
- Imported from `svelte/transition` and `svelte/animate`

---

## Tailwind v4 Patterns Used

### 1. Dark Mode

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Enables class-based dark mode with `.dark` on parent.

### 2. New Gradient Syntax

```html
<div class="bg-linear-to-r from-blue-100 to-blue-50"></div>
```

New `bg-linear-to-*` syntax replaces old `bg-gradient-to-*`.

### 3. Utility-First Approach

No custom CSS needed - everything is Tailwind utilities:
- `dark:bg-gray-800` - Dark mode background
- `hover:bg-blue-700` - Hover state
- `transition-colors` - Smooth transitions
- `rounded-lg` - Border radius
- `shadow-xl` - Box shadow

### 4. Responsive Design

- `md:grid-cols-2` - 2 columns on medium screens
- `lg:grid-cols-3` - 3 columns on large screens
- `sm:flex-row` - Row layout on small screens

---

## Design Patterns

### 1. Component Composition

Small, focused components that compose together:
- `Button` → used in `Modal`, forms, navigation
- `Card` → used in `PollCard`, `PollStats`, pages
- `Layout` → wraps all pages

### 2. Prop Drilling

Props passed explicitly through component hierarchy:
- Clear data flow
- Easy to trace
- Type-safe with JSDoc (if used)

### 3. Getter Functions for Derived State

Can't export `$derived` from modules:
```javascript
// ❌ Won't work
export let total = $derived(data.length);

// ✅ Use getter function
let total = $derived(data.length);
export function getTotal() { return total; }
```

### 4. Hash-Based Routing

Simple routing without external library:
- `#/` for home
- `#/dashboard` for dashboard
- Listen to `hashchange` events
- Update state, render different components

### 5. Modal State Management

- Parent component owns `isOpen` state
- Child modal uses `$bindable()` for two-way binding
- Callbacks for actions (e.g., `onSuccess`)

---

## Performance Considerations

1. **Reactive Granularity:**
   - Svelte 5 tracks at fine-grained level
   - Only re-renders what changed
   - Derived values cache results

2. **List Rendering:**
   - Always use unique `key` in `{#each}`
   - Enables efficient DOM updates
   - Required for `animate:` directive

3. **Transitions:**
   - CSS-based where possible
   - GPU-accelerated transforms
   - Cleanup on component destroy

4. **Store Pattern:**
   - Module-level stores avoid prop drilling
   - Single source of truth
   - Automatic cleanup when unused

---

## Future Enhancements

1. **Backend Integration:**
   - Replace sample data with API calls
   - User authentication
   - Persistent storage

2. **Context API:**
   - Use for deeply nested state
   - Alternative to module stores

3. **Advanced Features:**
   - Poll editing
   - Poll deletion with confirmation
   - Vote expiration
   - Multi-choice polls
   - Anonymous voting toggle

4. **Performance:**
   - Virtual scrolling for large lists
   - Lazy loading of routes
   - Image optimization

5. **Accessibility:**
   - Keyboard navigation
   - Screen reader improvements
   - Focus management
   - ARIA labels

---

This documentation covers the complete codebase. For specific implementation details, refer to the inline comments in each file.

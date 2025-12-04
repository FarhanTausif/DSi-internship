# Week 3: Pollkit - Project Learnings & Best Practices

## Project Overview

**Pollkit** is a modern polling application built with Svelte 5 and Tailwind CSS v4. It demonstrates client-side routing, state management, and reactive UI patterns using Svelte's new runes system.

**Tech Stack:**
- Svelte 5 (with Runes)
- Tailwind CSS v4
- Vite 7
- Hash-based Client-Side Routing

---

## Key Learning Objectives

### 1. Svelte 5 Runes System

#### What are Runes?
Runes are compiler-level directives in Svelte 5 that provide explicit control over reactivity. They replace the previous implicit reactivity model with a more predictable and powerful system.

#### Core Runes Used in Pollkit:

**`$state` - Reactive State**
```javascript
let hasVoted = $state(false);
let selectedOptionId = $state(null);
let question = $state("");
let options = $state(["", ""]);
```
- Creates reactive variables that trigger updates when changed
- No special setters needed - just assign like normal JavaScript
- Can hold any type: primitives, objects, arrays

**`$derived` - Computed Values**
```javascript
const optionsWithPercentage = $derived(
    poll.options.map((option) => ({
        ...option,
        percentage: poll.totalVotes > 0 
            ? Math.round((option.votes / poll.totalVotes) * 100) 
            : 0
    }))
);

let totalVotes = $derived(
    pollsData.reduce((sum, poll) => sum + poll.totalVotes, 0)
);
```
- Automatically recomputes when dependencies change
- Replaces the old `$:` reactive statements
- More explicit and easier to reason about

**`$effect` - Side Effects**
```javascript
$effect(() => {
    initializeTheme();
});
```
- Runs when component mounts and when dependencies change
- Replaces `onMount` for side effects
- Automatically tracks dependencies

---

### 2. State Management with .svelte.js Files

#### Why .svelte.js?
Using `.svelte.js` extension allows runes to work in module context, enabling shared reactive state across components.

#### Poll Store Implementation:
```javascript
// pollStore.svelte.js
let pollsData = $state([
    {
        id: 1,
        question: "What's your favorite framework?",
        options: [
            { id: 1, text: "Svelte", votes: 0 },
            { id: 2, text: "React", votes: 0 },
            // ...
        ],
        totalVotes: 0,
    }
]);

// Derived computed values
let totalVotes = $derived(
    pollsData.reduce((sum, poll) => sum + poll.totalVotes, 0)
);

// Export functions to access/modify state
export function getPolls() {
    return pollsData;
}

export function vote(pollId, optionId) {
    const poll = pollsData.find(p => p.id === pollId);
    if (poll) {
        const option = poll.options.find(o => o.id === optionId);
        if (option) {
            option.votes += 1;
            poll.totalVotes += 1;
        }
    }
}
```

**Key Insights:**
- ✅ Centralized state management without external libraries
- ✅ Reactive across all components that import the store
- ✅ Type-safe with proper JSDoc comments
- ✅ Simple function-based API

---

### 3. Client-Side Routing with Hash Navigation

#### Implementation Pattern:
```javascript
// App.svelte
let currentRoute = $state(window.location.hash.slice(1) || '/');

function handleHashChange() {
    currentRoute = window.location.hash.slice(1) || '/';
}
```

```svelte
<svelte:window onhashchange={handleHashChange} />

{#if currentRoute === '/'}
    <Home />
{:else if currentRoute === '/dashboard'}
    <Dashboard />
{:else}
    <NotFound />
{/if}
```

**Advantages:**
- ✅ No server configuration needed
- ✅ Works with static hosting (GitHub Pages, Vercel, etc.)
- ✅ Browser back/forward buttons work naturally
- ✅ Simple to implement without router library

**Navigation Links:**
```svelte
<a href="#/">Home</a>
<a href="#/dashboard">Dashboard</a>
```

---

### 4. Component Architecture

#### Component Organization:
```
src/lib/components/
├── dashboard/
│   ├── CreatePollForm.svelte
│   ├── PollList.svelte
│   └── PollStats.svelte
├── layout/
│   ├── Header.svelte
│   ├── Footer.svelte
│   └── Layout.svelte
├── poll/
│   ├── PollCard.svelte
│   └── PollOption.svelte
└── ui/
    ├── Button.svelte
    ├── Card.svelte
    ├── Modal.svelte
    └── ThemeToggle.svelte
```

**Best Practices:**
1. **Separation of Concerns**: Group by feature (dashboard, poll) and utility (ui, layout)
2. **Reusability**: UI components are generic and reusable
3. **Single Responsibility**: Each component has one clear purpose

#### Props with Svelte 5:
```svelte
<script>
    let { poll } = $props();  // Destructure props
    let { variant = 'default', class: className = '' } = $props(); // With defaults
</script>
```

---

### 5. Dark Mode Implementation

#### Theme Store Pattern:
```javascript
// themeStore.svelte.js
let themeState = $state({
    current: typeof window !== "undefined"
        ? localStorage.getItem("theme") || "light"
        : "light"
});

export function toggleTheme() {
    themeState.current = themeState.current === "light" ? "dark" : "light";
    
    // Persist to localStorage
    localStorage.setItem("theme", themeState.current);
    
    // Update DOM
    if (themeState.current === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}
```

**Key Considerations:**
- ✅ SSR-safe checks (`typeof window !== "undefined"`)
- ✅ Persists user preference in localStorage
- ✅ Updates immediately via DOM manipulation
- ✅ Works with Tailwind's dark mode

---

### 6. Tailwind CSS v4 Integration

#### New @theme Directive:
```css
/* app.css */
@import "tailwindcss";

@theme {
    --font-sans: "Inter", sans-serif;
    --color-primary: #3b82f6;
}
```

#### Configuration:
```javascript
// vite.config.js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [svelte(), tailwindcss()],
})
```

**Benefits:**
- ✅ No separate tailwind.config.js needed
- ✅ CSS-first configuration
- ✅ Better performance with Vite plugin
- ✅ Simpler setup process

---

### 7. Animations with Svelte

#### Flip Animation for Reordering:
```svelte
<script>
    import { flip } from 'svelte/animate';
</script>

{#each displayOptions as option (option.id)}
    <div animate:flip={{ duration: 300 }}>
        <PollOption {option} />
    </div>
{/each}
```

**When to Use:**
- Reordering lists (e.g., sorting poll results by votes)
- Smooth transitions when items change position
- Improves UX by showing where items move

---

## Best Practices Learned

### 1. State Management
- ✅ Use `.svelte.js` for shared state with runes
- ✅ Keep state as close to where it's needed as possible
- ✅ Use `$derived` for computed values instead of manual calculations
- ✅ Avoid prop drilling by using stores for global state

### 2. Component Design
- ✅ Create small, focused components
- ✅ Use props for configuration, stores for shared state
- ✅ Implement proper TypeScript/JSDoc for props
- ✅ Keep components pure when possible

### 3. Performance
- ✅ Use `$derived` sparingly - only for expensive computations
- ✅ Leverage Svelte's fine-grained reactivity
- ✅ Use key blocks in loops for proper DOM reconciliation
- ✅ Avoid unnecessary re-renders with proper state structure

### 4. Accessibility
- ✅ Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- ✅ Provide proper ARIA labels
- ✅ Ensure keyboard navigation works
- ✅ Test with screen readers

### 5. Code Organization
- ✅ Group related components in folders
- ✅ Separate business logic from presentation
- ✅ Use clear, descriptive naming
- ✅ Document complex logic with comments

---

## Common Patterns & Solutions

### Pattern 1: Modal Management
```svelte
<script>
    let isModalOpen = $state(false);
    
    function openModal() {
        isModalOpen = true;
    }
    
    function closeModal() {
        isModalOpen = false;
    }
</script>

<Button onclick={openModal}>Create Poll</Button>

{#if isModalOpen}
    <Modal onclose={closeModal}>
        <CreatePollForm onsubmit={closeModal} />
    </Modal>
{/if}
```

### Pattern 2: Form Handling
```svelte
<script>
    let formData = $state({
        question: "",
        options: ["", ""]
    });
    
    function handleSubmit(e) {
        e.preventDefault();
        // Validation
        if (!formData.question.trim()) {
            return;
        }
        // Submit logic
        createPoll(formData);
        // Reset
        formData = { question: "", options: ["", ""] };
    }
</script>
```

### Pattern 3: Conditional Rendering
```svelte
{#if hasVoted}
    <div class="success-message">Thank you for voting!</div>
{:else}
    <Button onclick={handleVote}>Vote</Button>
{/if}
```

---

## Challenges & Solutions

### Challenge 1: Preventing Multiple Votes
**Solution:** Track voting state per poll in component:
```javascript
let hasVoted = $state(false);
let selectedOptionId = $state(null);

function handleVote(optionId) {
    if (hasVoted) return; // Prevent multiple votes
    vote(poll.id, optionId);
    hasVoted = true;
    selectedOptionId = optionId;
}
```

### Challenge 2: Computing Percentages Reactively
**Solution:** Use `$derived` for automatic recalculation:
```javascript
const optionsWithPercentage = $derived(
    poll.options.map((option) => ({
        ...option,
        percentage: poll.totalVotes > 0 
            ? Math.round((option.votes / poll.totalVotes) * 100) 
            : 0
    }))
);
```

### Challenge 3: Theme Persistence
**Solution:** Combine localStorage with reactive state:
```javascript
let themeState = $state({
    current: localStorage.getItem("theme") || "light"
});

// Update both localStorage and DOM
function toggleTheme() {
    themeState.current = themeState.current === "light" ? "dark" : "light";
    localStorage.setItem("theme", themeState.current);
    document.documentElement.classList.toggle('dark');
}
```

---

## Testing Insights

### What to Test:
1. **State Management:**
   - Poll creation adds new poll
   - Voting increments correct option
   - Total votes calculate correctly

2. **UI Interactions:**
   - Modal opens/closes
   - Theme toggles
   - Navigation works

3. **Edge Cases:**
   - Empty form submission
   - Multiple rapid votes
   - Invalid route handling

---

## Deployment Considerations

### Static Site Deployment:
- ✅ Hash routing works on any static host
- ✅ No server-side configuration needed
- ✅ Build with `npm run build`
- ✅ Deploy `dist/` folder

### Recommended Platforms:
- Vercel (easiest)
- Netlify
- GitHub Pages
- Cloudflare Pages

---

## Key Takeaways

1. **Svelte 5 Runes** provide explicit, powerful reactivity control
2. **`.svelte.js` files** enable shared reactive state without external libraries
3. **Hash-based routing** is simple and works everywhere
4. **Component architecture** should prioritize reusability and single responsibility
5. **Tailwind v4** simplifies configuration with CSS-first approach
6. **Dark mode** requires careful handling of localStorage and SSR
7. **Animations** enhance UX when used appropriately

---

## Further Learning

- [ ] Explore SvelteKit for SSR and file-based routing
- [ ] Implement real backend with API integration
- [ ] Add user authentication and poll persistence
- [ ] Implement advanced features (poll expiration, results sharing)
- [ ] Add unit tests with Vitest
- [ ] Optimize for production (code splitting, lazy loading)

---

## Resources

- [Svelte 5 Documentation](https://svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

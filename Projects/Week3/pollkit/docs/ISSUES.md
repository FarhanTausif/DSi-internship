# Issues and Fixes - Pollkit Development

This document chronicles all the issues encountered during the development of Pollkit and their solutions.

## Table of Contents

1. [Svelte 5 Compilation Errors](#svelte-5-compilation-errors)
2. [State Management Issues](#state-management-issues)
3. [Theme Toggle Problems](#theme-toggle-problems)
4. [Tailwind v4 Integration Issues](#tailwind-v4-integration-issues)
5. [Event Handler Syntax Changes](#event-handler-syntax-changes)
6. [Component Prop Issues](#component-prop-issues)

---

## Svelte 5 Compilation Errors

### Issue #1: Cannot Export Derived State from Module

**Error Message:**
```
Cannot export derived state from module. Use a function instead.
```

**Location:** `src/lib/stores/pollStore.svelte.js`

**Problem:**
Attempted to directly export `$derived` values from a `.svelte.js` module:

```javascript
// ❌ This doesn't work in Svelte 5
export let totalPolls = $derived(polls.length);
export let totalVotes = $derived(polls.reduce((sum, poll) => sum + poll.totalVotes, 0));
```

**Root Cause:**
- Svelte 5 compiler doesn't allow exporting reactive state directly from modules
- When other modules import these values, they're not in a reactive context
- The compiler can't transform `$.get()` calls in external files

**Solution:**
Export getter functions instead:

```javascript
// ✅ Works correctly
let totalPolls = $derived(polls.length);
export function getTotalPolls() {
    return totalPolls;
}

let totalVotes = $derived(polls.reduce((sum, poll) => sum + poll.totalVotes, 0));
export function getTotalVotes() {
    return totalVotes;
}
```

**Usage in Components:**
```javascript
// Import getter functions
import { getTotalPolls, getTotalVotes } from '../stores/pollStore.svelte.js';

// Wrap in $derived for reactivity
const totalPolls = $derived(getTotalPolls());
const totalVotes = $derived(getTotalVotes());
```

**Key Learnings:**
- Module exports must be functions, not reactive values
- Components calling these functions wrap them in `$derived()` for reactivity
- This pattern maintains reactivity while respecting module boundaries

**Files Modified:**
- `src/lib/stores/pollStore.svelte.js` - Changed all derived exports to getter functions
- `src/routes/Home.svelte` - Updated to use getter functions
- `src/routes/Dashboard.svelte` - Updated to use getter functions

---

### Issue #2: Variable Naming Conflict with Export

**Error Message:**
```
Cannot have export name 'polls' conflict with reactive variable
```

**Location:** `src/lib/stores/pollStore.svelte.js`

**Problem:**
Internal reactive variable named `polls` conflicted with exported function `getPolls()`:

```javascript
// ❌ Naming conflict
let polls = $state([...]);
export function getPolls() {
    return polls;  // Compiler confusion
}
```

**Root Cause:**
- Compiler tracks both the variable name and export names
- Similar names cause ambiguity in reactive tracking
- Even though they're different (variable vs function), the compiler flagged it

**Solution:**
Renamed internal variable to be more specific:

```javascript
// ✅ Clear distinction
let pollsData = $state([...]);
export function getPolls() {
    return pollsData;
}
```

**Key Learnings:**
- Use descriptive internal variable names
- Avoid names that closely match export names
- Prefix internal state variables (e.g., `_polls`, `pollsData`)

**Files Modified:**
- `src/lib/stores/pollStore.svelte.js` - Renamed `polls` to `pollsData`

---

## State Management Issues

### Issue #3: Theme State Not Reactive Across Components

**Symptoms:**
- Theme toggle button clicked
- Console logs showed theme changing
- UI didn't update to dark/light mode
- `getTheme()` returned correct value but components didn't re-render

**Location:** `src/lib/stores/themeStore.svelte.js`

**Problem (Attempt 1 - Primitive State):**
```javascript
// ❌ Doesn't trigger reactivity properly
let theme = $state('light');

export function getTheme() {
    return theme;
}

export function setTheme(newTheme) {
    theme = newTheme;  // Primitive reassignment
}
```

**Root Cause:**
- Primitive values (`string`, `number`, `boolean`) reassignments don't propagate well through getter functions
- When components call `$derived(getTheme())`, they don't detect the primitive change
- Svelte 5's reactivity system tracks object mutations better than primitive reassignments across module boundaries

**Failed Attempts:**

**Attempt 1:** Changed initialization timing
```javascript
// ❌ Didn't fix the issue
// Changed from onMount() to $effect()
$effect(() => {
    initializeTheme();
});
```
**Result:** Theme initialized but toggle still didn't work

**Attempt 2:** Enhanced accessibility
```javascript
// ❌ Didn't fix core reactivity issue
// Added better ARIA labels
<button aria-label="Toggle theme" ...>
```
**Result:** Better accessibility but theme still didn't switch

**Attempt 3:** Changed DOM manipulation
```javascript
// ❌ Didn't address the root cause
// Used classList.add/remove instead of toggle
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');
```
**Result:** DOM classes changed but components didn't re-render

**Final Solution (Object-Wrapped State):**
```javascript
// ✅ Object mutations are properly tracked
let themeState = $state({ current: 'light' });

export function getTheme() {
    return themeState.current;
}

export function setTheme(theme) {
    themeState.current = theme;  // Object property mutation
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
}
```

**Why This Works:**
1. **Object Mutations Are Tracked:** Svelte 5's reactivity system uses Proxies that intercept property access and mutations
2. **Getter Function Changes:** When `themeState.current` changes, the return value of `getTheme()` changes
3. **Derived Updates:** Components using `$derived(getTheme())` detect the change and re-render
4. **Reactivity Chain:** Object wrapper → Property change → Getter returns different value → `$derived` recalculates → Component updates

**Key Learnings:**
- Always wrap module-level state in objects for cross-module reactivity
- Primitive state works within single components but not across module boundaries
- Object-wrapped state pattern is best practice for shared reactive values
- Test reactivity across component boundaries, not just within one component

**Documentation Reference:**
From `svelte5-docs.txt` - "Passing state across modules" section:
> "If you use destructuring with a $derived declaration, the resulting variables will all be reactive"

The docs imply object structures maintain reactivity better.

**Files Modified:**
- `src/lib/stores/themeStore.svelte.js` - Wrapped theme in object
- All components already used `$derived(getTheme())` pattern, so no changes needed

---

## Theme Toggle Problems

### Issue #4: Theme Not Persisting on Reload

**Symptoms:**
- Theme changes worked during session
- Page reload always showed light theme
- localStorage had correct value but wasn't applied

**Location:** `src/App.svelte`, `src/lib/stores/themeStore.svelte.js`

**Problem:**
Theme initialization happened too late in component lifecycle:

```javascript
// ❌ Theme applied after initial render
onMount(() => {
    initializeTheme();
});
```

**Root Cause:**
- `onMount()` runs after component mounts to DOM
- Initial render already happened with default (light) theme
- Caused brief flash of wrong theme

**Solution:**
Use `$effect()` which runs immediately:

```javascript
// ✅ Runs during component initialization
$effect(() => {
    initializeTheme();
});
```

**Why This Works:**
- `$effect()` runs synchronously during component creation
- Theme applied before first render
- No flash of unstyled content (FOUC)

**Additional Improvement:**
Could also initialize in `themeStore.svelte.js` module scope:

```javascript
// Alternative: Initialize at module load
let themeState = $state({ 
    current: localStorage.getItem('theme') || 'light' 
});

// Apply immediately
if (themeState.current === 'dark') {
    document.documentElement.classList.add('dark');
}
```

**Key Learnings:**
- Use `$effect()` for initialization that must happen before render
- `onMount()` is for DOM-dependent code
- Consider module-level initialization for immediate needs

**Files Modified:**
- `src/App.svelte` - Changed `onMount` to `$effect`

---

## Tailwind v4 Integration Issues

### Issue #5: Dark Mode Not Working

**Symptoms:**
- Dark mode classes present in HTML
- Components had `dark:bg-gray-800` etc. in their classes
- No visual change when `.dark` class added to `<html>`
- Tailwind utilities worked but dark variants didn't

**Location:** `src/app.css`

**Problem:**
Missing Tailwind v4 dark mode configuration:

```css
/* ❌ Only had base import */
@import "tailwindcss";
```

**Root Cause:**
- Tailwind v4 defaults to `prefers-color-scheme` (system preference)
- Doesn't respond to class-based dark mode by default
- Need to explicitly configure class-based dark mode

**Solution:**
Add `@custom-variant` directive:

```css
/* ✅ Enable class-based dark mode */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

**How It Works:**
- `@custom-variant dark` - Defines custom `dark:` variant
- `(&:where(.dark, .dark *))` - Selector that matches:
  - Elements with `.dark` class
  - Elements inside `.dark` parent
- `:where()` keeps specificity low
- Now `dark:bg-gray-800` applies when `.dark` is present

**Alternative Approaches:**

**Option 1: Data Attribute**
```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

**Option 2: System Preference (default)**
```css
/* No custom variant needed */
/* Uses media query: @media (prefers-color-scheme: dark) */
```

**Key Learnings:**
- Tailwind v4 changed dark mode configuration
- No more `darkMode: 'class'` in config file
- Use `@custom-variant` in CSS instead
- Different from Tailwind v3 approach

**Documentation Reference:**
Tailwind v4 docs show this pattern for class-based dark mode.

**Files Modified:**
- `src/app.css` - Added `@custom-variant` directive

---

### Issue #6: Gradient Syntax Not Working

**Error Message:**
```
Unknown utility: bg-gradient-to-r
```

**Location:** `src/lib/components/poll/PollOption.svelte`

**Problem:**
Used old Tailwind v3 gradient syntax:

```html
<!-- ❌ Tailwind v3 syntax -->
<div class="bg-gradient-to-r from-blue-100 to-blue-50"></div>
```

**Root Cause:**
- Tailwind v4 changed gradient utilities
- Old: `bg-gradient-to-{direction}`
- New: `bg-linear-to-{direction}`

**Solution:**
Update to Tailwind v4 syntax:

```html
<!-- ✅ Tailwind v4 syntax -->
<div class="bg-linear-to-r from-blue-100 to-blue-50"></div>
```

**Other Tailwind v4 Changes Applied:**

1. **Flexbox Utilities:**
   - Old: `flex-shrink-0` → New: `shrink-0`
   - Old: `flex-grow` → New: `grow`

2. **Width Utilities:**
   - Old: `w-12` → New: `min-w-12` (for minimum widths)

**Key Learnings:**
- Check Tailwind v4 migration guide for breaking changes
- Gradient syntax completely changed
- Some flexbox utilities renamed
- Update docs recommended when upgrading major versions

**Files Modified:**
- `src/lib/components/poll/PollOption.svelte` - Updated gradient syntax
- Multiple components - Updated flexbox utilities

---

## Event Handler Syntax Changes

### Issue #7: Event Modifier Syntax Error

**Error Message:**
```
Event modifiers are not supported in Svelte 5. Use regular JavaScript instead.
```

**Location:** `src/lib/components/dashboard/CreatePollForm.svelte`

**Problem:**
Used Svelte 4 event modifier syntax:

```svelte
<!-- ❌ Svelte 4 syntax -->
<form onsubmit|preventDefault={handleSubmit}>
```

**Root Cause:**
- Svelte 5 removed `|modifiers` syntax
- Encourages explicit JavaScript
- More clear what's happening

**Solution:**
Handle in the function:

```svelte
<!-- ✅ Svelte 5 syntax -->
<form onsubmit={handleSubmit}>

<script>
function handleSubmit(event) {
    event.preventDefault();
    // ... rest of logic
}
</script>
```

**Other Removed Modifiers:**
- `|preventDefault` → `event.preventDefault()`
- `|stopPropagation` → `event.stopPropagation()`
- `|once` → Manual flag or `{ once: true }` in addEventListener
- `|capture` → Manual addEventListener with capture
- `|passive` → Manual addEventListener with passive

**Key Learnings:**
- Svelte 5 removes "magic" in favor of explicitness
- Standard JavaScript patterns preferred
- Better for developers familiar with vanilla JS
- Easier to debug and understand

**Files Modified:**
- `src/lib/components/dashboard/CreatePollForm.svelte` - Removed `|preventDefault`

---

### Issue #8: Event Handler Directive Syntax

**Error Message:**
```
The 'on:' directive has been removed. Use onclick={...} instead.
```

**Location:** Multiple components

**Problem:**
Used Svelte 4 directive syntax:

```svelte
<!-- ❌ Svelte 4 syntax -->
<button on:click={handleClick}>
```

**Root Cause:**
- Svelte 5 removed `on:` directive
- Uses standard DOM properties instead
- Aligns with web standards

**Solution:**
Use lowercase properties:

```svelte
<!-- ✅ Svelte 5 syntax -->
<button onclick={handleClick}>
```

**Event Property Mapping:**
- `on:click` → `onclick`
- `on:input` → `oninput`
- `on:change` → `onchange`
- `on:submit` → `onsubmit`
- `on:keydown` → `onkeydown`

**Custom Events Still Work:**
```svelte
<!-- Custom events use props -->
<Component oncustom={handler} />

<!-- Child dispatches -->
<script>
let { oncustom } = $props();
// Call oncustom() to dispatch
</script>
```

**Key Learnings:**
- Svelte 5 aligns with web standards
- No special directive syntax for events
- Lowercase property names match DOM
- Custom events are just props

**Files Modified:**
- All components - Changed `on:click` to `onclick`, etc.

---

## Component Prop Issues

### Issue #9: Missing Button Props

**Error Message:**
```
Property 'type' does not exist on component Button
Property 'class' does not exist on component Button
```

**Location:** `src/lib/components/ui/Button.svelte`

**Problem:**
Button component didn't accept `type` or `class` props:

```javascript
// ❌ Missing props
let {
    variant = "primary",
    size = "md",
    disabled = false,
    onclick = undefined,
    children,
} = $props();
```

**Root Cause:**
- Forms need `type="submit"` on buttons
- Custom classes needed for specific styling
- Props not forwarded to `<button>` element

**Solution:**
Add missing props:

```javascript
// ✅ All props defined
let {
    variant = "primary",
    size = "md",
    disabled = false,
    onclick = undefined,
    type = undefined,        // Added
    class: className = '',   // Added (renamed to avoid keyword)
    children,
} = $props();
```

```svelte
<button
    class="... {className}"  // Include custom classes
    {disabled}
    {onclick}
    {type}  // Forward type prop
>
```

**Why `class: className`:**
- `class` is JavaScript reserved keyword
- Destructuring allows renaming: `class: className`
- Use as `{className}` in component
- Users still pass `class="..."` prop

**Key Learnings:**
- Always consider what HTML attributes might be needed
- Common props: `type`, `class`, `id`, `name`, `disabled`, `readonly`
- Rename `class` to avoid keyword conflict
- Forward props to actual HTML elements

**Files Modified:**
- `src/lib/components/ui/Button.svelte` - Added `type` and `class` props

---

### Issue #10: Button Variant Not Styled

**Symptom:**
- Outline button looked like default button
- Needed for secondary actions

**Location:** `src/lib/components/ui/Button.svelte`

**Problem:**
Missing `outline` variant:

```javascript
// ❌ No outline variant
const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100",
};
```

**Solution:**
Add outline variant with dark mode:

```javascript
// ✅ Added outline variant
const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white",
    outline: "bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white",
};
```

**Use Cases:**
- `primary` - Main actions (Create, Save, Submit)
- `secondary` - Less important actions
- `danger` - Destructive actions (Delete)
- `ghost` - Subtle actions (Close, Cancel)
- `outline` - Alternative to secondary (Remove option)

**Key Learnings:**
- Plan variant system early
- Consider all use cases
- Include dark mode for each variant
- Document when to use each variant

**Files Modified:**
- `src/lib/components/ui/Button.svelte` - Added `outline` variant

---

## Summary of Key Learnings

### Svelte 5 Best Practices

1. **State Management:**
   - Wrap module state in objects for reactivity
   - Use getter functions for derived exports
   - Components wrap getters in `$derived()`

2. **Event Handlers:**
   - Use `onclick`, `oninput`, etc. (lowercase)
   - No `on:` directive or `|modifiers`
   - Handle `preventDefault()` in function

3. **Lifecycle:**
   - Use `$effect()` for initialization
   - `onMount()` removed in Svelte 5
   - Effects run during component creation

### Tailwind v4 Migration

1. **Dark Mode:**
   - Add `@custom-variant dark` in CSS
   - Class-based: `(&:where(.dark, .dark *))`
   - No config file needed

2. **Gradient Syntax:**
   - `bg-gradient-to-r` → `bg-linear-to-r`
   - Update all gradient utilities

3. **Utility Changes:**
   - `flex-shrink-0` → `shrink-0`
   - Check migration guide for others

### Component Design

1. **Props:**
   - Always include `class` prop
   - Rename to `className` to avoid keyword
   - Forward common HTML attributes

2. **Variants:**
   - Plan variant system early
   - Include dark mode for each
   - Document use cases

3. **Composition:**
   - Small, focused components
   - Clear prop interfaces
   - Render tags for children

### Debugging Tips

1. **Reactivity Issues:**
   - Check if state is wrapped in objects
   - Verify `$derived()` wraps getter calls
   - Test across component boundaries

2. **Compilation Errors:**
   - Read full error message
   - Check Svelte 5 docs for syntax changes
   - Look for removed features

3. **Dark Mode:**
   - Inspect `<html>` for `dark` class
   - Check `@custom-variant` in CSS
   - Verify all components have `dark:` variants

---

## Lessons for Future Projects

1. **Start with Latest Docs:**
   - Always reference current version docs
   - Migration guides are essential
   - Breaking changes list is your friend

2. **Test Early and Often:**
   - Test reactivity across modules
   - Verify dark mode in components
   - Check on different screen sizes

3. **Plan Component API:**
   - List all needed props upfront
   - Consider `class` prop for flexibility
   - Document variants and use cases

4. **Version Compatibility:**
   - Note major version differences
   - Update all related syntax together
   - Don't mix old and new patterns

5. **State Management Patterns:**
   - Object-wrap module-level state
   - Use getter functions for exports
   - Document reactivity patterns

---

This document will be updated as new issues are discovered and resolved.

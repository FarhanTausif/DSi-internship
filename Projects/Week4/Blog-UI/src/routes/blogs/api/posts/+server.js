import { json } from '@sveltejs/kit';

// Sample blog posts data
const posts = [
	{
		id: 1,
		slug: 'getting-started-with-svelte-5',
		title: 'Getting Started with Svelte 5',
		excerpt:
			'Learn about the new runes system in Svelte 5 and how it revolutionizes state management and reactivity in your applications.',
		content: `
# Getting Started with Svelte 5

Svelte 5 introduces a revolutionary new approach to reactivity with the runes system. This marks a significant evolution in how we build reactive applications.

## What are Runes?

Runes are symbols that you use in .svelte files to control the Svelte compiler. They have a $ prefix and look like functions, but they're actually part of the language syntax.

### The $state Rune

The \`$state\` rune allows you to create reactive state:

\`\`\`javascript
let count = $state(0);
\`\`\`

Unlike other frameworks, there's no API for interacting with state — count is just a number, and you can update it like any other variable.

### The $derived Rune

Derived state is declared with the \`$derived\` rune:

\`\`\`javascript
let count = $state(0);
let doubled = $derived(count * 2);
\`\`\`

## Benefits of Svelte 5

- **Simpler syntax**: Less boilerplate code
- **Better performance**: More efficient reactivity
- **Type safety**: Better TypeScript integration
- **Clearer intent**: Code is easier to understand

## Conclusion

Svelte 5's runes system represents a significant improvement in developer experience while maintaining Svelte's commitment to simplicity and performance.
		`,
		author: 'John Doe',
		date: '2024-11-28',
		category: 'Tutorial',
		tags: ['svelte', 'javascript', 'frontend'],
		readingTime: '5 min read'
	},
	{
		id: 2,
		slug: 'building-modern-web-apps',
		title: 'Building Modern Web Applications',
		excerpt: 'Discover the best practices and tools for building scalable, performant web applications in 2024.',
		content: `
# Building Modern Web Applications

The web development landscape has evolved dramatically. Today's applications need to be fast, accessible, and maintainable.

## Key Principles

### 1. Performance First

Performance is not just a feature — it's a fundamental requirement. Users expect applications to load quickly and respond instantly.

- Optimize images and assets
- Use code splitting
- Implement lazy loading
- Minimize JavaScript bundle size

### 2. Accessibility Matters

Building accessible applications ensures everyone can use your product:

- Use semantic HTML
- Provide keyboard navigation
- Include ARIA labels
- Test with screen readers

### 3. Developer Experience

A good developer experience leads to better applications:

- Use modern frameworks
- Implement hot module replacement
- Write comprehensive tests
- Document your code

## Modern Tools

### SvelteKit

SvelteKit provides everything you need to build a modern web application:

- File-based routing
- Server-side rendering
- API routes
- Static site generation

### Vite

Vite offers lightning-fast development with:

- Instant server start
- Hot module replacement
- Optimized builds

## Conclusion

Building modern web applications requires balancing performance, accessibility, and developer experience. With the right tools and practices, you can create amazing user experiences.
		`,
		author: 'Jane Smith',
		date: '2024-11-25',
		category: 'Best Practices',
		tags: ['web development', 'performance', 'accessibility'],
		readingTime: '7 min read'
	},
	{
		id: 3,
		slug: 'state-management-patterns',
		title: 'State Management Patterns in Svelte',
		excerpt:
			'Explore different patterns for managing state in Svelte applications, from simple local state to complex shared state.',
		content: `
# State Management Patterns in Svelte

Effective state management is crucial for building maintainable applications. Let's explore various patterns in Svelte.

## Local Component State

For simple cases, use local state with \`$state\`:

\`\`\`javascript
let count = $state(0);
\`\`\`

## Derived State

When state depends on other state, use \`$derived\`:

\`\`\`javascript
let items = $state([]);
let totalPrice = $derived(items.reduce((sum, item) => sum + item.price, 0));
\`\`\`

## Shared State

For state shared across components, create a store in a \`.svelte.js\` file:

\`\`\`javascript
// store.svelte.js
export const cart = $state({ items: [] });
\`\`\`

## Effects for Side Effects

Use \`$effect\` for side effects like API calls:

\`\`\`javascript
$effect(() => {
  console.log('Count changed:', count);
});
\`\`\`

## Best Practices

1. **Keep state close to where it's used**: Don't lift state unnecessarily
2. **Use derived state**: Instead of duplicating state
3. **Avoid effects for synchronization**: Use derived state instead
4. **Keep effects simple**: Complex logic should be in functions

## Patterns to Avoid

Don't use effects to synchronize state:

\`\`\`javascript
// ❌ Bad
let doubled = $state(0);
$effect(() => {
  doubled = count * 2;
});

// ✅ Good
let doubled = $derived(count * 2);
\`\`\`

## Conclusion

Svelte 5's runes provide powerful primitives for state management. Choose the right pattern for your use case to keep your code simple and maintainable.
		`,
		author: 'Alex Johnson',
		date: '2024-11-22',
		category: 'Architecture',
		tags: ['svelte', 'state management', 'patterns'],
		readingTime: '8 min read'
	},
	{
		id: 4,
		slug: 'typescript-with-sveltekit',
		title: 'TypeScript Best Practices with SvelteKit',
		excerpt:
			'Learn how to leverage TypeScript in your SvelteKit projects for better type safety and developer experience.',
		content: `
# TypeScript Best Practices with SvelteKit

TypeScript adds type safety to your SvelteKit applications, catching errors before runtime.

## Setting Up TypeScript

SvelteKit projects support TypeScript out of the box. Just use \`.ts\` instead of \`.js\`:

\`\`\`typescript
<script lang="ts">
  let count: number = 0;
</script>
\`\`\`

## Type-Safe Props

Define prop types for better autocomplete:

\`\`\`typescript
interface Props {
  title: string;
  count?: number;
}

let { title, count = 0 }: Props = $props();
\`\`\`

## Type-Safe Stores

Create typed stores for shared state:

\`\`\`typescript
// store.svelte.ts
interface User {
  id: number;
  name: string;
}

export const user = $state<User | null>(null);
\`\`\`

## Load Functions

Type your load functions for end-to-end type safety:

\`\`\`typescript
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  return {
    post: await fetchPost(params.slug)
  };
};
\`\`\`

## Form Actions

Type your form actions for better error handling:

\`\`\`typescript
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    // Handle form submission
  }
};
\`\`\`

## Benefits

- Catch errors at compile time
- Better IDE support
- Easier refactoring
- Self-documenting code

## Conclusion

TypeScript makes your SvelteKit applications more robust and maintainable. The initial setup is minimal, and the benefits are substantial.
		`,
		author: 'Sarah Williams',
		date: '2024-11-20',
		category: 'Tutorial',
		tags: ['typescript', 'sveltekit', 'type safety'],
		readingTime: '6 min read'
	},
	{
		id: 5,
		slug: 'performance-optimization-tips',
		title: 'Performance Optimization Tips',
		excerpt: 'Practical tips and techniques for optimizing the performance of your Svelte applications.',
		content: `
# Performance Optimization Tips

Performance is crucial for user experience. Here are practical tips for optimizing your Svelte applications.

## Code Splitting

Split your code to load only what's needed:

\`\`\`javascript
const HeavyComponent = async () => {
  const module = await import('./HeavyComponent.svelte');
  return module.default;
};
\`\`\`

## Lazy Loading

Load components only when needed:

\`\`\`svelte
{#await import('./Chart.svelte') then Chart}
  <Chart.default data={chartData} />
{/await}
\`\`\`

## Virtual Lists

For long lists, render only visible items:

- Use svelte-virtual-list
- Implement windowing
- Recycle DOM elements

## Image Optimization

Optimize images for better loading:

- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Serve responsive images
- Use CDN for delivery

## Minimize JavaScript

Reduce bundle size:

- Remove unused dependencies
- Use tree-shaking
- Minimize polyfills
- Split vendor code

## Reactive Optimizations

Use \`$state.raw\` for non-reactive data:

\`\`\`javascript
let largeArray = $state.raw([...]);
\`\`\`

## Measure Performance

Use tools to identify bottlenecks:

- Chrome DevTools
- Lighthouse
- WebPageTest
- Performance API

## Best Practices

1. **Measure first**: Don't optimize blindly
2. **Focus on impact**: Optimize what matters
3. **Test regularly**: Performance is ongoing
4. **Monitor in production**: Real user metrics matter

## Conclusion

Performance optimization is an iterative process. Start with measurements, make targeted improvements, and monitor the results.
		`,
		author: 'Michael Chen',
		date: '2024-11-18',
		category: 'Performance',
		tags: ['performance', 'optimization', 'best practices'],
		readingTime: '9 min read'
	},
	{
		id: 6,
		slug: 'css-styling-in-svelte',
		title: 'CSS Styling Strategies in Svelte',
		excerpt: 'Explore different approaches to styling your Svelte components, from scoped styles to utility-first CSS.',
		content: `
# CSS Styling Strategies in Svelte

Svelte offers multiple approaches to styling. Let's explore the options and when to use each.

## Scoped Styles

Svelte's default scoped styles are powerful:

\`\`\`svelte
<style>
  h1 {
    color: blue;
  }
</style>
\`\`\`

Styles are automatically scoped to the component — no CSS-in-JS needed!

## Global Styles

Use \`:global()\` for global styles:

\`\`\`svelte
<style>
  :global(body) {
    margin: 0;
  }
</style>
\`\`\`

## Utility-First CSS

Tailwind CSS works great with Svelte:

\`\`\`svelte
<div class="flex items-center gap-4">
  <h1 class="text-2xl font-bold">Hello</h1>
</div>
\`\`\`

## CSS Variables

Use CSS variables for theming:

\`\`\`svelte
<style>
  div {
    color: var(--theme-color);
  }
</style>
\`\`\`

## Dynamic Styles

Use reactive statements for dynamic styles:

\`\`\`svelte
<div style="color: {color}; font-size: {size}px">
  Dynamic styles
</div>
\`\`\`

## Class Directives

Conditionally apply classes:

\`\`\`svelte
<div class:active={isActive} class:disabled={isDisabled}>
  Content
</div>
\`\`\`

## Animation

Svelte has built-in animation support:

\`\`\`svelte
<script>
  import { fade, slide } from 'svelte/transition';
</script>

<div transition:fade>
  Animated content
</div>
\`\`\`

## Best Practices

1. **Use scoped styles**: Take advantage of Svelte's scoping
2. **Keep it simple**: Don't over-engineer your styles
3. **Be consistent**: Choose one approach and stick with it
4. **Consider performance**: Minimize style recalculations

## Choosing an Approach

- **Scoped styles**: Small to medium projects
- **Tailwind**: Large projects, design systems
- **CSS Modules**: When you need more control
- **Hybrid**: Mix approaches as needed

## Conclusion

Svelte's flexible styling options let you choose the best approach for your project. Start simple and add complexity only when needed.
		`,
		author: 'Emily Davis',
		date: '2024-11-15',
		category: 'Styling',
		tags: ['css', 'styling', 'tailwind'],
		readingTime: '7 min read'
	}
];

export function GET() {
	return json({ posts });
}

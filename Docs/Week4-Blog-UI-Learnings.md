# Week 4: Blog UI - Project Learnings & Best Practices

## Project Overview

**Blog UI** is a full-featured blog application built with SvelteKit 2, showcasing server-side rendering, file-based routing, and modern web development practices.

**Tech Stack:**
- SvelteKit 2
- Svelte 5 (with Runes)
- Tailwind CSS v4
- @tailwindcss/typography
- Marked (Markdown parser)
- ESLint + Prettier

---

## Key Learning Objectives

### 1. SvelteKit Architecture

#### What is SvelteKit?
SvelteKit is a full-stack framework for building web applications with Svelte. It provides:
- File-based routing
- Server-side rendering (SSR)
- API routes
- Code splitting
- Pre-rendering
- Optimized production builds

#### Project Structure:
```
src/
├── routes/
│   ├── +layout.svelte          # Root layout
│   ├── +page.svelte            # Home page (/)
│   ├── blogs/
│   │   ├── +page.js            # Data loading
│   │   ├── +page.svelte        # All posts page
│   │   ├── [slug]/
│   │   │   ├── +page.js        # Dynamic route loader
│   │   │   └── +page.svelte    # Individual post page
│   │   └── api/
│   │       └── posts/
│   │           └── +server.js  # API endpoint
│   └── layout.css              # Global styles
└── lib/
    ├── components/             # Reusable components
    └── assets/                 # Images, icons
```

---

### 2. File-Based Routing

#### Route Mapping:
| File | URL | Purpose |
|------|-----|---------|
| `+page.svelte` | `/` | Home page |
| `blogs/+page.svelte` | `/blogs` | All posts list |
| `blogs/[slug]/+page.svelte` | `/blogs/getting-started` | Individual post |
| `blogs/api/posts/+server.js` | `/blogs/api/posts` | JSON API endpoint |

#### Dynamic Routes:
```javascript
// blogs/[slug]/+page.js
export async function load({ params, fetch }) {
    const response = await fetch('/blogs/api/posts');
    const data = await response.json();
    
    const post = data.posts.find((p) => p.slug === params.slug);
    
    if (!post) {
        throw error(404, 'Post not found');
    }
    
    // Get related posts
    const relatedPosts = data.posts
        .filter((p) => p.category === post.category && p.id !== post.id)
        .slice(0, 3);
    
    return { post, relatedPosts };
}
```

**Key Insights:**
- ✅ `params.slug` automatically extracted from URL
- ✅ `load` function runs on server and client
- ✅ `error()` function handles 404s gracefully
- ✅ Return data is available as `props` in component

---

### 3. Data Loading Patterns

#### +page.js vs +server.js

**`+page.js` (Universal Load Function):**
```javascript
// Runs on both server and client
export async function load({ fetch }) {
    const response = await fetch('/blogs/api/posts');
    const data = await response.json();
    return data;
}
```
- Runs on server during SSR
- Runs on client for client-side navigation
- Can use browser and server APIs (with checks)

**`+server.js` (API Endpoint):**
```javascript
// Only runs on server
import { json } from '@sveltejs/kit';

export async function GET() {
    const posts = await fetchPostsFromDB();
    return json({ posts });
}
```
- Server-only execution
- Can access databases, file systems, secrets
- Returns JSON responses

---

### 4. Server-Side Rendering (SSR)

#### How SSR Works in SvelteKit:

1. **Request comes in** → Server runs `load` functions
2. **Data fetched** → Server-side fetch calls
3. **Component rendered** → HTML generated on server
4. **HTML sent** → Client receives fully rendered page
5. **Hydration** → Svelte makes page interactive

#### Benefits:
- ✅ Faster initial page load
- ✅ Better SEO (content visible to crawlers)
- ✅ Works without JavaScript
- ✅ Improved perceived performance

#### SSR-Safe Code:
```javascript
// ❌ BAD - window only exists in browser
let theme = localStorage.getItem('theme');

// ✅ GOOD - Check environment
let theme = $state(
    typeof window !== 'undefined' 
        ? localStorage.getItem('theme') 
        : 'light'
);
```

---

### 5. Component Communication

#### Props Down:
```svelte
<!-- Parent -->
<script>
    let { data } = $props(); // From load function
</script>

<Navigation />
<PostList posts={data.posts} />
<Footer />
```

```svelte
<!-- Child -->
<script>
    let { posts } = $props();
</script>

{#each posts as post}
    <PostCard {post} />
{/each}
```

#### Accessing Load Data:
```svelte
<script>
    // Automatically receives data from +page.js
    let { data } = $props();
    
    // Can destructure
    let { post, relatedPosts } = data;
</script>
```

---

### 6. Advanced Svelte 5 Patterns

#### Reactive Search & Filtering:
```svelte
<script>
    let { data } = $props();
    
    let searchQuery = $state('');
    let selectedCategory = $state('All');
    
    // Derived categories from posts
    let categories = $derived([
        'All', 
        ...new Set(data.posts.map(post => post.category))
    ]);
    
    // Reactive filtering
    let filteredPosts = $derived(
        data.posts.filter(post => {
            const matchesSearch = 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = 
                selectedCategory === 'All' || 
                post.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        })
    );
</script>

<!-- Two-way binding -->
<input bind:value={searchQuery} />
<select bind:value={selectedCategory}>
    {#each categories as category}
        <option value={category}>{category}</option>
    {/each}
</select>

<!-- Results update automatically -->
<p>Showing {filteredPosts.length} of {data.posts.length} posts</p>
```

**Key Concepts:**
- `$state` for reactive input values
- `$derived` for computed values
- `bind:value` for two-way data binding
- Automatic reactivity - no manual update calls

---

### 7. Layout System

#### Root Layout:
```svelte
<!-- +layout.svelte -->
<script>
    import Navigation from '$lib/components/Navigation.svelte';
    import Footer from '$lib/components/Footer.svelte';
    
    let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
    <Navigation />
    <main class="flex-1">
        {@render children()}
    </main>
    <Footer />
</div>
```

**How it Works:**
- Layout wraps all pages in `/routes`
- `children` snippet renders current page content
- Shared components (nav, footer) only render once
- Persists across navigation

#### Nested Layouts:
```
routes/
├── +layout.svelte          # Root layout (all pages)
├── blogs/
│   ├── +layout.svelte      # Blog-specific layout
│   └── [slug]/
│       └── +page.svelte    # Inherits both layouts
```

---

### 8. Mobile-First Responsive Design

#### Navigation Pattern:
```svelte
<script>
    let mobileMenuOpen = $state(false);
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<nav>
    <!-- Desktop Nav -->
    <div class="hidden md:flex items-center gap-8">
        <a href="/">Home</a>
        <a href="/blogs">All Posts</a>
    </div>
    
    <!-- Mobile Toggle -->
    <button 
        class="md:hidden"
        onclick={toggleMobileMenu}
    >
        {#if mobileMenuOpen}
            <CloseIcon />
        {:else}
            <MenuIcon />
        {/if}
    </button>
</nav>

<!-- Mobile Menu -->
{#if mobileMenuOpen}
    <div class="md:hidden">
        <a href="/">Home</a>
        <a href="/blogs">All Posts</a>
    </div>
{/if}
```

**Tailwind Breakpoints:**
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

---

### 9. Content Management

#### Markdown Integration:
```javascript
import { marked } from 'marked';

const posts = [
    {
        slug: 'getting-started',
        content: `
# Getting Started

This is **markdown** content with _formatting_.

\`\`\`javascript
const hello = 'world';
\`\`\`
        `
    }
];

export function GET() {
    // Parse markdown to HTML
    const postsWithHTML = posts.map(post => ({
        ...post,
        htmlContent: marked(post.content)
    }));
    
    return json({ posts: postsWithHTML });
}
```

#### Rendering in Component:
```svelte
<article class="prose prose-slate max-w-none">
    {@html post.content}
</article>
```

**@tailwindcss/typography:**
- Provides `.prose` class for beautiful typography
- Styles headings, paragraphs, lists, code blocks
- Responsive and customizable
- Works perfectly with markdown-generated HTML

---

### 10. API Design

#### RESTful Endpoint Pattern:
```javascript
// blogs/api/posts/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    // Extract query parameters
    const category = url.searchParams.get('category');
    
    let posts = await fetchPosts();
    
    // Filter if category provided
    if (category) {
        posts = posts.filter(p => p.category === category);
    }
    
    return json({ 
        posts,
        total: posts.length 
    });
}

export async function POST({ request }) {
    const data = await request.json();
    // Create new post logic
    return json({ success: true });
}
```

**RESTful Conventions:**
- `GET` - Retrieve data
- `POST` - Create new resource
- `PUT/PATCH` - Update resource
- `DELETE` - Remove resource

---

## Best Practices Learned

### 1. Project Structure
- ✅ Use `$lib` for all reusable code
- ✅ Group components by feature/purpose
- ✅ Keep routes simple, logic in components
- ✅ Use `+page.js` for data loading
- ✅ Use `+server.js` for API endpoints

### 2. Performance Optimization
- ✅ Leverage SSR for faster initial loads
- ✅ Use code splitting (automatic with SvelteKit)
- ✅ Implement proper loading states
- ✅ Optimize images and assets
- ✅ Pre-render static pages when possible

### 3. Data Management
- ✅ Fetch data in `load` functions, not `onMount`
- ✅ Use `$derived` for computed data
- ✅ Cache API responses when appropriate
- ✅ Handle loading and error states
- ✅ Validate data before rendering

### 4. SEO & Accessibility
- ✅ Use semantic HTML
- ✅ Add proper meta tags
- ✅ Implement proper heading hierarchy
- ✅ Ensure keyboard navigation works
- ✅ Test with screen readers
- ✅ Use `<svelte:head>` for page-specific meta

### 5. Styling
- ✅ Use Tailwind utility classes
- ✅ Create reusable component classes
- ✅ Implement consistent spacing/colors
- ✅ Design mobile-first
- ✅ Use Tailwind's dark mode utilities

---

## Common Patterns & Solutions

### Pattern 1: Loading States
```svelte
<script>
    import { onMount } from 'svelte';
    
    let posts = $state([]);
    let loading = $state(true);
    let error = $state(null);
    
    onMount(async () => {
        try {
            const response = await fetch('/blogs/api/posts');
            const data = await response.json();
            posts = data.posts;
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });
</script>

{#if loading}
    <div class="animate-spin">Loading...</div>
{:else if error}
    <div class="text-red-600">Error: {error}</div>
{:else}
    <PostList {posts} />
{/if}
```

### Pattern 2: Dynamic Meta Tags
```svelte
<svelte:head>
    <title>{post.title} - My Blog</title>
    <meta name="description" content={post.excerpt} />
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.excerpt} />
</svelte:head>
```

### Pattern 3: Related Content
```javascript
// In load function
const relatedPosts = data.posts
    .filter(p => 
        p.category === post.category && 
        p.id !== post.id
    )
    .slice(0, 3);

return { post, relatedPosts };
```

---

## Development Workflow

### 1. Local Development
```bash
npm run dev          # Start dev server
npm run dev -- --open  # Open in browser
```

### 2. Code Quality
```bash
npm run format       # Format with Prettier
npm run lint         # Check with ESLint
npm run check        # Type checking
```

### 3. Building
```bash
npm run build        # Production build
npm run preview      # Preview production build
```

---

## Deployment Strategies

### Vercel (Recommended):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify:
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"
```

### Adapter Configuration:
```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

export default {
    kit: {
        adapter: adapter()  // Auto-detects platform
    }
};
```

---

## Challenges & Solutions

### Challenge 1: SSR Hydration Errors
**Problem:** State mismatch between server and client

**Solution:**
```javascript
// Use onMount for client-only code
import { onMount } from 'svelte';

let clientData = $state(null);

onMount(() => {
    clientData = fetchClientOnlyData();
});
```

### Challenge 2: API Data Management
**Problem:** Duplicate fetch calls on navigation

**Solution:** Use SvelteKit's built-in caching:
```javascript
// +page.js runs once per navigation
export async function load({ fetch }) {
    // SvelteKit caches this automatically
    const response = await fetch('/api/posts');
    return await response.json();
}
```

### Challenge 3: Dynamic Routes with 404s
**Problem:** Need to handle invalid slugs

**Solution:**
```javascript
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const post = await fetchPost(params.slug);
    
    if (!post) {
        throw error(404, {
            message: 'Post not found'
        });
    }
    
    return { post };
}
```

---

## Testing Strategies

### Unit Tests (Vitest):
```javascript
import { render } from '@testing-library/svelte';
import PostCard from './PostCard.svelte';

test('renders post title', () => {
    const { getByText } = render(PostCard, {
        props: {
            post: {
                title: 'Test Post',
                excerpt: 'Test excerpt'
            }
        }
    });
    
    expect(getByText('Test Post')).toBeInTheDocument();
});
```

### Integration Tests:
- Test data loading in `load` functions
- Verify API endpoints return correct data
- Check routing and navigation

### E2E Tests (Playwright):
```javascript
test('user can view blog post', async ({ page }) => {
    await page.goto('/');
    await page.click('text=All Posts');
    await page.click('text=Getting Started');
    
    await expect(page.locator('h1')).toContainText('Getting Started');
});
```

---

## Key Takeaways

1. **SvelteKit provides full-stack capabilities** with minimal configuration
2. **File-based routing** is intuitive and scales well
3. **SSR improves performance and SEO** significantly
4. **Load functions** are the right place for data fetching
5. **API routes** enable backend functionality without separate server
6. **Layouts** reduce code duplication and improve UX
7. **Svelte 5 + SvelteKit** is a powerful, modern web development stack
8. **Mobile-first design** is essential for modern web apps

---

## Advanced Topics to Explore

- [ ] Form actions and progressive enhancement
- [ ] Authentication with session management
- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] Image optimization with `@sveltejs/enhanced-img`
- [ ] Internationalization (i18n)
- [ ] Real-time features with WebSockets
- [ ] Advanced caching strategies
- [ ] Deployment with Docker
- [ ] Analytics integration
- [ ] Content Management System (CMS) integration

---

## Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- [Marked.js](https://marked.js.org/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## Comparison: Pollkit vs Blog UI

| Aspect | Pollkit (Week 3) | Blog UI (Week 4) |
|--------|------------------|------------------|
| **Framework** | Svelte 5 (SPA) | SvelteKit 2 (Full-stack) |
| **Routing** | Hash-based (client) | File-based (universal) |
| **Rendering** | CSR only | SSR + CSR |
| **API** | No backend | Built-in API routes |
| **State** | Global stores | Load functions + props |
| **Deployment** | Static hosting | Node server or adapter |
| **SEO** | Limited | Excellent |
| **Complexity** | Simpler | More comprehensive |

**When to use each:**
- **Pollkit approach:** Simple apps, admin dashboards, client-only tools
- **Blog UI approach:** Content sites, e-commerce, apps needing SEO

---

## Conclusion

The Blog UI project demonstrates the power of SvelteKit for building modern, performant web applications. By combining SSR, file-based routing, and Svelte 5's runes system, we can create applications that are fast, maintainable, and user-friendly.

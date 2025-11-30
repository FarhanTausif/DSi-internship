<script>
    import { initializeTheme } from './lib/stores/themeStore.svelte.js';
    import Layout from './lib/components/layout/Layout.svelte';
    import Home from './routes/Home.svelte';
    import Dashboard from './routes/Dashboard.svelte';

    /**
     * Main application component
     * Handles client-side routing using hash-based navigation
     */

    // Track current route based on URL hash
    let currentRoute = $state(window.location.hash.slice(1) || '/');

    // Update route when hash changes
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
        <div class="text-center py-16">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                404 - Page Not Found
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
                The page you're looking for doesn't exist.
            </p>
            <a
                href="#/"
                class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Go Home
            </a>
        </div>
    {/if}
</Layout>
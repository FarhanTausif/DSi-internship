<script>
    import { getTheme, toggleTheme } from "../../stores/themeStore.svelte.js";
    
    // Use $derived to reactively get the current theme
    let theme = $derived(getTheme());
</script>

<button
    onclick={toggleTheme}
    class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
    dark:hover:bg-gray-600 transition-colors"
    aria-label="Toggle theme"
    title="Toggle {theme === 'light' ? 'dark' : 'light'} mode"
>
    {#if theme === "light"}
        <span role="img" aria-label="Dark mode">🌙</span>
    {:else}
        <span role="img" aria-label="Light mode">☀️</span>
    {/if}
</button>

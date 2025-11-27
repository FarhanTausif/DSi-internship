<script>
    import { getTheme, toggleTheme } from "../../stores/themeStore.svelte.js";
    let theme = $derived(getTheme());
</script>

<button
    onclick={toggleTheme}
    class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
    dark:hover:bg-gray-600 transition-colors"
    aria-label="Toggle theme"
>
    {#if theme === "light"}
        🌙
    {:else}
        ☀️
    {/if}
</button>

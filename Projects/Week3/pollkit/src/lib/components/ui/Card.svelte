<script>
    let {children, title, class: className = ''} = $props();
</script>

<div class="{className} bg-white/30 dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
    {#if title}
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
    {/if}
    {@render children()}
</div>
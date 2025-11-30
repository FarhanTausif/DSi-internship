<script>
    // Reusable card component with variants (default, elevated, outlined)
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
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
        secondary:
            "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
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
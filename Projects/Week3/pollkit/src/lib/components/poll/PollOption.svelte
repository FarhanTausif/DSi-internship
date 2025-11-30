<script>
    import { fly } from 'svelte/transition';

    /**
     * Individual poll option with animated vote percentage bar
     * Shows votes, percentage, and highlights when selected
     */
    let {
        option,
        isSelected = false,
        percentage = 0,
        totalVotes = 0,
        disabled = false,
        onclick = undefined
    } = $props();
</script>

<button
    class="w-full text-left relative overflow-hidden rounded-lg border-2 transition-all duration-200
        {isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
            : disabled
                ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800 hover:shadow-sm'}"
    {onclick}
    {disabled}
    type="button"
>
    <!-- Animated Vote Percentage Bar -->
    {#if totalVotes > 0 && percentage > 0}
        <div
            class="absolute inset-0 bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10"
            style="width: {percentage}%"
            transition:fly={{ x: -50, duration: 400 }}
        ></div>
    {/if}

    <!-- Option Content -->
    <div class="relative p-4 flex items-center justify-between gap-4">
        <!-- Option Text -->
        <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-900 dark:text-white truncate">
                {option.text}
            </div>
        </div>

        <!-- Vote Stats -->
        <div class="flex items-center gap-3 text-sm shrink-0">
            <span class="text-gray-600 dark:text-gray-400 tabular-nums">
                {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
            </span>
            {#if totalVotes > 0}
                <span class="font-semibold text-blue-600 dark:text-blue-400 min-w-12 text-right tabular-nums">
                    {percentage}%
                </span>
            {/if}
        </div>
    </div>

    <!-- Selected Indicator -->
    {#if isSelected}
        <div class="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <span class="text-white text-xs">✓</span>
        </div>
    {/if}
</button>
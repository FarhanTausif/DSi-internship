<script>
    import Card from '../ui/Card.svelte';

    /**
     * Display statistics for a single poll
     * Shows breakdown of votes, leading option, and distribution
     */
    let { poll } = $props();

    // Find the option with most votes
    const leadingOption = $derived(
        poll.options.reduce((max, option) => (option.votes > max.votes ? option : max), poll.options[0])
    );

    // Calculate average votes per option
    const averageVotes = $derived(
        poll.options.length > 0 ? (poll.totalVotes / poll.options.length).toFixed(1) : '0.0'
    );

    // Calculate percentage for each option
    const optionsWithPercentage = $derived(
        poll.options.map((option) => ({
            ...option,
            percentage:
                poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
        }))
    );
</script>

<Card variant="outlined" class="h-full hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
    <!-- Poll Question -->
    <h4 class="font-semibold text-gray-900 dark:text-white mb-4 line-clamp-2">
        {poll.question}
    </h4>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Total Votes -->
        <div class="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Votes</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {poll.totalVotes}
            </p>
        </div>

        <!-- Average per Option -->
        <div class="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg/Option</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {averageVotes}
            </p>
        </div>

        <!-- Number of Options -->
        <div class="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Options</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {poll.options.length}
            </p>
        </div>

        <!-- Leading Option -->
        <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Leading</p>
            <p class="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">
                {leadingOption.votes} votes
            </p>
        </div>
    </div>

    <!-- Detailed Breakdown -->
    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Vote Distribution
        </p>
        <div class="space-y-2">
            {#each optionsWithPercentage as option}
                <div class="flex items-center gap-3">
                    <!-- Option Name -->
                    <span class="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 min-w-0">
                        {option.text}
                    </span>

                    <!-- Vote Count -->
                    <span class="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                        {option.votes}
                    </span>

                    <!-- Percentage -->
                    <span class="text-sm text-blue-600 dark:text-blue-400 font-semibold min-w-12 text-right tabular-nums">
                        {option.percentage}%
                    </span>
                </div>
            {/each}
        </div>
    </div>
</Card>
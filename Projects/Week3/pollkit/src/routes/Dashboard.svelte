<script>
    import { getPolls, getTotalPolls, getTotalVotes, getAverageVotesPerPoll } from '../lib/stores/pollStore.svelte.js';
    import PollStats from '../lib/components/dashboard/PollStats.svelte';
    import Card from '../lib/components/ui/Card.svelte';
    import { fade } from 'svelte/transition';

    /**
     * Dashboard page - shows overview of all polling activity
     * Displays aggregate statistics and individual poll breakdowns
     */
    
    // Get reactive polls array and stats
    const polls = $derived(getPolls());
    const totalPolls = $derived(getTotalPolls());
    const totalVotes = $derived(getTotalVotes());
    const averageVotesPerPoll = $derived(getAverageVotesPerPoll());
</script>

<div class="space-y-8">
    <!-- Page Header -->
    <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
            Overview of all polling activity
        </p>
    </div>

    <!-- Summary Statistics Cards -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Total Polls Card -->
        <Card variant="elevated" class="text-center">
            <div class="mb-2">
                <span class="text-4xl" aria-hidden="true">📊</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Polls</p>
            <p class="text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {totalPolls}
            </p>
        </Card>

        <!-- Total Votes Card -->
        <Card variant="elevated" class="text-center">
            <div class="mb-2">
                <span class="text-4xl" aria-hidden="true">✅</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Votes</p>
            <p class="text-4xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                {totalVotes}
            </p>
        </Card>

        <!-- Average Votes per Poll Card -->
        <Card variant="elevated" class="text-center sm:col-span-2 lg:col-span-1">
            <div class="mb-2">
                <span class="text-4xl" aria-hidden="true">📈</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Avg Votes/Poll</p>
            <p class="text-4xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                {averageVotesPerPoll}
            </p>
        </Card>
    </div>

    <!-- Individual Poll Statistics -->
    <div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Poll Details
        </h3>

        {#if polls.length === 0}
            <Card variant="default">
                <div class="text-center py-8">
                    <span class="text-5xl mb-4 block" aria-hidden="true">📭</span>
                    <p class="text-gray-500 dark:text-gray-400">
                        No polls to display. Create a poll to see statistics.
                    </p>
                </div>
            </Card>
        {:else}
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each polls as poll (poll.id)}
                    <div transition:fade={{ duration: 200 }}>
                        <PollStats {poll} />
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
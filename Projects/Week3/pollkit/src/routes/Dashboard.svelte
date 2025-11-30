<script>
    import {
        getPolls,
        getTotalPolls,
        getTotalVotes,
        getAverageVotesPerPoll,
    } from "../lib/stores/pollStore.svelte.js";
    import PollStats from "../lib/components/dashboard/PollStats.svelte";
    import Card from "../lib/components/ui/Card.svelte";
    import { fade } from "svelte/transition";

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
            <div class="mb-2 flex justify-center">
                <span class="text-4xl" aria-hidden="true"
                    ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="none"
                            stroke="#ffa200"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M37.138 36.57v3.062h-29.3a2.334 2.334 0 0 1-2.338-2.33h0V14.696h3.056V36.57zM12.113 10.698a2.334 2.334 0 0 1 2.337-2.33h6.793c.65 0 1.283.202 1.812.579l3.828 2.725c.53.377 1.163.58 1.812.579h11.468a2.334 2.334 0 0 1 2.337 2.33v15.531a2.334 2.334 0 0 1-2.337 2.33H14.45a2.334 2.334 0 0 1-2.337-2.33z"
                            stroke-width="1.9"
                        />
                    </svg></span
                >
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Total Polls
            </p>
            <p
                class="text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums"
            >
                {totalPolls}
            </p>
        </Card>

        <!-- Total Votes Card -->
        <Card variant="elevated" class="text-center">
            <div class="mb-2 flex justify-center">
                <span class="text-4xl" aria-hidden="true"
                    ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="none"
                            stroke="#ffa200"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m38.232 11.573l-3.5-6.073l-28.51 8.093l21.41 9.413L15.14 42.5l26.638-7.162v-1.982"
                            stroke-width="1.9"
                        />
                    </svg></span
                >
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Total Votes
            </p>
            <p
                class="text-4xl font-bold text-green-600 dark:text-green-400 tabular-nums"
            >
                {totalVotes}
            </p>
        </Card>

        <!-- Average Votes per Poll Card -->
        <Card
            variant="elevated"
            class="text-center sm:col-span-2 lg:col-span-1"
        >
            <div class="mb-2 flex justify-center">
                <span class="text-4xl" aria-hidden="true"
                    ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                    >
                        <g
                            fill="none"
                            stroke="#ffa200"
                            stroke-linecap="round"
                            stroke-width="1.5"
                        >
                            <path
                                d="M21 21H10c-3.3 0-4.95 0-5.975-1.025S3 17.3 3 14V3"
                            />
                            <path
                                stroke-linejoin="round"
                                d="M6 12h.009m2.99 0h.008m2.99 0h.008m2.99 0h.009m2.989 0h.009m2.989 0H21"
                            />
                            <path
                                d="M6 7c.673-1.122 1.587-2 2.993-2c5.943 0 2.602 12 8.989 12c1.416 0 2.324-.884 3.018-2"
                            />
                        </g>
                    </svg></span
                >
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Avg Votes/Poll
            </p>
            <p
                class="text-4xl font-bold text-purple-600 dark:text-purple-400 tabular-nums"
            >
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
                    <span class="text-5xl mb-4 block" aria-hidden="true"
                        >📭</span
                    >
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

<script>
    import { flip } from 'svelte/animate';
    import { vote } from '../../stores/pollStore.svelte.js';
    import Card from '../../components/ui/Card.svelte';
    import PollOption from './PollOption.svelte';

    /**
     * Complete poll card with voting functionality
     * Shows question, options, and handles vote submission
     */
    let { poll } = $props();

    // Track voting state per component instance
    let hasVoted = $state(false);
    let selectedOptionId = $state(null);

    /**
     * Handle vote submission
     * Prevents multiple votes from same user
     */
    function handleVote(optionId) {
        if (hasVoted) return;

        vote(poll.id, optionId);
        hasVoted = true;
        selectedOptionId = optionId;
    }

    // Calculate percentage for each option
    const optionsWithPercentage = $derived(
        poll.options.map((option) => ({
            ...option,
            percentage:
                poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
        }))
    );

    // Sort options by votes when user has voted (for visual ranking)
    const displayOptions = $derived(
        hasVoted
            ? [...optionsWithPercentage].sort((a, b) => b.votes - a.votes)
            : optionsWithPercentage
    );
</script>

<Card variant="default" class="h-full">
    <!-- Poll Question -->
    <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {poll.question}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
            {poll.totalVotes} total {poll.totalVotes === 1 ? 'vote' : 'votes'}
        </p>
    </div>

    <!-- Poll Options with animate:flip for reordering -->
    <div class="space-y-3">
        {#each displayOptions as option (option.id)}
            <div animate:flip={{ duration: 300 }}>
                <PollOption
                    {option}
                    isSelected={selectedOptionId === option.id}
                    percentage={option.percentage}
                    totalVotes={poll.totalVotes}
                    disabled={hasVoted}
                    onclick={() => handleVote(option.id)}
                />
            </div>
        {/each}
    </div>

    <!-- Status Message -->
    {#if hasVoted}
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p class="text-sm text-green-700 dark:text-green-400 text-center font-medium">
                ✓ Thank you for voting!
            </p>
        </div>
    {:else}
        <p class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            Click an option to vote
        </p>
    {/if}
</Card>
<script>
    import { fade } from 'svelte/transition';
    import Button from '../lib/components/ui/Button.svelte';
    import { getPolls, getTotalVotes } from '../lib/stores/pollStore.svelte.js';
    import PollCard from '../lib/components/poll/PollCard.svelte';
    import Modal from '../lib/components/ui/Modal.svelte';
    import CreatePollForm from '../lib/components/dashboard/CreatePollForm.svelte';

    /**
     * Home page - displays all active polls
     * Allows users to vote and create new polls
     */

    let isCreateModalOpen = $state(false);
    
    // Get reactive polls array and stats
    const polls = $derived(getPolls());
    const totalVotes = $derived(getTotalVotes());

    function handlePollCreated() {
        isCreateModalOpen = false;
    }
</script>

<div class="space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                Active Polls
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
                Vote on polls and see live results
            </p>
        </div>

        <Button variant="primary" onclick={() => (isCreateModalOpen = true)} class="sm:self-start">
            <span aria-hidden="true">+</span> Create Poll
        </Button>
    </div>

    <!-- Polls Grid -->
    {#if polls.length === 0}
        <div class="text-center py-16" transition:fade>
            <div class="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <span class="text-6xl" aria-hidden="true">📊</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No polls yet
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
                Create your first poll to get started!
            </p>
            <Button variant="primary" onclick={() => (isCreateModalOpen = true)}>
                Create Your First Poll
            </Button>
        </div>
    {:else}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {#each polls as poll (poll.id)}
                <div transition:fade={{ duration: 200 }}>
                    <PollCard {poll} />
                </div>
            {/each}
        </div>

        <!-- Stats Summary -->
        <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p class="text-sm text-blue-700 dark:text-blue-300 text-center">
                <span class="font-semibold">{polls.length}</span> active {polls.length === 1 ? 'poll' : 'polls'}
                · <span class="font-semibold">{totalVotes}</span> total votes
            </p>
        </div>
    {/if}
</div>

<!-- Create Poll Modal -->
<Modal bind:isOpen={isCreateModalOpen} title="Create New Poll">
    <CreatePollForm onSuccess={handlePollCreated} />
</Modal>
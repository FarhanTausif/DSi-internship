<script>
    import { fade } from "svelte/transition";
    import Button from "../lib/components/ui/Button.svelte";
    import { getPolls, getTotalVotes } from "../lib/stores/pollStore.svelte.js";
    import PollCard from "../lib/components/poll/PollCard.svelte";
    import Modal from "../lib/components/ui/Modal.svelte";
    import CreatePollForm from "../lib/components/dashboard/CreatePollForm.svelte";

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
    <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
        <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                Active Polls
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
                Vote on polls and see live results
            </p>
        </div>

        <Button
            variant="primary"
            onclick={() => (isCreateModalOpen = true)}
            class="sm:self-start"
        >
            <div
                class="flex items-center justify-center gap-2"
                aria-hidden="true"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                >
                    <g
                        fill="none"
                        fill-rule="evenodd"
                        stroke="#fff"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.9"
                    >
                        <path
                            d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11"
                        />
                        <path
                            d="M17.5 3.467a1.46 1.46 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.41 1.41 0 0 1 1.885-.104zm-2 2.033l.953 1"
                        />
                    </g>
                </svg>
                <p>Create Poll</p>
            </div>
        </Button>
    </div>

    <!-- Polls Grid -->
    {#if polls.length === 0}
        <div class="text-center py-16" transition:fade>
            <div
                class="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-4"
            >
                <span class="text-6xl" aria-hidden="true"
                    ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#053ea4"
                            fill-rule="evenodd"
                            d="M10 3h4v18h-4zM3 13h4v8H3zm18-5h-4v13h4z"
                            clip-rule="evenodd"
                            stroke-width="2"
                            stroke="#053ea4"
                        />
                    </svg></span
                >
            </div>
            <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
                No polls yet
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
                Create your first poll to get started!
            </p>
            <Button
                variant="primary"
                onclick={() => (isCreateModalOpen = true)}
            >
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
        <div
            class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
            <p class="text-sm text-blue-700 dark:text-blue-300 text-center">
                <span class="font-semibold">{polls.length}</span> active {polls.length ===
                1
                    ? "poll"
                    : "polls"}
                · <span class="font-semibold">{totalVotes}</span> total votes
            </p>
        </div>
    {/if}
</div>

<!-- Create Poll Modal -->
<Modal bind:isOpen={isCreateModalOpen} title="Create New Poll">
    <CreatePollForm onSuccess={handlePollCreated} />
</Modal>

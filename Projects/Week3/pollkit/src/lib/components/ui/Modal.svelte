<script>
    import { fly, fade } from 'svelte/transition';
    import Button from './Button.svelte';

    /**
     * Reusable modal component with backdrop
     * Uses transitions for smooth open/close animations
     */
    let {
        // isOpen -- whether the modal is visible -- 
        // here, $bindable is used to allow two-way binding of the isOpen prop
        isOpen = $bindable(false),
        title = '',
        children
    } = $props();

    // Close modal on Escape key press
    function handleKeydown(event) {
        if (event.key === 'Escape' && isOpen) {
            isOpen = false;
        }
    }

    // Close modal when clicking backdrop
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            isOpen = false;
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
    <!-- Backdrop -->
    <div
        id="modal-backdrop"
        class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
        onclick={handleBackdropClick}
        role="presentation"
    >
        <!-- Modal Container -->
        <div
            id="modal-container"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            transition:fly={{ y: -20, duration: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <!-- Header -->
            <header class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 id="modal-title" class="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <Button variant="ghost" size="sm" onclick={() => (isOpen = false)}>
                    <span aria-hidden="true">✕</span>
                    <span class="sr-only">Close</span>
                </Button>
            </header>

            <!-- Body -->
            <div class="p-6">
                {@render children()}
            </div>
        </div>
    </div>
{/if}
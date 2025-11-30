<script>
    import { addPoll } from '../../stores/pollStore.svelte.js';
    import Button from '../ui/Button.svelte';

    /**
     * Form for creating new polls
     * Validates input and manages dynamic option list
     */
    let { onSuccess = () => {} } = $props();

    let question = $state('');
    let options = $state(['', '']);
    let error = $state('');

    /**
     * Add a new empty option field
     * Maximum 10 options allowed
     */
    function addOption() {
        if (options.length < 10) {
            options = [...options, ''];
        }
    }

    /**
     * Remove an option at specific index
     * Minimum 2 options required
     */
    function removeOption(index) {
        if (options.length > 2) {
            options = options.filter((_, i) => i !== index);
        }
    }

    /**
     * Handle form submission
     * Validates and creates new poll
     */
    function handleSubmit() {
        error = '';

        // Validate question
        if (!question.trim()) {
            error = 'Please enter a poll question';
            return;
        }

        // Filter and validate options
        const validOptions = options.filter((opt) => opt.trim()).map((opt) => opt.trim());

        if (validOptions.length < 2) {
            error = 'Please provide at least 2 options';
            return;
        }

        // Check for duplicate options
        const uniqueOptions = new Set(validOptions);
        if (uniqueOptions.size !== validOptions.length) {
            error = 'Please remove duplicate options';
            return;
        }

        // Create poll
        addPoll(question.trim(), validOptions);

        // Reset form
        question = '';
        options = ['', ''];
        error = '';

        // Notify parent
        onSuccess();
    }
</script>

<form onsubmit={handleSubmit} class="space-y-6">
    <!-- Question Input -->
    <div>
        <label for="poll-question" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Poll Question
        </label>
        <input
            id="poll-question"
            type="text"
            bind:value={question}
            placeholder="e.g., What's your favorite programming language?"
            maxlength="200"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {question.length}/200 characters
        </p>
    </div>

    <!-- Options Input -->
    <div>
        <div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Options (minimum 2)
        </div>
        <div class="space-y-2">
            {#each options as option, i}
                <div class="flex gap-2">
                    <input
                        type="text"
                        bind:value={options[i]}
                        placeholder="Option {i + 1}"
                        maxlength="100"
                        class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    />
                    {#if options.length > 2}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onclick={() => removeOption(i)}
                        >
                            <span aria-hidden="true">✕</span>
                            <span class="sr-only">Remove option {i + 1}</span>
                        </Button>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- Add Option Button -->
        {#if options.length < 10}
            <Button type="button" variant="ghost" size="sm" class="mt-2" onclick={addOption}>
                + Add Option
            </Button>
        {/if}

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {options.length}/10 options
        </p>
    </div>

    <!-- Error Message -->
    {#if error}
        <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-700 dark:text-red-400">
                {error}
            </p>
        </div>
    {/if}

    <!-- Submit Button -->
    <div class="flex gap-3">
        <Button type="submit" variant="primary" class="flex-1">
            Create Poll
        </Button>
    </div>
</form>
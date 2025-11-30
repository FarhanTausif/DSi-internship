<script>
    import ThemeToggle from "../ui/ThemeToggle.svelte";

    /**
     * Main application layout
     * Provides consistent header, navigation, and content structure
     */
    let { children } = $props();

    // Track current route for active nav styling
    let currentPath = $state(window.location.hash.slice(1) || "/");

    function handleHashChange() {
        currentPath = window.location.hash.slice(1) || "/";
    }

    // Helper to check if nav link is active
    function isActive(path) {
        return currentPath === path;
    }
</script>

<svelte:window onhashchange={handleHashChange} />

<div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
>
    <!-- Header -->
    <header
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30"
    >
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <!-- Logo and Navigation -->
                <div class="flex items-center gap-8">
                    <a href="#/" class="flex items-center gap-2">
                        <span class="text-2xl" aria-hidden="true"
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
                        <h1
                            class="text-2xl font-bold text-gray-900 dark:text-white"
                        >
                            Pollkit
                        </h1>
                    </a>

                    <!-- Desktop Navigation -->
                    <nav class="hidden md:flex gap-1">
                        <a
                            href="#/"
                            class="px-4 py-2 rounded-lg transition-colors {isActive(
                                '/'
                            ) || isActive('')
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                        >
                            Polls
                        </a>
                        <a
                            href="#/dashboard"
                            class="px-4 py-2 rounded-lg transition-colors {isActive(
                                '/dashboard'
                            )
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                        >
                            Dashboard
                        </a>
                    </nav>
                </div>

                <!-- Theme Toggle -->
                <ThemeToggle />
            </div>

            <!-- Mobile Navigation -->
            <nav class="md:hidden flex gap-1 mt-4">
                <a
                    href="#/"
                    class="flex-1 px-4 py-2 rounded-lg text-center transition-colors {isActive(
                        '/'
                    ) || isActive('')
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    Polls
                </a>
                <a
                    href="#/dashboard"
                    class="flex-1 px-4 py-2 rounded-lg text-center transition-colors {isActive(
                        '/dashboard'
                    )
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    Dashboard
                </a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        {@render children()}
    </main>

    <!-- Footer -->
    <footer
        class="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
    >
        <p>Built with Svelte 5 + Tailwind CSS</p>
    </footer>
</div>

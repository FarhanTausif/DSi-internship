<script>
	let mobileMenuOpen = $state(false);
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<nav class="bg-white shadow-md sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center">
				<a href="/" class="flex items-center gap-2">
					<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-xl">B</span>
					</div>
					<span class="text-xl font-bold text-slate-900">Blog</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-8">
				<a 
					href="/" 
					class="text-slate-700 hover:text-blue-600 font-medium transition-colors"
				>
					Home
				</a>
				<a 
					href="/blogs" 
					class="text-slate-700 hover:text-blue-600 font-medium transition-colors"
				>
					All Posts
				</a>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden flex items-center">
				<button
					onclick={toggleMobileMenu}
					class="text-slate-700 hover:text-blue-600 p-2"
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<div class="md:hidden border-t border-slate-200 bg-white">
			<div class="px-4 py-3 space-y-3">
				<a 
					href="/" 
					onclick={() => mobileMenuOpen = false}
					class="block text-slate-700 hover:text-blue-600 font-medium py-2 transition-colors"
				>
					Home
				</a>
				<a 
					href="/blogs" 
					onclick={() => mobileMenuOpen = false}
					class="block text-slate-700 hover:text-blue-600 font-medium py-2 transition-colors"
				>
					All Posts
				</a>
			</div>
		</div>
	{/if}
</nav>

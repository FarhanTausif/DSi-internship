<script>
	let { data } = $props();
	
	let searchQuery = $state('');
	let selectedCategory = $state('All');
	
	// Get unique categories
	let categories = $derived(['All', ...new Set(data.posts.map(post => post.category))]);
	
	// Filter posts based on search and category
	let filteredPosts = $derived(
		data.posts.filter(post => {
			const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							  post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">All Blog Posts</h1>
			<p class="text-lg text-slate-600">Explore our collection of articles, tutorials, and insights</p>
		</div>

		<!-- Search and Filter -->
		<div class="bg-white rounded-xl shadow-md p-6 mb-8">
			<div class="flex flex-col md:flex-row gap-4">
				<!-- Search Input -->
				<div class="flex-1">
					<label for="search" class="sr-only">Search posts</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							id="search"
							type="text"
							bind:value={searchQuery}
							class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Search posts..."
						/>
					</div>
				</div>

				<!-- Category Filter -->
				<div>
					<label for="category" class="sr-only">Filter by category</label>
					<select
						id="category"
						bind:value={selectedCategory}
						class="w-full md:w-48 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Results count -->
			<div class="mt-4 text-sm text-slate-600">
				Showing {filteredPosts.length} of {data.posts.length} posts
			</div>
		</div>

		<!-- Posts Grid -->
		{#if filteredPosts.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each filteredPosts as post (post.id)}
					<article
						class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
					>
						<div class="p-6 flex-1 flex flex-col">
							<!-- Meta -->
							<div class="flex items-center justify-between mb-3">
								<span class="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
									{post.category}
								</span>
								<span class="text-sm text-slate-500">{post.readingTime}</span>
							</div>

							<!-- Title -->
							<h2 class="text-xl font-bold text-slate-900 mb-3">
								<a href="/blogs/{post.slug}" class="hover:text-blue-600 transition-colors">
									{post.title}
								</a>
							</h2>

							<!-- Excerpt -->
							<p class="text-slate-600 mb-4 flex-1">
								{post.excerpt}
							</p>

							<!-- Footer -->
							<div class="flex items-center justify-between pt-4 border-t border-slate-100">
								<div class="flex items-center gap-2">
									<div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
										<span class="text-sm font-medium text-slate-700">
											{post.author
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</span>
									</div>
									<div class="text-sm">
										<p class="font-medium text-slate-900">{post.author}</p>
										<p class="text-slate-500">{post.date}</p>
									</div>
								</div>
								<a
									href="/blogs/{post.slug}"
									class="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 group"
								>
									Read
									<svg
										class="w-4 h-4 group-hover:translate-x-1 transition-transform"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-slate-900 mb-2">No posts found</h3>
				<p class="text-slate-600">Try adjusting your search or filter criteria</p>
			</div>
		{/if}
	</div>
</div>

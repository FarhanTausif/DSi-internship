<script>
	import { onMount } from 'svelte';

	let recentPosts = $state([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('/blogs/api/posts');
			const data = await response.json();
			recentPosts = data.posts.slice(0, 3);
		} catch (error) {
			console.error('Error loading posts:', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
	<!-- Hero Section -->
	<section class="py-16 px-4">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Welcome to My Blog</h1>
			<p class="text-xl text-slate-600 mb-8">Exploring ideas, sharing knowledge, and building together</p>
			<a
				href="/blogs"
				class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
			>
				Explore All Posts
			</a>
		</div>
	</section>

	<!-- Recent Posts Section -->
	<section class="py-16 px-4">
		<div class="max-w-6xl mx-auto">
			<h2 class="text-3xl font-bold text-slate-900 mb-10 text-center">Recent Posts</h2>

			{#if loading}
				<div class="flex justify-center items-center py-20">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			{:else if recentPosts.length > 0}
				<div class="grid md:grid-cols-3 gap-8">
					{#each recentPosts as post (post.id)}
						<article
							class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
						>
							<div class="p-6">
								<div class="flex items-center gap-2 mb-3">
									<span class="text-sm text-blue-600 font-medium">{post.category}</span>
									<span class="text-slate-400">•</span>
									<time class="text-sm text-slate-500">{post.date}</time>
								</div>
								<h3 class="text-xl font-bold text-slate-900 mb-3">
									{post.title}
								</h3>
								<p class="text-slate-600 mb-4 line-clamp-3">
									{post.excerpt}
								</p>
								<a
									href="/blogs/{post.slug}"
									class="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
								>
									Read More
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</a>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<p class="text-center text-slate-600">No posts available yet.</p>
			{/if}
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-16 px-4 bg-white">
		<div class="max-w-6xl mx-auto">
			<div class="grid md:grid-cols-3 gap-8">
				<div class="text-center">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-slate-900 mb-2">Quality Content</h3>
					<p class="text-slate-600">Well-researched articles on various topics</p>
				</div>
				<div class="text-center">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h3 class="text-xl font-bold text-slate-900 mb-2">Fast & Modern</h3>
					<p class="text-slate-600">Built with SvelteKit for optimal performance</p>
				</div>
				<div class="text-center">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
							/>
						</svg>
					</div>
					<h3 class="text-xl font-bold text-slate-900 mb-2">Community</h3>
					<p class="text-slate-600">Join discussions and share your thoughts</p>
				</div>
			</div>
		</div>
	</section>
</div>

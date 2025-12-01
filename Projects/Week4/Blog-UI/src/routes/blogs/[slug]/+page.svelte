<script>
	import { marked } from 'marked';
	
	let { data } = $props();
	
	// Convert markdown to HTML using $derived
	let htmlContent = $derived(marked(data.post.content));
</script>

<svelte:head>
	<title>{data.post.title} - Blog</title>
	<meta name="description" content={data.post.excerpt} />
</svelte:head>

<article class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Back Button -->
		<a href="/blogs" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to all posts
		</a>

		<!-- Article Header -->
		<header class="bg-white rounded-xl shadow-md p-8 mb-8">
			<!-- Category and Reading Time -->
			<div class="flex items-center gap-3 mb-4">
				<span class="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
					{data.post.category}
				</span>
				<span class="text-slate-400">•</span>
				<span class="text-sm text-slate-600">{data.post.readingTime}</span>
			</div>

			<!-- Title -->
			<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
				{data.post.title}
			</h1>

			<!-- Author and Date -->
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
					<span class="text-lg font-medium text-slate-700">
						{data.post.author
							.split(' ')
							.map((n) => n[0])
							.join('')}
					</span>
				</div>
				<div>
					<p class="font-medium text-slate-900">{data.post.author}</p>
					<time class="text-sm text-slate-600">{data.post.date}</time>
				</div>
			</div>

			<!-- Tags -->
			<div class="flex flex-wrap gap-2 mt-6">
				{#each data.post.tags as tag}
					<span class="px-3 py-1 text-sm text-slate-600 bg-slate-100 rounded-full">
						#{tag}
					</span>
				{/each}
			</div>
		</header>

		<!-- Article Content -->
		<div class="bg-white rounded-xl shadow-md p-8 mb-8">
			<div class="article-content">
				{@html htmlContent}
			</div>
		</div>

		<!-- Related Posts -->
		{#if data.relatedPosts.length > 0}
			<section class="bg-white rounded-xl shadow-md p-8">
				<h2 class="text-2xl font-bold text-slate-900 mb-6">Related Posts</h2>
				<div class="grid md:grid-cols-3 gap-6">
					{#each data.relatedPosts as post}
						<a href="/blogs/{post.slug}" class="group">
							<article
								class="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
							>
								<span class="text-sm text-blue-600 font-medium">{post.category}</span>
								<h3 class="text-lg font-bold text-slate-900 mt-2 mb-2 group-hover:text-blue-600 transition-colors">
									{post.title}
								</h3>
								<p class="text-sm text-slate-600 line-clamp-2">
									{post.excerpt}
								</p>
							</article>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</article>

<style>
	/* Custom prose styles for markdown content */
	:global(.article-content) {
		color: rgb(51 65 85);
		line-height: 1.75;
	}
	
	:global(.article-content h1) {
		font-size: 1.875rem;
		font-weight: 700;
		color: rgb(15 23 42);
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
	
	:global(.article-content h2) {
		font-size: 1.5rem;
		font-weight: 700;
		color: rgb(15 23 42);
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
	
	:global(.article-content h3) {
		font-size: 1.25rem;
		font-weight: 700;
		color: rgb(15 23 42);
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}
	
	:global(.article-content p) {
		margin-bottom: 1rem;
		line-height: 1.75;
	}
	
	:global(.article-content ul) {
		list-style-type: disc;
		list-style-position: inside;
		margin-bottom: 1rem;
	}
	
	:global(.article-content ul li) {
		margin-bottom: 0.5rem;
	}
	
	:global(.article-content ol) {
		list-style-type: decimal;
		list-style-position: inside;
		margin-bottom: 1rem;
	}
	
	:global(.article-content ol li) {
		margin-bottom: 0.5rem;
	}
	
	:global(.article-content code) {
		background-color: rgb(241 245 249);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: ui-monospace, monospace;
		color: rgb(37 99 235);
	}
	
	:global(.article-content pre) {
		background-color: rgb(15 23 42);
		color: rgb(241 245 249);
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}
	
	:global(.article-content pre code) {
		background-color: transparent;
		color: rgb(241 245 249);
		padding: 0;
	}
	
	:global(.article-content a) {
		color: rgb(37 99 235);
		text-decoration: underline;
	}
	
	:global(.article-content a:hover) {
		color: rgb(29 78 216);
	}
	
	:global(.article-content blockquote) {
		border-left: 4px solid rgb(59 130 246);
		padding-left: 1rem;
		font-style: italic;
		margin: 1rem 0;
		color: rgb(71 85 105);
	}
</style>

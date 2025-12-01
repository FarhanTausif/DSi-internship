import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	const response = await fetch('/blogs/api/posts');
	const data = await response.json();

	const post = data.posts.find((p) => p.slug === params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Get related posts (same category, excluding current post)
	const relatedPosts = data.posts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);

	return {
		post,
		relatedPosts
	};
}

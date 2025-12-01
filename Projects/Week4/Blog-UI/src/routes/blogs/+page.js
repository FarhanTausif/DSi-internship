export async function load({ fetch }) {
	const response = await fetch('/blogs/api/posts');
	const data = await response.json();

	return {
		posts: data.posts
	};
}

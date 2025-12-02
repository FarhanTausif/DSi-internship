<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	import { page } from '$app/stores';
	let isHome = $derived($page.url.pathname === '/')
	let isAbout = $derived($page.url.pathname === '/about')
	let isDashboard = $derived($page.url.pathname.startsWith('/dashboard'))
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- This layout wraps ALL pages in the project -->
<!-- use flex styles in the nav -->
<nav class="p-4 border-b border-amber-500 flex items-center justify-center gap-4">
  <!-- Normal navigation links -->
  <a class= {isHome ? "bg-amber-300 text-black px-3 py-1 rounded" : "hover:border-b-2 hover:border-amber-500"} href="/">
	Home
	</a>
  <a class= {isAbout ? "bg-amber-300 text-black px-3 py-1 rounded" : "hover:border-b-2 hover:border-amber-500"} href="/about">About</a>
  <a class= {isDashboard ? "bg-amber-300 text-black px-3 py-1 rounded" : "hover:border-b-2 hover:border-amber-500"} href="/dashboard">Dashboard</a>
</nav>

<!-- <slot /> is where the child page gets rendered -->
<!-- <slot /> -->

{@render children()}
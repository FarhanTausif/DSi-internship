<script>
	// SvelteKit injects "data" from the load() return value
	// export let data;
	let {data} = $props();
</script>

<div class="flex flex-col items-center p-4 gap-4">
	<h1 class="text-2xl font-bold">Stats Page</h1>

	<!-- Use the loaded data -->
	<p class="italic tracking-wider">Message from server: <span class="font-bold text-red-500">{data.message}</span></p>
	<a
		class="hover:bg-amber-300 border border-black-500 hover:border-none text-black px-3 py-1 rounded font-bold"
		href="/dashboard">Back to Dashboard</a
	>
</div>

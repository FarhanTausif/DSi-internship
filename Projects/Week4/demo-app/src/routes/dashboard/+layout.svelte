<!-- This layout wraps ONLY pages inside /dashboard -->
<script>
    let { children } = $props();
</script>

<div class="p-4 text-center flex flex-col items-center gap-4">
    <h2 class="text-2xl font-bold">Dashboard Layout</h2>
    <p class="italic tracking-wider">This layout wraps all dashboard pages.</p>
</div>

<hr />

<!-- Dashboard sub-pages will render here -->
<!-- <slot /> -->
 {@render children()}
<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="m-10 max-w-prose">
	{@render children()}
</main>

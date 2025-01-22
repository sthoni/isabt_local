<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>IServ-Abwesenheitstool</title>
</svelte:head>
<main class="m-10 max-w-prose">
	{@render children()}
</main>

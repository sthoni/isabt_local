<script lang="ts">
	let { children } = $props();
</script>

<ul class="my-6 ml-6 list-decimal [&>li]:mt-2">
	{@render children()}
</ul>

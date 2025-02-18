<script lang="ts">
	import type { LayoutProps } from './$types';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children }: LayoutProps = $props();
</script>

<main class="flex flex-col min-h-screen">
	<Header />

	<div class="container flex-1">
		{@render children()}
	</div>

	<Footer />
</main>

<style>
	.flex {
		display: flex;
	}

	.flex-col {
		flex-direction: column;
	}

	.min-h-screen {
		min-height: 100vh;
	}

	.flex-1 {
		flex: 1;
	}
</style>

<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import PaginationInfo from '$lib/components/PaginationInfo.svelte';
	import StatsTable from '$lib/components/StatsTable.svelte';

	let { data }: { data: PageData } = $props();

	const goToPage = (page: number) => {
		goto(`?page=${page}&limit=${data.limit}`);
	};

	const updateLimit = (event: Event) => {
		const newLimit = (event.target as HTMLSelectElement).value;
		goto(`?page=${data.page}&limit=${newLimit}`);
	};
</script>

<section>
	<h3>Statistics for <code>{data.shortUrl}</code></h3>
	<hr />

	<p><strong>Total Clicks:</strong> <code>{data.clickCount}</code></p>

	{#if data.stats.length}
		<PaginationInfo
			limit={data.limit}
			total={data.total}
			page={data.page}
			pages={data.pages}
			{updateLimit}
		/>

		<StatsTable stats={data.stats} />

		<Pagination page={data.page} pages={data.pages} {goToPage} />
	{:else}
		<p>No statistics available yet.</p>
	{/if}
</section>

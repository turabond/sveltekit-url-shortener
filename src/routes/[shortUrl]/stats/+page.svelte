<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import PaginationInfo from '$lib/components/PaginationInfo.svelte';
	import StatsTable from '$lib/components/StatsTable.svelte';

	let { data }: { data: PageData } = $props();

	const goToPage = (cursor: string | undefined) => {
		if (cursor === 'restart') goto(`?limit=${data.limit}`);
		if (cursor && cursor !== 'restart') goto(`?cursor=${cursor}&limit=${data.limit}`);
	};

	const updateLimit = (event: Event) => {
		const newLimit = (event.target as HTMLSelectElement).value;
		goto(`?limit=${newLimit}`);
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
			currentPage={data.currentPage}
			totalPages={data.totalPages}
			{updateLimit}
		/>

		<StatsTable stats={data.stats} />

		<Pagination
			prevCursor={data.prevCursor}
			nextCursor={data.nextCursor}
			limit={data.limit}
			{goToPage}
		/>
	{:else}
		<p>No statistics available yet.</p>
	{/if}
</section>

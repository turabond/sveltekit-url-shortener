<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import PaginationInfo from '$lib/components/PaginationInfo.svelte';

	let { data }: { data: PageData } = $props();

	const goToPage = (cursor: string | undefined) => {
		if (cursor === 'restart') goto(`/list?limit=${data.limit}`);
		if (cursor && cursor !== 'restart') goto(`/list?cursor=${cursor}&limit=${data.limit}`);
	};

	const updateLimit = (event: Event) => {
		const newLimit = (event.target as HTMLSelectElement).value;
		goto(`/list?limit=${newLimit}`);
	};
</script>

<section>
	<h3>Shortened Links</h3>
	<hr />

	{#if data.urls.length > 0}
		<PaginationInfo
			limit={data.limit}
			total={data.total}
			currentPage={data.currentPage}
			totalPages={data.totalPages}
			{updateLimit}
		/>
		{#each data.urls as url}
			<article>
				<div>
					<small>Shortened Link:</small>
					<a href={'/' + url} target="_blank">{url}</a>
				</div>
				<div>
					<small>View analytics:</small>
					<a href={'/' + url + '/stats'}>Stats & Click Data</a>
				</div>
			</article>
		{/each}

		<Pagination
			prevCursor={data.prevCursor}
			nextCursor={data.nextCursor}
			limit={data.limit}
			{goToPage}
		/>
	{:else}
		<p>No links available yet.</p>
	{/if}
</section>

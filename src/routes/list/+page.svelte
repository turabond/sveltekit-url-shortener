<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import PaginationInfo from '$lib/components/PaginationInfo.svelte';

	let { data }: PageProps = $props();

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
	<h3>Shortened URLs</h3>
	<hr />

	<PaginationInfo
		limit={data.limit}
		total={data.total}
		currentPage={data.currentPage}
		totalPages={data.totalPages}
		{updateLimit}
	/>

	{#if data.urls.length > 0}
		{#each data.urls as url}
			<article class="short-url-card">
				<div class="url-info">
					<small>Shortened URL:</small>
					<a href={'/' + url} target="_blank" class="short-url">{url}</a>
				</div>
				<div class="actions">
					<small>View analytics:</small>
					<a href={'/' + url + '/stats'} class="stats-btn">Stats & Click Data</a>
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
		<p>No URLs found.</p>
	{/if}
</section>

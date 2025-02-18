<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import PaginationInfo from '$lib/components/PaginationInfo.svelte';

	let { data }: PageProps = $props();

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

	<PaginationInfo
		limit={data.limit}
		total={data.total}
		currentPage={data.currentPage}
		totalPages={data.totalPages}
		{updateLimit}
	/>

	{#if data.stats.length > 0}
		<table>
			<thead>
				<tr>
					<th>Timestamp</th>
					<th>User Agent</th>
					<th>IP</th>
					<th>Location</th>
				</tr>
			</thead>
			<tbody>
				{#each data.stats as { timestamp, userAgent, ip, geo }}
					<tr>
						<td>{new Date(timestamp).toLocaleString()}</td>
						<td>{userAgent || 'Unknown'}</td>
						<td>{ip || 'Unknown'}</td>
						<td>{geo || 'Unknown'}</td>
					</tr>
				{/each}
			</tbody>
		</table>

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

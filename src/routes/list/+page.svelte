<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import PaginationInfo from '$lib/components/PaginationInfo.svelte';

	let { data }: { data: PageData } = $props();

	const goToPage = (page: number) => {
		goto(`/list?page=${page}&limit=${data.limit}`);
	};

	const updateLimit = (event: Event) => {
		const newLimit = (event.target as HTMLSelectElement).value;
		goto(`/list?page=1&limit=${newLimit}`);
	};
</script>

<section>
	<h3>Shortened Links</h3>
	<hr />

	{#if data.links.length > 0}
		<PaginationInfo
			limit={data.limit}
			total={data.total}
			page={data.page}
			pages={data.pages}
			{updateLimit}
		/>

		{#each data.links as link}
			<article>
				<div>
					<small>Shortened Link:</small>
					<a href={'/' + link} target="_blank">{link}</a>
				</div>
				<div>
					<small>View analytics:</small>
					<a href={'/' + link + '/stats'}>Stats & Click Data</a>
				</div>
			</article>
		{/each}

		<Pagination page={data.page} pages={data.pages} {goToPage} />
	{:else}
		<p>No links available yet.</p>
	{/if}
</section>

<script lang="ts">
	interface PaginationProps {
		page: number;
		pages: number;
		goToPage: (page: number) => void;
	}

	let { page, pages, goToPage }: PaginationProps = $props();
</script>

<div class="pagination">
	<button type="button" class="outline" onclick={() => goToPage(page - 1)} disabled={page <= 1}>
		Previous
	</button>

	<button type="button" class="outline" onclick={() => goToPage(page + 1)} disabled={page >= pages}>
		Next
	</button>
</div>

<style>
	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin: 2rem 0;
	}
</style>

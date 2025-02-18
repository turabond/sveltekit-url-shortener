<script lang="ts">
	interface PaginationProps {
		prevCursor?: string;
		nextCursor?: string;
		limit: number;
		goToPage: (cursor?: string) => void;
	}

	let { prevCursor, nextCursor, goToPage }: PaginationProps = $props();
</script>

<div class="pagination">
	<button type="button" class="outline" onclick={() => goToPage(prevCursor)} disabled={!prevCursor}>
		Previous
	</button>

	<button type="button" class="outline" onclick={() => goToPage(nextCursor)} disabled={!nextCursor}>
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

<script lang="ts">
	interface PaginationInfoProps {
		limit: number;
		total: number;
		currentPage: number;
		totalPages: number;
		updateLimit: (event: Event) => void;
	}

	let { limit, total, currentPage, totalPages, updateLimit }: PaginationInfoProps = $props();
</script>

<div class="pagination-info">
	<div class="pagination-info-text">
		<div>
			Total: <code>{total}</code> | Showing <code>{limit}</code> per page | Items Page
			<code>{currentPage}</code>
			of <code>{totalPages}</code>
		</div>
	</div>

	<select
		class="pagination-info-select"
		name="select"
		aria-label="Select limit"
		onchange={updateLimit}
	>
		<option value="5" selected={limit === 5}>5 per page</option>
		<option value="20" selected={limit === 20}>20 per page</option>
		<option value="50" selected={limit === 50}>50 per page</option>
		<option value="100" selected={limit === 100}>100 per page</option>
	</select>
</div>

<style>
	.pagination-info {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-bottom: 1rem;
	}

	.pagination-info-text {
		flex: 1;
		width: 100%;
	}

	.pagination-info-select {
		width: 200px;
		margin: 0;
	}
</style>

<script lang="ts">
	import type { ClickStat } from '$lib/types';

	let { stats }: { stats: ClickStat[] } = $props();
</script>

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
		{#each stats as { timestamp, userAgent, ip, geo }}
			<tr>
				<td>{new Date(timestamp).toLocaleString()}</td>
				<td>{userAgent || 'Unknown'}</td>
				<td>{ip || 'Unknown'}</td>
				<td>{geo || 'Unknown'}</td>
			</tr>
		{/each}
	</tbody>
</table>

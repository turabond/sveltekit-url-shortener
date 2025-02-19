<script lang="ts">
	import { enhance } from '$app/forms';
	import InputField from '$lib/components/InputField.svelte';
	import type { ActionData } from '../../routes/$types';

	let { form, action }: { form: ActionData; action: string } = $props();
	let loading = $state(false);
	let isSuccessful = $derived(form?.shortUrl && form?.success);

	const getError = (field: 'originalUrl' | 'shortUrl') =>
		form?.error?.field === field ? form.error.message : undefined;
	const resetForm = () => (form = null);
</script>

{#if !isSuccessful}
	<form
		method="POST"
		{action}
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				if (result.status === 200) {
					await update({ invalidateAll: true, reset: true });
				} else {
					await update();
				}
				loading = false;
			};
		}}
	>
		<article>
			<InputField type="text" name="originalUrl" label="Long URL" error={getError('originalUrl')} />

			<InputField type="text" name="shortUrl" label="Short URL" error={getError('shortUrl')} />

			<button type="submit" disabled={loading} aria-busy={loading}>Create link</button>
		</article>
	</form>
{:else}
	<article>
		<h4>Short URL Created Successfully!</h4>
		<p>
			<b>Long URL:</b>
			<a href={form?.originalUrl} target="_blank">
				{form?.originalUrl}
			</a>
		</p>

		<p>
			<b>Short Link:</b>
			<a href={`/${form?.shortUrl}`} target="_blank">{form?.shortUrl}</a>
		</p>

		<p>
			<b>View Stats:</b>
			<a href={`/${form?.shortUrl}/stats`} target="_blank">
				{form?.shortUrl}/stats
			</a>
		</p>

		<br />
		<button type="button" class="outline" onclick={resetForm}>Create Another</button>
	</article>
{/if}

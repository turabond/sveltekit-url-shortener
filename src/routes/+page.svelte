<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import InputField from '$lib/components/InputField.svelte';

	type Fields = 'originalUrl' | 'shortUrl';

	let { form }: PageProps = $props();
	let loading = $state(false);

	const getError = $derived(
		(
			field: string,
			error?: {
				field: Fields;
				message: string;
			}
		) => {
			if (field === error?.field) {
				return error.message;
			}
		}
	);

	let isSuccessful = $derived(form?.shortUrl && form?.success);
</script>

<section>
	<h3>Crate link</h3>
	<hr />

	{#if !isSuccessful}
		<form
			method="POST"
			action="?/create"
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
			<InputField
				type="text"
				name="originalUrl"
				label="URL"
				error={getError('originalUrl', form?.error as { field: Fields; message: string })}
			/>

			<InputField
				type="text"
				name="shortUrl"
				label="Short URL"
				error={getError('shortUrl', form?.error as { field: Fields; message: string })}
			/>

			<button type="submit" disabled={loading} aria-busy={loading} aria-label="Please wait…"
				>Create link</button
			>
		</form>
	{/if}

	{#if isSuccessful}
		<article class="success-box">
			<h4>Short URL Created Successfully!</h4>
			<p>
				<b>Original URL:</b>
				<a href={form?.originalUrl} target="_blank" rel="noopener noreferrer">{form?.originalUrl}</a
				>
			</p>
			<p class="short-url">
				<b>Short URL:</b>
				<a href={'/' + form?.shortUrl} target="_blank">/{form?.shortUrl}</a>
			</p>
			<p class="stats-link">
				<b>View Stats:</b>
				<a href={'/' + form?.shortUrl + '/stats'} target="_blank">/{form?.shortUrl}/stats</a>
			</p>
			<button type="button" onclick={() => (form = null)}>Create Another</button>
		</article>
	{/if}
</section>

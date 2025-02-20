<script lang="ts">
	import CreateLinkForm from '$lib/components/CreateLinkForm.svelte';

	let { form } = $props();
</script>

<section>
	<hgroup>
		<h1>URL Shortener</h1>
		<p>Convert long URLs into short, shareable links and track analytics easily.</p>
		<hr />
	</hgroup>

	<article>
		<h6>How It Works:</h6>
		<small>Enter a long URL, e.g.: <code>https://example.com/very/long/url</code></small><br />
		<small>Enter a short URL, e.g.: <code>example</code></small><br />
		<small>Get a shortened and analytics links.</small>
	</article>

	<CreateLinkForm {form} action="?/create" />
</section>

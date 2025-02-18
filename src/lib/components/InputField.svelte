<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface InputFieldProps {
		name: string;
		value?: string;
		label?: string;
		type?: HTMLInputAttributes['type'];
		required?: boolean;
		error?: string;
	}

	let {
		name,
		label,
		value = $bindable(),
		required = false,
		type = 'text',
		error
	}: InputFieldProps = $props();

	let ariaInvalid: HTMLInputAttributes['aria-invalid'] = $derived(
		error === undefined ? error : !!error
	);
</script>

<label for={name}>{label}</label>

<input
	bind:value
	id={name}
	{type}
	{name}
	{required}
	aria-invalid={ariaInvalid}
	aria-describedby="{name}-error-helper"
/>

{#if error}
	<small id="{name}-error-helper">{error}</small>
{/if}

<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Document } from '$lib/model/document';
	import type { SectionDefaultViewState } from '$lib/model/collection';
	import { float, calculateZIndex } from '$lib/view/utils/float.svelte';
	
	let {
		viewState,
		onUnmount,
		animationControlElement = $bindable(),
		isSectionHovered = false
	}: {
		viewState: { 
			state: SectionDefaultViewState
		};
		onUnmount: (elementToPin?: string | null) => void;
		animationControlElement: HTMLDivElement;
		isSectionHovered: boolean;
	} = $props();

	let document = getContext('document') as Document;
	let isHovered = $state(false);

	function showControls() {
		isHovered = true;
	}

	function hideControls() {
		isHovered = false;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={animationControlElement}
	onmouseenter={showControls}
	onmouseleave={hideControls}
	class={[
		'floating-controls p-2 bg-white/80 backdrop-blur-sm shadow-sm rounded',
		isHovered || isSectionHovered ? 'visible' : 'invisible'
	]}
>
	<select 
		bind:value={viewState.state.animation}
	>
		<option value="none">None</option>
		<option value="sparkle">Sparkle</option>
	</select>
</div>

<style lang="postcss">
	.floating-controls {
		position: absolute;
		width: max-content;
		top: 0;
		left: 0;
	}
</style>

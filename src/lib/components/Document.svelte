<script lang="ts">
	import { registry } from '../viewRegistry.svelte';
	import type { Document } from '$lib/model/document';
	import { setContext, type Component } from 'svelte';
	import { page } from '$app/state';
	import { gsap } from 'gsap';
	import Flip from 'gsap/dist/Flip';
	import type { NoHeadingContentSingle } from '../model/collection';
	gsap.registerPlugin(Flip);

	export type Refs = Record<
		string,
		{ element: HTMLElement; animateAbsolute: boolean; animateNested: boolean }
	>;

	let { node }: { node: Document } = $props();
    setContext('document', node);
	let Renderer = $derived(
		registry[node.content.activeView as keyof typeof registry] as Component<{
			node: NoHeadingContentSingle;
			refs: Refs;
			onUnmount: () => void;
		}>
	);
	let refs = $state<Refs>({});

	setContext('document', node);

	let flipState: Flip.FlipState | null = $state(null);

	// Check if we're on a document view page (URL with username and slug parameters)
	const isDocumentViewPage = $derived(!!page.params.username && !!page.params.slug);

	const onUnmount = () => {
		const elements = Object.values(refs)
			.filter((ref) => ref.element)
			.map((ref) => ref.element);
		flipState = Flip.getState(elements);
	};

	$effect(() => {
		if (flipState !== null && node.state.animateNextChange) {
			const groupedRefs = Object.values(refs).reduce(
				(acc, ref) => {
					const key = `${ref.animateAbsolute}-${ref.animateNested}`;
					if (!acc[key]) {
						acc[key] = [];
					}
					acc[key].push(ref.element);
					return acc;
				},
				{} as Record<string, HTMLElement[]>
			);

			// Call Flip.from for each group
			Object.entries(groupedRefs).forEach(([key, elements]) => {
				const [animateAbsolute, animateNested] = key.split('-').map((v) => v === 'true');
				Flip.from(flipState as Flip.FlipState, {
					targets: elements,
					duration: 0.2,
					delay: 0.2,
					ease: 'power4.inOut',
					absolute: animateAbsolute,
					nested: animateNested,
					onStart: () => {
						elements.forEach((element: HTMLElement) => {
							element.style.pointerEvents = 'none';
						});
					},
					onComplete: () => {
						elements.forEach((element: HTMLElement) => {
							element.style.pointerEvents = 'auto';
						});
					},

					onLeave: (elements) => {
						gsap.fromTo(
							elements,
							{ opacity: 1 },
							{ opacity: 0, duration: 0.2, ease: 'power4.inOut' }
						);
					},

					onEnter: (elements) => {
						gsap.fromTo(
							elements,
							{ opacity: 0 },
							{ opacity: 1, duration: 0.2, delay: 0.4, ease: 'power4.inOut' }
						);
					}
				});
			});
		} else {
            node.state.animateNextChange = true;
            flipState = null;
        }
	});
</script>

{#if !isDocumentViewPage}
	<select bind:value={node.state.mode}>
		<option value="write">Write</option>
		<option value="customize">Customize</option>
		<option value="read">Read</option>
	</select>
{/if}

<div class="flex flex-col items-center gap-4">
	<div class=" w-2/3">
		<Renderer bind:node={node.content} {refs} {onUnmount} />
	</div>
</div>

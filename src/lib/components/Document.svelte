<script lang="ts">
	import { registry } from '../viewRegistry.svelte';
	import type { Document } from '$lib/model/document';
	import { setContext, type Component } from 'svelte';
	import { page } from '$app/state';
	import { gsap } from 'gsap';
	import Flip from 'gsap/dist/Flip';
	import type { NoHeadingContentSingle } from '../model/collection';
	import { createDocumentManipulator } from '../documentManipulator.svelte';
    import SectionWrite from '$lib/view/collection/section/write/Write.svelte';
    import SectionContainerWrite from '$lib/view/collection/section-container/Write.svelte';

	gsap.registerPlugin(Flip);

	export type Refs = Record<
		string,
		{ element: HTMLElement; animateAbsolute: boolean; animateNested: boolean }
	>;

	let { node }: { node: Document } = $props();
	const documentManipulator = createDocumentManipulator(node);
	setContext('document', node);
	setContext('documentManipulator', documentManipulator);

	let Renderer = $derived(
		registry[node.content.activeView as keyof typeof registry] as Component<{
			path: (string | number)[];
			refs: Refs;
			onUnmount: () => void;
		}>
	);
	let refs = $state<Refs>({});

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

    $inspect(node)
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
        {#if node.state.mode !== 'write'}
            <Renderer path={['content']} {refs} {onUnmount} />
        {:else}
            {#if node.content.type === 'section'}
                <SectionWrite path={['content']} {refs} {onUnmount} />
            {:else if node.content.type === 'section-container'}
                <SectionContainerWrite path={['content']} {refs} {onUnmount} />
            {/if}
        {/if}
	</div>
</div>

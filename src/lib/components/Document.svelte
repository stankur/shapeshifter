<script lang="ts">
	import { registry } from '../viewRegistry.svelte';
	import type { Document } from '$lib/model/document';
	import { setContext, type Component } from 'svelte';
	import { page } from '$app/state';
	import { gsap } from 'gsap';
	import Flip from 'gsap/dist/Flip';
	import ScrollToPlugin from 'gsap/dist/ScrollToPlugin';
	import type { NoHeadingContentSingle } from '../model/collection';
	import { createDocumentManipulator } from '../documentManipulator.svelte';
	import SectionWrite from '$lib/view/collection/section/write/Write.svelte';
	import SectionContainerWrite from '$lib/view/collection/section-container/Write.svelte';
	import { Toggle } from 'flowbite-svelte';
	import { createDeviceContext } from '$lib/services/deviceContext.svelte';

	gsap.registerPlugin(Flip, ScrollToPlugin);

	export type Refs = Record<string, { element: HTMLElement }>;
	// Create and initialize device context
	const { deviceState, initialize: initializeDeviceContext } = createDeviceContext();
	initializeDeviceContext();
	setContext('deviceContext', deviceState);

	let writerContext = $state({ showSummary: true });

	let { node: document }: { node: Document } = $props();
	const node = $state(document);
	const documentManipulator = createDocumentManipulator(node);
	setContext('document', node);
	setContext('documentManipulator', documentManipulator);
	setContext('writerContext', writerContext);

	let Renderer = $derived(
		registry[node.content.activeView as keyof typeof registry] as Component<{
			path: (string | number)[];
			refs: Refs;
			onUnmount: () => void;
		}>
	);
	let refs = $state<Refs>({});
	let elementToPin = $state<{ value: string | null }>({ value: null });
	let pinOffset = $state<{ value: number | null }>({ value: null });

	let flipState: Flip.FlipState | null = $state(null);

	// Check if we're on a document view page (URL with username and slug parameters)
	const isDocumentViewPage = $derived(!!page.params.username && !!page.params.slug);

	const onUnmount = (pinElementId?: string) => {
		// const elements = Object.values(refs)
		// 	.filter((ref) => ref.element)
		// 	.map((ref) => ref.element);
		// flipState = Flip.getState(elements, {
		//     props: "fontSize,lineHeight"
		// });

		if (pinElementId) {
			console.log('pin element id');
			console.log(refs[pinElementId]);
			console.log(refs[pinElementId].element);

			// Store the element's position before the expansion
			if (refs[pinElementId] && refs[pinElementId].element) {
				const rect = refs[pinElementId].element.getBoundingClientRect();
				pinOffset.value = rect.top; // Store the current position from the top of the viewport

				console.log('pinoffset value: ' + pinOffset.value);
			}
			elementToPin.value = pinElementId;
		}
	};

	$effect(() => {
		console.log('in effect out');

		if (elementToPin.value && refs[elementToPin.value] && refs[elementToPin.value].element) {
			console.log('in effect');
			const targetElement = refs[elementToPin.value].element;
			
			// First scroll to the element
			gsap.set(window, {
				scrollTo: {
					y: targetElement,
					offsetY: pinOffset.value || 0
				}
			});
            
							gsap.fromTo(targetElement, 
								{ 
									backgroundImage: "linear-gradient(45deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%)",
									backgroundSize: "200% 100%",
									backgroundPosition: "-100% 0",
									backgroundRepeat: "no-repeat",
								},
								{
									backgroundPosition: "200% 0",
									duration: 0.5,
									ease: "power1.inOut",
									onComplete: () => {
										// Clean up the effect when done
										gsap.set(targetElement, { clearProps: "background" });
									}
								}
							);
            
			// Reset elementToPin and pinOffset after use
			elementToPin.value = null;
			pinOffset.value = null;
		}
	});

	// $effect(() => {
	// 	if (flipState !== null && node.state.animateNextChange) {
	// 		const elements = Object.values(refs).map(ref => ref.element);

	// 		Flip.from(flipState as Flip.FlipState, {
	// 			targets: elements,
	// 			duration: 0.2,
	// 			delay: 0.2,
	// 			ease: 'power4.inOut',
	// 			absolute: false,
	// 			nested: false,
	// 			onStart: () => {
	// 				elements.forEach((element: HTMLElement) => {
	// 					element.style.pointerEvents = 'none';
	// 				});
	// 			},
	// 			onComplete: () => {
	// 				elements.forEach((element: HTMLElement) => {
	// 					element.style.pointerEvents = 'auto';
	// 				});
	// 			},

	// 			onLeave: (elements) => {
	// 				gsap.fromTo(
	// 					elements,
	// 					{ opacity: 1 },
	// 					{ opacity: 0, duration: 0.2, ease: 'power4.inOut' }
	// 				);
	// 			},

	// 			onEnter: (elements) => {
	// 				gsap.fromTo(
	// 					elements,
	// 					{ opacity: 0 },
	// 					{ opacity: 1, duration: 0.2, delay: 0.4, ease: 'power4.inOut' }
	// 				);
	// 			}
	// 		});
	// 	} else {
	// 		node.state.animateNextChange = true;
	// 		flipState = null;
	// 	}
	// });

	$inspect(node);
</script>

<div class="flex gap-7">
	{#if !isDocumentViewPage}
		<select bind:value={node.state.mode}>
			<option value="write">Write</option>
			<option value="customize">Customize</option>
			<option value="read">Read</option>
		</select>
	{/if}
	<Toggle
		checked={writerContext.showSummary}
		onchange={() => {
			writerContext.showSummary = !writerContext.showSummary;
		}}
	/>
</div>

<div class="flex flex-col items-center gap-4">
	<div class="w-5/6 md:w-2/3">
		{#if node.state.mode !== 'write'}
			<Renderer path={['content']} {refs} {onUnmount} />
		{:else if node.content.type === 'section'}
			<SectionWrite path={['content']} {refs} {onUnmount} />
		{:else if node.content.type === 'section-container'}
			<SectionContainerWrite path={['content']} {refs} {onUnmount} />
		{/if}
	</div>
</div>

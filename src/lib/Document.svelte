<script lang="ts">
	import { registry } from './viewRegistry.svelte';
	import type { Document } from '$lib/model/document';
	import { type Component } from 'svelte';

	import { gsap } from 'gsap';
	import Flip from 'gsap/dist/Flip';
	gsap.registerPlugin(Flip);

	export type Refs = Record<
		string,
		{ element: HTMLElement; animateAbsolute: boolean; animateNested: boolean }
	>;

	let { node }: { node: Document } = $props();
	let Renderer = $derived(
		registry[node.activeView as keyof typeof registry] as Component<{
			node: Document;
			refs: Refs;
			onUnmount: () => void;
		}>
	);
	let refs = $state<Refs>({});

	let flipState: Flip.FlipState | null = $state(null);

	const onUnmount = () => {
		const elements = Object.values(refs)
			.filter((ref) => ref.element)
			.map((ref) => ref.element);
		flipState = Flip.getState(elements);
		console.log('before flip ids');
		console.log(elements.map((e) => e.getAttribute('data-flip-id')));
	};

	$effect(() => {
		const currentTargets = Object.values(refs)
			.filter((ref) => ref.element)
			.map((ref) => ref.element);
		console.log('after flip ids');
		console.log(currentTargets.map((e) => e.getAttribute('data-flip-id')));

		if (flipState !== null) {
			// Group elements by animateAbsolute and animateNested properties
			console.log('refs:');
			console.log($state.snapshot(refs));
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
					duration: 0.5,
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
							{ opacity: 1, duration: 0.2, delay: 0.7, ease: 'power4.inOut' }
						)
					}
				})
			});
		}
	});
</script>

<div class="flex justify-center">
	<div class="w-3/4">
		<Renderer {node} {refs} {onUnmount} />
	</div>
</div>

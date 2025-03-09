<script lang="ts">
	import { defaultMarkdownParser, schema } from 'prosemirror-markdown';
	import { exampleSetup } from 'prosemirror-example-setup';
	import { DOMParser, Node } from 'prosemirror-model';

	import type { ContentParagraph } from '$lib/model/content';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { onMount } from 'svelte';
	import Flip from 'gsap/dist/Flip';
	let {
		node,
		refs,
        additionalFlipId
	}: {
		node: ContentParagraph;
		refs: Record<
			string,
			{ element: HTMLElement; animateAbsolute: boolean; animateNested: boolean }
		>;
		additionalFlipId?: string;
	} = $props();
	let { content } = $derived(node);
	let doc: Node = $derived(defaultMarkdownParser.parse(content));
	let state = $derived(
		EditorState.create({
			schema,
			doc,
			plugins: exampleSetup({
				schema,
				menuBar: false
			})
		})
	);
	let view: EditorView;
	let ref: HTMLDivElement;

	onMount(() => {
		console.log('I just got mounted baybeh');
		view = new EditorView(ref, {
			state,
			nodeViews: {
				paragraph() {
					const dom = document.createElement('p');
					dom.setAttribute('data-flip-id', node.id + (additionalFlipId ? `-${additionalFlipId}` : ''));

					refs[node.id] = { element: dom, animateAbsolute: false, animateNested: false };

					return {
						dom,
						contentDOM: dom,
						destroy() {
							delete refs[node.id];
						}
					};
				}
			},
			editable() {
				return false;
			},
			dispatchTransaction(transaction) {
				const newState = view.state.apply(transaction);

				node.content = newState.doc.textContent;

				view.updateState(newState);
			},
			domParser: DOMParser.fromSchema(state.schema)
		});

		setTimeout(() => {
			ref.onmouseenter = () => {
				view.setProps({ editable: () => true });
			};
		}, 1000);

		return () => {
			if (view) {
				console.log('View for ' + content + ' just got destroyed through unmount');
				view.destroy();
			}
		};
	});
</script>
	<!-- onmouseenter={() => {
		if (refs[node.id] &&!Flip.isFlipping(refs[node.id].element)) {
			console.log('yoohoo paragraph');
			view.setProps({ editable: () => true });
		}
	}} -->

<div
	onclick={(e) => {
		e.stopPropagation();
	}}
	class="prose-p:inline-block"
	bind:this={ref}
></div>

<svelte:document
	onclick={() => {
		view.setProps({ editable: () => false });
	}}
/>

<script lang="ts">
	import { defaultMarkdownParser, defaultMarkdownSerializer, schema } from 'prosemirror-markdown';
	import { exampleSetup } from 'prosemirror-example-setup';
	import { DOMParser, Node } from 'prosemirror-model';

	import type { ContentParagraph } from '$lib/model/content';
	import { EditorState, Plugin } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { getContext, onMount } from 'svelte';
	import { separate } from '$lib/services/prosemirror';
	import type { Document } from '$lib/model/document';

	type Props = {
		node: ContentParagraph;
		refs: Record<
			string,
			{ element: HTMLElement; animateAbsolute: boolean; animateNested: boolean }
		>;
		additionalFlipId?: string;
		updateParent: () => void;
		onUnmount: () => void;
		onSplit: (blocks: [string, string]) => void;
	};
	let {
		node = $bindable<ContentParagraph>(),
		refs,
		additionalFlipId,
		updateParent,
		onUnmount,
		onSplit
	}: Props = $props();
	// let enterPressed = $state<boolean>(false);
	let { content } = $derived(node);
	let documentNode: Document = getContext('document');
	let doc: Node = $derived(defaultMarkdownParser.parse(content));
	let defaultPlugins = $state<Plugin[]>(
		exampleSetup({
			schema,
			menuBar: false
		})
	);

	let editorState = $derived(
		EditorState.create({
			schema,
			doc,
			plugins: defaultPlugins
		})
	);
	let view: EditorView;
	let ref: HTMLDivElement;

	onMount(() => {
		console.log('I just got mounted baybeh for ' + content);
		view = new EditorView(ref, {
			state: editorState,
			nodeViews: {
				paragraph() {
					const dom = document.createElement('p');
					dom.setAttribute(
						'data-flip-id',
						node.id + (additionalFlipId ? `-${additionalFlipId}` : '')
					);

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
				console.log('transaction steps:');
				console.log(transaction.steps);
				onUnmount();

				// console.log("enter pressed state:");
				// console.log(enterPressed);

				const blocks = separate(newState.doc);
				console.log('blocks: ');
				console.log(blocks);
				// enterPressed &&
				if (blocks.length > 1) {
					console.log('splitting');
					onSplit([blocks[0], blocks[1]]);
					return;
				}

				documentNode.state.animateNextChange = false;
				node.content = defaultMarkdownSerializer.serialize(newState.doc);

				view.updateState(newState);
			},
			domParser: DOMParser.fromSchema(editorState.schema)
		});

		$effect(() => {
			if (documentNode.state.mode !== 'read') {
				// When not in read mode, set up the mouseenter handler after a delay
				const timeoutId = setTimeout(() => {
					ref.onmouseenter = () => {
						view.setProps({ editable: () => true });
					};
				}, 800);

				// Return cleanup function to clear timeout if effect reruns
				return () => clearTimeout(timeoutId);
			} else {
				// When in read mode, remove the mouseenter handler
				ref.onmouseenter = null;
				view.setProps({ editable: () => false });
			}
		});

		return () => {
			if (view) {
				// console.log('View for ' + content + ' just got destroyed through unmount');
				view.destroy();
			}
		};
	});
</script>

<div
	onclick={(e) => {
		if (documentNode.state.mode !== 'read') {
			e.stopPropagation();
		}
	}}
	class="mt-6 leading-7 first:mt-0"
	bind:this={ref}
></div>

<svelte:document
	onclick={() => {
		view.setProps({ editable: () => false });
	}}
/>

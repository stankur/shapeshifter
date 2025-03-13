<script lang="ts">
	import type { ContentHeading } from '$lib/model/content';
	import { defaultMarkdownParser, schema } from 'prosemirror-markdown';
	import { exampleSetup } from 'prosemirror-example-setup';
	import { DOMParser, type Node } from 'prosemirror-model';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { onMount } from 'svelte';

	const getHeadingSize = (level: number) => {
		switch (level) {
			case 1:
				return 'prose-h1:text-6xl';
			case 2:
				return 'prose-h1:text-4xl';
			case 3:
				return 'prose-h1:text-2xl';
			default:
				return 'prose-h1:text-xl';
		}
	};

	let {
		node,
		refs,
        onUnmount,
        additionalFlipId
	}: {
		node: ContentHeading;
		refs: Record<
			string,
			{ element: HTMLElement; animateAbsolute: boolean; animateNested: boolean }
		>;
		onUnmount: () => void;
		additionalFlipId?: string;
	} = $props();
	let { content, level } = $derived(node);

	let headingContent = $derived(`# ${content}`);
	let headingSize = $derived(getHeadingSize(level));

	let doc: Node = $derived(defaultMarkdownParser.parse(headingContent));
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
	let ref: HTMLElement;

	onMount(() => {
		view = new EditorView(ref, {
			state,
			dispatchTransaction(transaction) {
				const newState = view.state.apply(transaction);
				onUnmount();

                node.content = newState.doc.textContent;

				view.updateState(newState);
			},
			nodeViews: {
				heading() {
                    const id = node.id + (additionalFlipId ? `-${additionalFlipId}` : '');
					const dom = document.createElement('h1');
					dom.setAttribute('data-flip-id', id);

					console.log("yo I'm in the heading node view for: " + content + " with id: " + id);

					refs[id] = { element: dom, animateAbsolute: false, animateNested: false };

					return {
						dom,
						contentDOM: dom,
						destroy: () => {
							delete refs[id];
						}
					};
				}
			},
			editable() {
				return false;
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
				view.destroy();
			}
		};
	});


</script>

<div
	bind:this={ref}
	onclick={(e) => {
		e.stopPropagation();
	}}
	class={[headingSize, 'prose-h1:inline-block', 'prose-h1:font-bold']}
></div>

<svelte:document
	onclick={() => {
		view.setProps({ editable: () => false });
	}}
/>

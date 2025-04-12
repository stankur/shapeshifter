<script lang="ts">
	import { defaultMarkdownParser, defaultMarkdownSerializer, schema } from 'prosemirror-markdown';
	import { exampleSetup } from 'prosemirror-example-setup';
	import { DOMParser, Node } from 'prosemirror-model';

	import type { ContentParagraph } from '$lib/model/content';
	import type { Section } from '$lib/model/collection';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { getContext, onMount } from 'svelte';
	import { separate } from '$lib/services/prosemirror';
	import type { Document } from '$lib/model/document';
	import { EditorFocusService } from '$lib/services/editorFocus';
	import type { NavigationHandler } from '$lib/services/navigation/types';
	import { createNavigationPlugin } from '../heading/navigationPlugin';
	import { createBackspacePlugin } from './backspacePlugin';
	import ParagraphControls from './ParagraphControls.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';

	type Props = {
		path: (string | number)[];
		refs: Record<string, { element: HTMLElement }>;
		additionalFlipId?: string;
		updateParent: () => void;
		onUnmount: () => void;
		onSplit: (blocks: [string, string]) => void;
		onJoinWithPrevious?: () => boolean;
		onConvertToHeading?: (paragraphId: string) => void;
		getNextEditable?: NavigationHandler;
		getPrevEditable?: NavigationHandler;
		overrides?: { class?: string };
	};
	let {
		path,
		refs,
		additionalFlipId,
		updateParent,
		onUnmount,
		onSplit,
		onJoinWithPrevious = () => false,
		onConvertToHeading,
		getNextEditable,
		getPrevEditable,
		overrides
	}: Props = $props();

	const defaultOverrides = {
		class: ''
	};
	overrides = { ...defaultOverrides, ...overrides };

	let documentNode: Document = getContext('document');
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = $derived(documentManipulator.getByPath(path) as ContentParagraph);

    // this is used so that when we reset the value of isInternalUpdate, we don't trigger a re update that will run the effect again
	let isInternalUpdate = $state.raw<{value: boolean}>({value: false});
	let { content } = $derived(node);
	let isParagraphHovered = $state(false);

	// Create the plugins array
	const plugins = [
		...exampleSetup({
			schema,
			menuBar: false
		})
	];

	// Add navigation plugin if handlers are provided
	if (getNextEditable || getPrevEditable) {
		plugins.push(createNavigationPlugin(getNextEditable, getPrevEditable, documentNode));
	}

	// Add backspace plugin if onJoinWithPrevious is provided
	plugins.push(createBackspacePlugin(onJoinWithPrevious));

	// Create the editor state
	let editorState = EditorState.create({
		schema,
		doc: defaultMarkdownParser.parse(content),
		plugins
	});

	// Update editor state when content changes
	$effect(() => {
		const newDoc = defaultMarkdownParser.parse(content);
		editorState = EditorState.create({
			schema,
			doc: newDoc,
			plugins
		});

		if (view && !isInternalUpdate.value) {
			view.updateState(editorState);
            return
		}
        isInternalUpdate.value = false;

	});



	let view: EditorView;
	let ref: HTMLDivElement;

	onMount(() => {
		view = new EditorView(ref, {
			state: editorState,
			nodeViews: {
				paragraph() {
					const dom = document.createElement('p');
					dom.setAttribute(
						'data-flip-id',
						node.id + (additionalFlipId ? `-${additionalFlipId}` : '')
					);

					refs[node.id] = { element: dom };

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
				return !documentNode.state.animateNextChange;
			},
			dispatchTransaction(transaction) {
				const newState = view.state.apply(transaction);
				onUnmount();

				// console.log("enter pressed state:");
				// console.log(enterPressed);

				const blocks = separate(newState.doc);
				console.log('blocks: ');
				console.log(blocks);

				if (blocks.length > 1) {
					console.log('splitting');
					onSplit([blocks[0], blocks[1]]);
					return;
				}

				documentNode.state.animateNextChange = false;

				if (transaction.docChanged) {
					isInternalUpdate.value = true;
					node.content = defaultMarkdownSerializer.serialize(newState.doc);
				}

				view.updateState(newState);
			},
			domParser: DOMParser.fromSchema(editorState.schema)
		});

		// Register this editor with the EditorFocusService
		EditorFocusService.register(node.id, view);

		$effect(() => {
			if (documentNode.state.mode !== 'read') {
				// When not in read mode, set up the mouseenter handler after a delay
				const timeoutId = setTimeout(() => {
					ref.onmouseenter = () => {
						// Set this editor as focused in the document state
						documentNode.state.focusedContentId = node.id;
						view.setProps({ editable: () => true });
					};
				}, 800);

				const timeoutId2 = setTimeout(() => {
					view.setProps({
						editable: () => {
							return (
								documentNode.state.focusedContentId === node.id &&
								documentNode.state.mode !== 'read'
							);
						}
					});
				}, 800);

				return () => {
					clearTimeout(timeoutId);
					clearTimeout(timeoutId2);
				};
			} else {
				// When in read mode, remove the mouseenter handler
				ref.onmouseenter = null;
				view.setProps({ editable: () => false });
			}
		});

		return () => {
			if (view && node) {
				// Unregister this editor when it's destroyed
				EditorFocusService.unregister(node.id);
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
	class="relative mt-6 leading-7 first:mt-0 {overrides.class}"
	bind:this={ref}
	onmouseenter={() => (isParagraphHovered = true)}
	onmouseleave={() => (isParagraphHovered = false)}
>
	{#if onConvertToHeading && documentNode.state.mode !== 'read'}
		<ParagraphControls
			{isParagraphHovered}
			{path}
			onConvertToHeading={() => onConvertToHeading(node.id)}
		/>
	{/if}
</div>

<svelte:document
	onclick={() => {
		// Only clear focus if this editor is focused
		if (documentNode.state.focusedContentId === node.id) {
			documentNode.state.focusedContentId = null;
			view.setProps({ editable: () => false });
		}
	}}
/>

<script lang="ts">
	import type { ContentHeading } from '$lib/model/content';
	import { defaultMarkdownParser, schema } from 'prosemirror-markdown';
	import { exampleSetup } from 'prosemirror-example-setup';
	import { DOMParser, type Node } from 'prosemirror-model';
	import { EditorState, type Plugin, Transaction } from 'prosemirror-state';
	import { keymap } from 'prosemirror-keymap';
	import { EditorView } from 'prosemirror-view';
	import { getContext, onMount } from 'svelte';
	import type { Document } from '$lib/model/document';
	import { EditorFocusService } from '$lib/services/editorFocus';
	import type { NavigationHandler } from '$lib/services/navigation/types';
	import { createNavigationPlugin } from './navigationPlugin';
	import { createLevelPlugin } from './levelPlugin';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import SparklesText from '$lib/components/animation/SparklesText.svelte';
	const getHeadingSize = (level: number) => {
		switch (level) {
			case 1:
				return 'prose-h1:text-3xl md:prose-h1:text-6xl';
			case 2:
				return 'prose-h1:text-2xl md:prose-h1:text-4xl';
			case 3:
				return 'prose-h1:text-xl md:prose-h1:text-2xl';
			default:
				return 'prose-h1:text-lg md:prose-h1:text-xl';
		}
	};

	type Props = {
		path: (string | number)[];
		refs: Record<string, { element: HTMLElement }>;
		overrides?: {
			class?: string;
		};
		onUnmount: () => void;
		additionalFlipId?: string;
		getNextEditable: NavigationHandler;
		getPrevEditable: NavigationHandler;
		onLevelIncrease: () => boolean;
		onLevelDecrease: () => boolean;
		onEnterAtEnd: () => boolean;
		onClickReadMode?: () => void;
		animation?: string;
		underline?: boolean;
		showCollapseIcon?: boolean;
	};

	let {
		path,
		refs,
		onUnmount,
		overrides = {},
		additionalFlipId,
		getNextEditable,
		getPrevEditable,
		onLevelIncrease,
		onLevelDecrease,
		onEnterAtEnd,
		onClickReadMode = () => {},
		animation,
		underline,
		showCollapseIcon
	}: Props = $props();

	const defaultOverrides = {
		class: ''
	};
	let mergedOverrides = $derived({ ...defaultOverrides, ...overrides });

	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as ContentHeading;
	let { content, level } = $derived(node);

	let documentNode = getContext('document') as Document;

	let headingContent = $derived(`# ${content}`);
	let headingSize = $derived(getHeadingSize(level));

	// Create the plugins array
	// Create a separate Enter key handler plugin for better debugging
	const enterKeyPlugin = keymap({
		Enter: (state) => {
			console.log('Enter key pressed in heading');
			// Check if cursor is at the end of content
			const { selection } = state;
			const atEnd = selection.$head.pos === state.doc.content.size - 1;

			console.log('Cursor at end:', atEnd);

			if (atEnd) {
				console.log('Calling onEnterAtEnd callback');
				// Call the onEnterAtEnd callback
				return onEnterAtEnd();
			}
			return false;
		}
	});

	// Make sure our Enter key plugin is registered last to have higher priority
	const plugins = [
		enterKeyPlugin,
		...exampleSetup({
			schema,
			menuBar: false
		}),
		createNavigationPlugin(getNextEditable, getPrevEditable, documentNode),
		createLevelPlugin(node, documentNode, onLevelIncrease, onLevelDecrease)
	];

	// Log the plugins to make sure they're registered correctly
	console.log('Heading plugins:', plugins);

	// Create the editor state
	let editorState = EditorState.create({
		schema,
		doc: defaultMarkdownParser.parse(headingContent),
		plugins
	});

	// Update editor state when content changes
	$effect(() => {
		const newDoc = defaultMarkdownParser.parse(`# ${content}`);
		editorState = EditorState.create({
			schema,
			doc: newDoc,
			plugins
		});
	});
	let view: EditorView;
	let ref: HTMLElement;

	onMount(() => {
		view = new EditorView(ref, {
			state: editorState,
			dispatchTransaction(transaction) {
				const newState = view.state.apply(transaction);
				onUnmount();

				documentNode.state.animateNextChange = false;
				node.content = newState.doc.textContent;
				// node.last_modified = new Date().toISOString();
				// updateParent();

				// We don't need this code anymore since we're using the callback pattern

				view.updateState(newState);
			},
			nodeViews: {
				heading() {
					const id = node.id + (additionalFlipId ? `-${additionalFlipId}` : '');
					const dom = document.createElement('h1');
					dom.setAttribute('data-flip-id', id);

					refs[id] = { element: dom };

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
				return !documentNode.state.animateNextChange;
			},
			domParser: DOMParser.fromSchema(schema)
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

				// Return cleanup function to clear timeout if effect reruns
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

{#snippet headingDiv()}
	<div
		bind:this={ref}
		onclick={(e) => {
			e.stopPropagation();
			if (documentNode.state.mode === 'read') {
				onClickReadMode();
			}
		}}
		role="button"
		class={[
			headingSize,
			'flex content-between',
			'prose-h1:inline-block',
			'prose-h1:font-semibold',
			underline &&
				'prose-h1:text-decoration-line prose-h1:underline prose-h1:decoration-gray-400 prose-h1:decoration-1 prose-h1:underline-offset-2',
			'wrap-anywhere',
			mergedOverrides.class,
			documentNode.state.mode === 'read' && 'cursor-pointer select-none',
			documentNode.state.mode === 'read' && showCollapseIcon && 'show-collapse-icon'
		]}
	></div>
{/snippet}

{#if animation === 'sparkle' && documentNode.state.mode === 'read'}
	<SparklesText>
		{@render headingDiv()}
	</SparklesText>
{:else}
	{@render headingDiv()}
{/if}
<svelte:document
	onclick={() => {
		// Only clear focus if this editor is focused
		if (documentNode.state.focusedContentId === node.id) {
			documentNode.state.focusedContentId = null;
			view.setProps({ editable: () => false });
		}
	}}
/>

<style>
    /* yeah these below, I actually don't fully know, it was generated by cline, but it works to show the icon. Might be worth to verify if everything is necessary */
	.show-collapse-icon :global(h1)::after {
		content: "";
		display: inline-block;
		width: 24px;
		height: 24px;
		margin-left: 16px;
		vertical-align: middle;
		background-color: #cfcfcf; /* text-gray-400 equivalent */
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M9 9H3V7h4V3h2zm0 6H3v2h4v4h2zm12 0h-6v6h2v-4h4zm-6-6h6V7h-4V3h-2z'/%3E%3C/svg%3E");
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M9 9H3V7h4V3h2zm0 6H3v2h4v4h2zm12 0h-6v6h2v-4h4zm-6-6h6V7h-4V3h-2z'/%3E%3C/svg%3E");
		-webkit-mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
	}
</style>

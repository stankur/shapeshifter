import { sectionContainer, sectionContainerCardViewState } from '$lib/model/collection';
import type { Refs } from '$lib/components/Document.svelte';
import type { NavigationHandler } from '$lib/services/navigation/types';
import type { Document } from '$lib/model/document';
import type { z } from 'zod';
import { addSection } from '$lib/actions/collection/section-container.svelte';

// Define component types with navigation props
export type HeadingComponentProps = {
	path: (string | number)[];
	refs: Refs;
	onUnmount: () => void;
	updateParent?: () => void;
	getNextEditable?: NavigationHandler;
	getPrevEditable?: NavigationHandler;
	overrides?: {
		class?: string;
	};
	onClickReadMode?: () => void;
	documentNode?: Document;
};

export type ContentComponentProps = {
	path: (string | number)[];
	refs: Refs;
	onUnmount: () => void;
	overrides?: {
		class?: string;
	};
	updateParent?: () => void;
	onSplit?: (blocks: [string, string]) => void;
	getNextEditable?: NavigationHandler;
	getPrevEditable?: NavigationHandler;
	documentNode?: Document;
};

export type SectionContainerType = z.infer<typeof sectionContainer>;
export type SectionContainerViewStateType = z.infer<typeof sectionContainerCardViewState>;

// Function to handle read mode toggle
export function handleReadModeToggle(
	sectionIndex: number,
	node: SectionContainerType,
	document: Document,
	onUnmount: () => void
) {
	// toggle the state in the default view, not change it to the default view. Change the state in the default view.
	const defaultView = node.children[sectionIndex].view.find(
		(v) => v.type === 'collection/section/default'
	);
	if (defaultView) {
		document.state.animateNextChange = true;
		onUnmount();
		defaultView.state = defaultView.state === 'expanded' ? 'summary' : 'expanded';
	}
}

// Function to handle adding a section
export function handleAddSection(
	node: SectionContainerType,
	onUnmount: () => void
) {
	onUnmount();
	addSection(node, node.children[0].heading.level, "summary");
}

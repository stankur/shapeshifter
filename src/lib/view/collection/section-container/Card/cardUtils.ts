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
	onUnmount: (elementToPin?: string | null) => void;
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
	onUnmount: (elementToPin?: string | null) => void;
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

// Function to expand all sections in a section container
export function expandAllSections(
	node: SectionContainerType,
	document: Document,
	onUnmount: (elementToPin?: string | null) => void
) {
	document.state.animateNextChange = true;
	onUnmount();

	// Set all sections to expanded state
	node.children.forEach((child) => {
		const defaultView = child.view.find((v) => v.type === 'collection/section/default');
		if (defaultView) {
			defaultView.state.state = 'expanded';
		}
	});
}

// Function to collapse all sections in a section container
export function collapseAllSections(
	node: SectionContainerType,
	document: Document,
	onUnmount: (elementToPin?: string | null) => void
) {
	document.state.animateNextChange = true;
	onUnmount();

	// Set all sections to summary state
	node.children.forEach((child) => {
		const defaultView = child.view.find((v) => v.type === 'collection/section/default');
		if (defaultView) {
			defaultView.state.state = 'summary';
		}
	});
}

// Function to handle adding a section
export function handleAddSection(
	node: SectionContainerType,
	onUnmount: (elementToPin?: string | null) => void
) {
	onUnmount();
	addSection(node, node.children[0].heading.level, 'summary');
}

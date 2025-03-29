import type { Document } from '$lib/model/document';
import type { Section, SectionContainer } from '$lib/model/collection';
import { sectionContainer } from '$lib/model/collection';
import { EditorFocusService } from '$lib/services/editorFocus';
import { tick } from 'svelte';
import { createSectionContainer } from './section-container.svelte';
import type { ContentParagraph } from '$lib/model/content';

export async function splitParagraph(
	node: Section,
	arr: 'summary' | 'children',
	newBlocks: [string, string],
	document: Document,
	i: number
) {
	document.state.animateNextChange = false;
	let newId: string | null = null;

	if (node[arr][i].type === 'paragraph') {
		console.log('new blocs length: ', newBlocks.length);
		for (let j = 0; j < newBlocks.length; j++) {
			if (j === 0) {
				node[arr][i].content = newBlocks[0];
				node[arr][i].last_modified = new Date().toISOString();
			} else {
				newId = crypto.randomUUID();

				node[arr].splice(i + 1, 0, {
					type: 'paragraph',
					id: newId,
					created: new Date().toISOString(),
					last_modified: new Date().toISOString(),
					view: node[arr][i].view,
					activeView: node[arr][i].activeView,
					content: newBlocks[1]
				});
			}
		}

		node.last_modified = new Date().toISOString();

		await tick();

		if (newId) {
			EditorFocusService.focus(newId, document);
		}
	}
}

/**
 * Handles the restructuring when a heading level increases by 1
 *
 * @param node The section whose heading level would increase
 * @param findParentSection A callback to find a parent section with the appropriate level
 * @param onSectionMoved A callback to notify when the section has been moved
 * @returns True if the level change should be allowed, false otherwise
 */
export function handleHeadingLevelIncrease(
	node: Section,
	findParentSection: (level: number) => Section | null,
	onSectionMoved: (sectionId: string) => void
): boolean {
	const currentLevel = node.heading.level;
	const newLevel = currentLevel + 1;

	// Find a section with level one less than the new level
	const parentSection = findParentSection(currentLevel);

	// If no parent found, prevent the change
	if (!parentSection) return false;

	// Increase the heading level
	console.log('increasing level of section');
	node.heading.level = newLevel;

	// Check if the last child of the parent section is a section container
	const lastChild =
		parentSection.children.length > 0
			? parentSection.children[parentSection.children.length - 1]
			: null;

	try {
		// Use the Zod schema to validate if the last child is a section container
		if (lastChild && sectionContainer.safeParse(lastChild).success) {
			// If the last child is a section container, add the section to it
			console.log('adding section to existing section container');
			(lastChild as SectionContainer).children.push(node);
			lastChild.last_modified = new Date().toISOString();
		} else {
			// If the last child is not a section container, create a new one
			console.log('creating new section container');
			const newContainer = createSectionContainer();
			newContainer.children.push(node);

			// Add the new container to the parent section
			console.log('adding new section container to parent section');
			parentSection.children.push(newContainer);
		}
	} catch {
		// If there's an error with the validation, create a new container
		console.log('error validating section container, creating new one');
		const newContainer = createSectionContainer();
		newContainer.children.push(node);

		// Add the new container to the parent section
		console.log('adding new section container to parent section');
		parentSection.children.push(newContainer);
	}

	// Update timestamps
	node.heading.last_modified = new Date().toISOString();
	parentSection.last_modified = new Date().toISOString();

	// Notify the container that this section has been moved
	console.log('notifying container that section has been moved');
	onSectionMoved(node.id);

	return true;
}

/**
 * Handles Enter key press at the end of a heading
 *
 * @param node The section containing the heading
 * @param document The document node
 * @returns True if the event was handled, false otherwise
 */
export function handleEnterInHeading(node: Section, document: Document): boolean {
	// Get the section state
	const viewStateIndex = node.view.findIndex((v) => v.type === node.activeView);
	const viewState = node.view[viewStateIndex];

	if (!viewState || viewState.type !== 'collection/section/default') {
		return false;
	}

	const state = viewState.state;

	// Create a new empty paragraph
	const newParagraphId = crypto.randomUUID();
	const newParagraph: ContentParagraph = {
		type: 'paragraph',
		id: newParagraphId,
		created: new Date().toISOString(),
		last_modified: new Date().toISOString(),
		view: [{ type: 'content/paragraph/default' }],
		content: '',
		activeView: 'content/paragraph/default'
	};

	// Handle based on section state
	if (state === 'expanded') {
		// Add empty paragraph to children
		node.children.unshift(newParagraph);
		node.last_modified = new Date().toISOString();

		EditorFocusService.focus(newParagraphId, document, 'start');

		return true;
	} else if (state === 'summary') {
		// Add empty paragraph to summary
		node.summary.unshift(newParagraph);
		node.last_modified = new Date().toISOString();

		EditorFocusService.focus(newParagraphId, document, 'start');

		return true;
	} else if (state === 'collapsed') {
		// Do nothing for collapsed state
		return true;
	}

	return false;
}

export async function splitSection(
	node: Section,
	paragraphId: string,
	document: Document,
	addSection: (section: Section) => void
) {
	document.state.animateNextChange = false;
	const newId = crypto.randomUUID();

	// find the paragraph in chilren section's content, and then remove the children from everything below that
	// then create a new section with the paragraphId as a heading of the same level as the original section's heading, and the content is everything below that in the below, and addSection
	const paragraphIndex = node.children.findIndex((child) => child.id === paragraphId);

	// confirm parargaph is a contetn of type apragraph
	if (paragraphIndex === -1 || node.children[paragraphIndex].type !== 'paragraph') {
		return;
	}

	const paragraph = node.children[paragraphIndex];

	const newSection: Section = {
		type: 'section',
		id: newId,
		created: new Date().toISOString(),
		last_modified: new Date().toISOString(),
		view: [
			{ type: 'collection/section/default', state: 'expanded' },
			{ type: 'collection/section/static' },
			{ type: 'collection/section/page' }
		],
		heading: {
			type: 'heading',
			id: paragraphId,
			created: paragraph.created,
			last_modified: new Date().toISOString(),
			view: [{ type: 'content/heading/default' }],
			content: paragraph.content,
			level: node.heading.level,
			activeView: 'content/heading/default'
		},
		summary: [
			{
				type: 'paragraph',
				id: crypto.randomUUID(),
				created: new Date().toISOString(),
				last_modified: new Date().toISOString(),
				view: [{ type: 'content/paragraph/default' }],
				content: "New Section's summary",
				activeView: 'content/paragraph/default'
			}
		],
		children: node.children.slice(paragraphIndex + 1),
		activeView: 'collection/section/default'
	};

	node.children = node.children.slice(0, paragraphIndex);
	console.log('removed some from children');

	await tick();

	addSection(newSection);
	console.log('added new section');
}

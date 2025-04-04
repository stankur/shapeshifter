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

// there is a temporary state where the children of a section are not meant to be the children
// so it has to be moved upward to ba direct siblings of the section
function adjustChildren(node: Section, newContainer: SectionContainer) {
    const index = newContainer.children.findIndex((child) => child.id === node.id);
    const sectionContainers = node.children.filter((child) => child.type === 'section-container');
    let sectionSeen = 0;
    for (let i = 0; i < sectionContainers.length; i++) {
        const child = sectionContainers[i];
        const sectionContainer = child as SectionContainer;

        for (let j = 0; j < sectionContainer.children.length; j++) {
            newContainer.children.splice(index + sectionSeen + j + 1, 0, sectionContainer.children[j]);
        }
        sectionSeen += sectionContainer.children.length;
    }

    const sectionContainerIds = sectionContainers.map((child) => child.id);
    node.children = node.children.filter((child) => !sectionContainerIds.includes(child.id));
}

/**
 * Handles the restructuring when a heading level increases by 1
 *
 * @param node The section whose heading level would increase
 * @param findParentSection A callback to find a parent section with the appropriate level in the section container of the node
 * @param removeSectionFromContainer A callback to notify when the section has been moved
 * @returns True if the level change should be allowed, false otherwise
 */
export function handleHeadingLevelIncrease(
	node: Section,
	findParentSection: (level: number) => Section | null,
	removeSectionFromContainer: (sectionId: string) => void
): boolean {
	const currentLevel = node.heading.level;
	const newLevel = currentLevel + 1;

	const parentSection = findParentSection(currentLevel);
	if (!parentSection) return false;

	console.log('increasing level of section');
	node.heading.level = newLevel;

	const lastChild =
		parentSection.children.length > 0
			? parentSection.children[parentSection.children.length - 1]
			: null;

	let newContainer: SectionContainer = createSectionContainer();

	if (lastChild && sectionContainer.safeParse(lastChild).success) {
		newContainer = lastChild as SectionContainer;
		(lastChild as SectionContainer).children.push(node);
		lastChild.last_modified = new Date().toISOString();
	} else {
		parentSection.children.push(newContainer);
        newContainer = parentSection.children[parentSection.children.length - 1] as SectionContainer;
		newContainer.children.push(node);
	}

	node.heading.last_modified = new Date().toISOString();
	parentSection.last_modified = new Date().toISOString();

	removeSectionFromContainer(node.id);
    adjustChildren(node, newContainer);

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

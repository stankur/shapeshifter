import type { Document } from '$lib/model/document';
import type { Section, SectionContainer } from '$lib/model/collection';
import { EditorFocusService } from '$lib/services/editorFocus';
import { tick } from 'svelte';
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
 * adds a new section to the collection with default content for the heading, summary, and content
 *
 * @param node
 * @param headingLevel
 * @returns
 */
export function addSection(node: SectionContainer, headingLevel: number = 1) {
	node.children.push({
		type: 'section',
		id: crypto.randomUUID(),
		created: new Date().toISOString(),
		last_modified: new Date().toISOString(),
		view: [
			{ type: 'collection/section/default', state: 'expanded' },
			{ type: 'collection/section/static' },
			{ type: 'collection/section/page' }
		],
		heading: {
			type: 'heading',
			id: crypto.randomUUID(),
			created: new Date().toISOString(),
			last_modified: new Date().toISOString(),
			view: [{ type: 'content/heading/default' }],
			content: 'New Section',
			level: headingLevel,
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
		activeView: 'collection/section/default',
		children: [
			{
				type: 'paragraph',
				id: crypto.randomUUID(),
				created: new Date().toISOString(),
				last_modified: new Date().toISOString(),
				view: [{ type: 'content/paragraph/default' }],
				content: "New Section's first paragraph",
				activeView: 'content/paragraph/default'
			}
		]
	});
}

export function splitSection(
	node: Section,
	paragraphId: string,
	addSection: (node: Section) => void
) {
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
		summary: [],
		children: node.children.slice(paragraphIndex + 1),
		activeView: 'collection/section/default'
	};

    // remove the paragraph from the original section
    node.children = node.children.slice(0, paragraphIndex);

	addSection(newSection);
}

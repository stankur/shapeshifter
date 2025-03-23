import type { Document } from '$lib/model/document';
import type { Section, SectionContainer } from '$lib/model/collection';
// import { tick } from 'svelte';
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

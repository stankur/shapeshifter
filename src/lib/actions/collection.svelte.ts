import type { Section } from '$lib/model/collection';
import type { Document } from '$lib/model/document';

export function splitParagraph(
	node: Section,
	newBlocks: [string, string],
	document: Document,
	i: number
) {
	document.state.animateNextChange = false;
	if (node.summary[i].type === 'paragraph') {
		for (let j = 0; j < newBlocks.length; j++) {
			if (j === 0) {
				node.summary[i].content = newBlocks[0];
				node.summary[i].last_modified = new Date().toISOString();

				console.log('changed start: ');
				console.log($state.snapshot(node.summary[i]));
			} else {
				node.summary.splice(i + 1, 0, {
					type: 'paragraph',
					id: crypto.randomUUID(),
					created: new Date().toISOString(),
					last_modified: new Date().toISOString(),
					view: node.summary[i].view,
					activeView: node.summary[i].activeView,
					content: newBlocks[1]
				});

				console.log('changed end: ');
				console.log($state.snapshot(node.summary[i + 1]));
			}
		}

		node.last_modified = new Date().toISOString();
	}
}

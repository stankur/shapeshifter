import type { Document } from '$lib/model/document';
import type { Section } from '$lib/model/collection';
export function splitParagraph(
	node: Section,
	arr: "summary" | "children",
	newBlocks: [string, string],
	document: Document,
	i: number
) {
	document.state.animateNextChange = false;
	if (node[arr][i].type === 'paragraph') {
        console.log("new blocs length: ", newBlocks.length);
		for (let j = 0; j < newBlocks.length; j++) {
			if (j === 0) {
				node[arr][i].content = newBlocks[0];
				node[arr][i].last_modified = new Date().toISOString();

				console.log('changed start: ');
				console.log($state.snapshot(node[arr][i]));
			} else {
				node[arr].splice(i + 1, 0, {
					type: 'paragraph',
					id: crypto.randomUUID(),
					created: new Date().toISOString(),
					last_modified: new Date().toISOString(),
					view: node[arr][i].view,
					activeView: node[arr][i].activeView,
					content: newBlocks[1]
				});

				console.log('changed end: ');
				console.log($state.snapshot(node[arr][i + 1]));
			}
		}

		node.last_modified = new Date().toISOString();
	}
}

import { Node } from 'prosemirror-model';

export function separate(doc: Node): string[] {
	const all: string[] = [];

    doc.forEach((node, _, index) => {
        console.log(`node ${index}: `);
        console.log(node);
        all.push(node.textContent);
    });

	return all;
}

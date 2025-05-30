import type { Document } from '$lib/model/document';

export function createDocumentManipulator(state: Document) {
	const document = $state(state);

	function getByPath(path: (string | number)[]) {
		let curr = document as object;

		for (const chunk of path) {
			if (curr) {
				curr = curr[chunk as keyof typeof curr];
			} else {
				console.log('curr is undefined');
			}
		}

		return curr;
	}

	return { getByPath };
}

export type DocumentManipulator = ReturnType<typeof createDocumentManipulator>;

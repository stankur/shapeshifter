import type { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import type { Document } from '$lib/model/document';

export type CursorPosition = 'start' | 'end' | number;

// Create the EditorFocusService using a closure pattern
export const EditorFocusService = (() => {
	// Private state
	const editors = new Map<string, EditorView>();

	// Helper function to check if a DOM element is in the document
	const isElementInDocument = (element: HTMLElement | null): boolean => {
		if (!element) return false;
		return document.contains(element);
	};

	// Return the public API
	return {
		// Register an editor
		register(id: string, view: EditorView) {
			console.log(`Registering editor for ${id}`);
			editors.set(id, view);
		},

		// Unregister an editor
		unregister(id: string) {
			console.log(`Unregistering editor for ${id}`);
			editors.delete(id);
		},

		// Update an existing editor view
		updateView(id: string, view: EditorView) {
			if (editors.has(id)) {
				console.log(`Updating view for ${id}`);
				editors.set(id, view);
				return true;
			}
			console.log(`Cannot update view for ${id} - not found`);
			return false;
		},

		// Focus a specific editor with cursor position
		focus(id: string, documentNode: Document, cursorPosition: CursorPosition = 'start') {
			const view = editors.get(id);
			if (!view) {
				console.log(`View not found for ${id}`);
				return false;
			}

			console.log(`View found for ${id}`);

			try {
				// Check if the DOM element is still in the document
				if (!isElementInDocument(view.dom as HTMLElement)) {
					console.error(`Editor DOM for ${id} is not in the document`);
					return false;
				}

				// Update the document's focusedContentId
				documentNode.state.focusedContentId = id;
				console.log(`Set focusedContentId to ${id}`);

				// Focus the editor
				view.focus();
				console.log(`Focused ${id}`);

				// Set cursor position
				const { state } = view;
				const tr = state.tr;

				let pos: number;
				if (cursorPosition === 'start') {
					pos = 1; // Start of document
				} else if (cursorPosition === 'end') {
					pos = state.doc.content.size - 1; // End of document
				} else {
					pos = Math.min(Math.max(1, cursorPosition), state.doc.content.size - 1);
				}

				tr.setSelection(TextSelection.create(state.doc, pos));
				view.dispatch(tr);

				return true;
			} catch (error) {
				console.error(`Error focusing editor ${id}:`, error);
				return false;
			}
		},

		// Check if an editor's DOM is in the document
		isEditorInDocument(id: string): boolean {
			const view = editors.get(id);
			if (!view) return false;
			return isElementInDocument(view.dom as HTMLElement);
		},

		// Get all registered editor IDs (for debugging)
		getEditorIds() {
			return Array.from(editors.keys());
		},

		// Check if an editor is registered (for debugging)
		hasEditor(id: string) {
			return editors.has(id);
		}
	};
})();

import { keymap } from 'prosemirror-keymap';
import type { Plugin } from 'prosemirror-state';
import { EditorFocusService } from '$lib/services/editorFocus';
import type { NavigationHandler } from '$lib/services/navigation/types';
import type { Document } from '$lib/model/document';

/**
 * Creates a ProseMirror plugin for handling arrow key navigation between content blocks
 *
 * @param getNextEditable Function to get the ID of the next editable block
 * @param getPrevEditable Function to get the ID of the previous editable block
 * @param documentNode The document node to update focus state
 * @returns A ProseMirror plugin for handling navigation
 */
export function createNavigationPlugin(
	getNextEditable?: NavigationHandler,
	getPrevEditable?: NavigationHandler,
	documentNode?: Document
): Plugin {
  return keymap({
    ArrowRight: (state) => {
        console.log('ArrowRight');
			// Check if cursor is at the end of content
			const { selection } = state;
			const atEnd = selection.$head.pos === state.doc.content.size - 1;

            if (atEnd) {
                console.log('atEnd');
            }

            if (getNextEditable) {
                console.log('getNextEditable');
            }

			if (atEnd && getNextEditable) {
				// Find next editable block using provided function
				const nextId = getNextEditable();
				if (nextId && documentNode) {
					// Focus next block with cursor at start
					EditorFocusService.focus(nextId, documentNode, 'start');
					return true;
				}
			}
			return false;
		},

    ArrowLeft: (state) => {
			// Check if cursor is at the beginning of content
			const { selection } = state;
			const atStart = selection.$head.pos === 1;

			if (atStart && getPrevEditable) {
				// Find previous editable block using provided function
				const prevId = getPrevEditable();
				if (prevId && documentNode) {
					// Focus previous block with cursor at end
					EditorFocusService.focus(prevId, documentNode, 'end');
					return true;
				}
			}
			return false;
		}
	});
}

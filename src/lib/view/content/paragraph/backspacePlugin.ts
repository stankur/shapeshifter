import { keymap } from 'prosemirror-keymap';
import type { Plugin } from 'prosemirror-state';

/**
 * Creates a ProseMirror plugin for handling backspace key at the start of content
 * to join with the previous block
 *
 * @param onJoinWithPrevious Callback function to handle joining with previous block
 * @returns A ProseMirror plugin for handling backspace at start
 */
export function createBackspacePlugin(
	onJoinWithPrevious: () => boolean
): Plugin {
	return keymap({
		Backspace: (state) => {
			// Check if cursor is at the beginning of content
			const { selection } = state;
			const atStart = selection.$head.pos === 1;

			if (atStart) {
				console.log('Backspace at start of content');
				// Call the join callback
				return onJoinWithPrevious();
			}
			return false;
		}
	});
}

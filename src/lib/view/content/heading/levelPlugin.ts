import { keymap } from 'prosemirror-keymap';
import type { Plugin } from 'prosemirror-state';
import type { ContentHeading } from '$lib/model/content';
import type { Document } from '$lib/model/document';

/**
 * Creates a ProseMirror plugin for handling heading level changes
 * - Tab/Space at the beginning of a heading increases the level
 * - Backspace at the beginning of a heading decreases the level
 * - Level has a minimum of 1, but no maximum
 * 
 * @param headingNode The heading node to modify
 * @param documentNode The document node to update
 * @returns A ProseMirror plugin for handling heading level changes
 */
export function createLevelPlugin(
  headingNode: ContentHeading,
  documentNode: Document
): Plugin {
  return keymap({
    Tab: (state) => {
      // Check if cursor is at the beginning
      const { selection } = state;
      const atStart = selection.$head.pos === 1;
      
      if (atStart) {
        // Increase heading level (no maximum)
        const newLevel = headingNode.level + 1;
        headingNode.level = newLevel;
        // Trigger UI update
        documentNode.state.animateNextChange = false;
        return true;
      }
      return false;
    },
    
    ' ': (state) => {
      // Similar logic for Space key
      const { selection } = state;
      const atStart = selection.$head.pos === 1;
      
      if (atStart) {
        // Prevent default space insertion at beginning
        const newLevel = headingNode.level + 1;
        headingNode.level = newLevel;
        documentNode.state.animateNextChange = false;
        return true;
      }
      return false;
    },
    
    Backspace: (state) => {
      const { selection } = state;
      const atStart = selection.$head.pos === 1;
      
      if (atStart) {
        // Decrease heading level (min 1)
        const newLevel = Math.max(headingNode.level - 1, 1);
        if (newLevel !== headingNode.level) {
          headingNode.level = newLevel;
          documentNode.state.animateNextChange = false;
          return true;
        }
      }
      return false;
    }
  });
}

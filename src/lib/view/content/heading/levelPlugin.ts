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
 * @param onLevelIncrease Optional callback when level increases, returns whether change is allowed
 * @param onLevelDecrease Optional callback when level decreases, returns whether change is allowed
 * @returns A ProseMirror plugin for handling heading level changes
 */
export function createLevelPlugin(
  headingNode: ContentHeading,
  documentNode: Document,
  onLevelIncrease?: () => boolean,
  onLevelDecrease?: () => boolean
): Plugin {
  return keymap({
    Tab: (state) => {
        console.log("Tab key pressed");
      // Check if cursor is at the beginning
      const { selection } = state;
      const atStart = selection.$head.pos === 1;
      
      if (atStart) {
        // If callback provided, let it determine if change is allowed
        if (onLevelIncrease) {
          const allowed = onLevelIncrease();
          if (!allowed) {
            // If not allowed, revert the level change
            return true; // Consume event but don't change level
          }
        } else {
          // If no callback, just increase the level
          headingNode.level += 1;
        }
        
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
        // If callback provided, let it determine if change is allowed
        if (onLevelIncrease) {
          const allowed = onLevelIncrease();
          if (!allowed) {
            // If not allowed, revert the level change
            return true; // Consume event but don't change level
          }
        } else {
          // If no callback, just increase the level
          headingNode.level += 1;
        }
        
        // Trigger UI update
        documentNode.state.animateNextChange = false;
        return true;
      }
      return false;
    },
    
    Backspace: (state) => {
      const { selection } = state;
      const atStart = selection.$head.pos === 1;
      console.log('in backspace plugin');
      
      if (atStart) {
        console.log('in backspace plugin at start');
        console.log(onLevelDecrease)
        // If callback provided, let it determine if change is allowed
        if (onLevelDecrease) {
          console.log('in backspace plugin at start if onLevelDecrease');
          const allowed = onLevelDecrease();
          console.log('in backspace plugin at start if onLevelDecrease allowed', allowed);
          documentNode.state.animateNextChange = false;
          if (!allowed) {
            return true; // Consume event but don't change level
          }
        }
        
        // Only decrease if level > 1
        if (headingNode.level > 1) {
          headingNode.level -= 1;
          documentNode.state.animateNextChange = false;
          return true;
        }
      }
      return false;
    }
  });
}

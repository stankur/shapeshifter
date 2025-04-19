/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from '$lib/model/document';
import { traverseDocument } from '../utils';

export function createSectionMigrations(registry: any) {
  // Register migration to version 1
  registry.registerStep({
    toVersion: 1,
    migrate: (document: Document) => {
      return traverseDocument(document, {
        section: updateSectionViewState
      });
    }
  });
  
  // Function to update section view state
  function updateSectionViewState(section: any) {
    if (Array.isArray(section.view)) {
      for (let i = 0; i < section.view.length; i++) {
        const viewItem = section.view[i];
        
        if (viewItem.type === 'collection/section/default') {
          // Convert string state to object with state and variation
          if (typeof viewItem.state === 'string') {
            const currentState = viewItem.state;
            viewItem.state = {
              state: currentState,
              variation: 'default'
            };
          } 
          // If it's already an object but missing variation
          else if (typeof viewItem.state === 'object' && !viewItem.state.variation) {
            viewItem.state.variation = 'default';
          }
        }
      }
    }
  }
}

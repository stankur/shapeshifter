/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from '$lib/model/document';
import { traverseDocument } from '../utils';

export function createSectionContainerMigrations(registry: any) {
  // Register migration to version 2
  registry.registerStep({
    toVersion: 2,
    migrate: (document: Document) => {
      return traverseDocument(document, {
        sectionContainer: updateSectionContainerCardViewState
      });
    }
  });
  
  // Function to update section container card view state
  function updateSectionContainerCardViewState(sectionContainer: any) {
    if (Array.isArray(sectionContainer.view)) {
      for (let i = 0; i < sectionContainer.view.length; i++) {
        const viewItem = sectionContainer.view[i];
        
        if (viewItem.type === 'collection/section-container/card') {
          // Add multilevel property if it doesn't exist
          if (viewItem.state && !('multilevel' in viewItem.state)) {
            viewItem.state.multilevel = false;
          }
        }
      }
    }
  }
}

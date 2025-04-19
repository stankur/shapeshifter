/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Migration } from '../types';

export const addSectionVariationMigration: Migration = {
  id: 'section-add-variation-field',
  description: 'Adds the variation field to section default view state',
  apply: (node: any) => {
    if (node.type !== 'section') return false;
    
    let modified = false;
    
    // Find the default view in the view array
    const defaultViewIndex = node.view.findIndex((v: any) => v.type === 'collection/section/default');
    if (defaultViewIndex >= 0) {
      const defaultView = node.view[defaultViewIndex];
      
      // Check if state is a string enum value (old format)
      if (typeof defaultView.state === 'string' && 
          (defaultView.state === 'expanded' || defaultView.state === 'summary')) {
        // Convert string state to object with state and variation properties
        const currentState = defaultView.state;
        defaultView.state = {
          state: currentState,
          variation: 'default'
        };
        modified = true;
      }
    }
    
    return modified;
  }
};

export const sectionMigrations: Migration[] = [
  addSectionVariationMigration,
  // Add other section migrations here as needed
];

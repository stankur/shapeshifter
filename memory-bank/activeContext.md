# Active Context

## Current Focus
We're implementing a path-based component access pattern to replace the two-way binding approach. This change addresses issues with deeply nested objects, where two-way binding creates friction when accessing state from adjacent components. The new approach uses a centralized global reactive state accessed through paths.

## Implementation Approach
1. Enhanced DocumentManipulator
   - Created a centralized document state accessible via paths
   - Implemented `getByPath` function to access nodes by path
   - Leveraged Svelte 5's reactivity for direct mutations

2. Updated component props
   - Changed component props from `node` to `path`
   - Components now receive paths instead of direct node references
   - Child components receive extended paths (e.g., `[...path, 'children', index]`)

3. Maintained reactivity
   - Components retrieve nodes using `documentManipulator.getByPath(path)`
   - Direct mutations to retrieved objects are reactive
   - No need for explicit setters due to Svelte 5's reactivity system

4. Preserved callback patterns
   - Kept existing callback patterns for actions
   - Maintained the component hierarchy pattern
   - Actions still operate on node objects directly

## Recent Changes
- Updated DocumentManipulator with path-based access functionality
- Modified components to use paths instead of direct node references:
  - Section container components (Default, Sidebar, Card, TableOfContents, Tabs)
  - Section components (Default)
  - Content components (Heading, Paragraph)
  - Control components (for Card, TableOfContents, Tabs)
- Maintained existing callback patterns for actions
- Ensured reactivity through direct mutations

## Next Steps
- Continue implementing document structure updates for heading level changes
- Test the path-based approach with complex nested structures
- Optimize performance for large documents
- Update documentation with the new access pattern
- Consider adding debugging tools for path-based access

## Active Decisions
- Using path-based access instead of two-way binding for nested objects
- Centralizing state in the document model
- Leveraging Svelte 5's reactivity system for direct mutations
- Maintaining existing callback patterns for actions
- Following a consistent pattern for component props (paths instead of nodes)

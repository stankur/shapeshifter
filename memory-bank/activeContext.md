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
- Implemented backspace functionality to join blocks when pressing backspace at the start of a block:
  - Created backspacePlugin.ts to detect backspace at the start of content
  - Added joinWithPreviousParagraph function to handle joining paragraphs
  - Updated Paragraph component to use the backspace plugin
  - Implemented onJoinWithPrevious callbacks in Write component for both children and summary paragraphs

## Next Steps
- Test the heading level decrease functionality with complex nested structures
- Address UI update issues (currently requires mode switching to see changes)
- Optimize performance for large documents
- Update documentation with the new access pattern
- Consider adding debugging tools for path-based access
- Fix backspace functionality issues:
  - Empty transaction steps being logged (transaction steps: [])
  - Document being set to wrong version where content is deleted instead of joined
  - Cursor disappearing after backspace operation

## Active Decisions
- Using path-based access instead of two-way binding for nested objects
- Centralizing state in the document model
- Leveraging Svelte 5's reactivity system for direct mutations
- Maintaining existing callback patterns for actions
- Following a consistent pattern for component props (paths instead of nodes)

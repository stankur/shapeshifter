# Active Context

## Current Focus
We're implementing a cursor navigation system for the editor to improve the user experience when moving between content blocks. The current issue is that when typing in one block and pressing Enter, the cursor disappears and doesn't transfer to the next block, requiring manual clicking.

## Implementation Approach
1. Created an EditorFocusService to manage focus between editor instances
   - Uses a closure pattern for encapsulation
   - Maintains a map of content IDs to editor views
   - Provides register/unregister/focus methods

2. Created a navigation system for content blocks
   - Implemented in src/lib/view/content/navigation.ts
   - Provides arrow key navigation between blocks
   - Uses ProseMirror keymap plugin

3. Updated content components to register with EditorFocusService
   - Both Paragraph and Heading components register their editors
   - Components unregister when destroyed

4. Implemented view-specific navigation logic
   - Card view navigation in src/lib/view/collection/section-container/Card/navigation.ts
   - Card view only shows heading and summary (no children)
   - Navigation functions handle moving between sections

## Recent Changes
- Created EditorFocusService to manage focus between editor instances
- Implemented navigation system for content blocks
- Updated Paragraph and Heading components to register with EditorFocusService
- Created Card view navigation logic
- Fixed Card view to only show heading and summary

## Next Steps
- Test the navigation system
- Implement navigation for other view types (Default, TableOfContents, etc.)
- Add keyboard shortcuts for common operations

## Active Decisions
- Using a view-specific approach for navigation logic rather than a centralized service
- Registering editors with EditorFocusService on mount and unregistering on destroy
- Using ProseMirror keymap plugin for handling arrow key navigation

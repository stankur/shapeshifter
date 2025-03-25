# Active Context

## Current Focus
We're implementing document structure updates when heading levels change. This includes:

1. When a heading level increases (e.g., H1 → H2), the section moves up in the hierarchy and becomes a child of a section with a lower heading level.
2. When a heading level decreases (e.g., H2 → H1), the section breaks out of its current container, taking any subsections with higher heading levels with it.

This enhances the document editing experience by maintaining proper hierarchical structure as users modify heading levels.

## Implementation Approach
1. Added heading level change functionality
   - Implemented `handleHeadingLevelIncrease` function in collection.svelte.ts
   - Updated `levelPlugin.ts` to call callbacks when heading levels change
   - Added callback propagation through the component hierarchy

2. Implemented document restructuring for heading level increases
   - Section finds a parent section with the appropriate level
   - Section moves to become a child of that parent section
   - Document structure updates to maintain hierarchy

3. Planned document restructuring for heading level decreases
   - Section will break out of its current container
   - Section will take any subsections with higher heading levels
   - Document structure will update to maintain hierarchy

4. Connected components through the hierarchy
   - Section Container provides findParentSection and onSectionMoved callbacks
   - Section component passes these to the Heading component
   - Heading component triggers the appropriate action when level changes

## Recent Changes
- Implemented `handleHeadingLevelIncrease` function in collection.svelte.ts
- Updated `levelPlugin.ts` to call callbacks when heading levels change
- Added onLevelIncrease callback to Heading component
- Updated Section component to handle heading level increases
- Updated Section Container to provide findParentSection and onSectionMoved callbacks

## Next Steps
- Implement the heading level decrease functionality
- Test both heading level increase and decrease functionality
- Handle edge cases (e.g., first section in a document)
- Update documentation with the new functionality
- Consider adding visual indicators for structure changes

## Active Decisions
- Using specialized callbacks at each level rather than passing generic ones
- Leveraging Svelte 5's reactivity system for direct mutations
- Following a consistent pattern for controls and actions
- Documenting patterns for future feature implementations

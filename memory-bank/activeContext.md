# Active Context

## Current Focus
We're implementing a section split feature that allows users to convert a paragraph into a heading and create a new section from it. This enhances the document editing experience by providing a way to better organize content and create new sections as needed.

## Implementation Approach
1. Created a ParagraphControls component for the UI
   - Shows an "H" button when hovering over a paragraph
   - Uses the floating UI pattern for positioning
   - Follows the established control component pattern

2. Added section splitting functionality
   - Implemented `splitSection` function in collection.svelte.ts
   - Added `addSectionToContainer` function for inserting sections at specific positions
   - Created specialized addSection callbacks for each section

3. Connected components through the hierarchy
   - Section Container passes specialized addSection functions to each section
   - Section component handles the splitSection logic
   - Paragraph component shows controls and triggers the conversion

4. Created comprehensive documentation
   - Added guides for creating controls
   - Added guides for adding new functionality
   - Documented the component hierarchy pattern

## Recent Changes
- Created ParagraphControls component with an "H" button for converting paragraphs to headings
- Added addSectionToContainer function to handle inserting sections at specific positions
- Updated Section Container to pass specialized addSection functions to each section
- Updated Section component to use the splitSection function
- Created documentation in guides/creating-controls.md and guides/adding-functionality.md

## Next Steps
- Test the section split feature
- Implement the ability to customize the heading level for the new section
- Add similar functionality for other content types
- Enhance the UI with animations for section splitting

## Active Decisions
- Using specialized callbacks at each level rather than passing generic ones
- Leveraging Svelte 5's reactivity system for direct mutations
- Following a consistent pattern for controls and actions
- Documenting patterns for future feature implementations

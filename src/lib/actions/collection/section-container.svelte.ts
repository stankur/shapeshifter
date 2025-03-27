import type { Section, SectionContainer } from '$lib/model/collection';

/**
 * Adds an existing section to a container at the specified index
 *
 * @param container The SectionContainer to add the section to
 * @param section The section to add
 * @param index Optional index to insert the section at
 */
export function addSectionToContainer(
	container: SectionContainer,
	section: Section,
	index?: number
) {
	if (index !== undefined && index >= 0 && index <= container.children.length) {
		// Insert at the specified index
		container.children.splice(index, 0, section);
	} else {
		// Add to the end
		container.children.push(section);
	}
	container.last_modified = new Date().toISOString();
}

/**
 * Creates a new section container with default properties
 *
 * @returns A new section container
 */
export function createSectionContainer(): SectionContainer {
	return {
		type: 'section-container',
		id: crypto.randomUUID(),
		created: new Date().toISOString(),
		last_modified: new Date().toISOString(),
		children: [],
		view: [
			{ type: 'collection/section-container/default' },
			{ type: 'collection/section-container/static' },
			{ type: 'collection/section-container/card', state: { perRow: 2, gap: 16 } },
			{ type: 'collection/section-container/brick' },
			{ type: 'collection/section-container/table-of-contents', state: { directions: [] } },
			{
				type: 'collection/section-container/sidebar',
				state: { percentageWidth: 30, activeIndex: 0 }
			},
			{ type: 'collection/section-container/tabs', state: { gap: 16, activeIndex: 0 } }
		],
		activeView: 'collection/section-container/default'
	};
}

/**
 * adds a new section to the collection with default content for the heading, summary, and content
 *
 * @param node
 * @param headingLevel
 * @returns
 */
export function addSection(node: SectionContainer, headingLevel: number = 1) {
	node.children.push({
		type: 'section',
		id: crypto.randomUUID(),
		created: new Date().toISOString(),
		last_modified: new Date().toISOString(),
		view: [
			{ type: 'collection/section/default', state: 'expanded' },
			{ type: 'collection/section/static' },
			{ type: 'collection/section/page' }
		],
		heading: {
			type: 'heading',
			id: crypto.randomUUID(),
			created: new Date().toISOString(),
			last_modified: new Date().toISOString(),
			view: [{ type: 'content/heading/default' }],
			content: 'New Section',
			level: headingLevel,
			activeView: 'content/heading/default'
		},
		summary: [
			{
				type: 'paragraph',
				id: crypto.randomUUID(),
				created: new Date().toISOString(),
				last_modified: new Date().toISOString(),
				view: [{ type: 'content/paragraph/default' }],
				content: "New Section's summary",
				activeView: 'content/paragraph/default'
			}
		],
		activeView: 'collection/section/default',
		children: [
			{
				type: 'paragraph',
				id: crypto.randomUUID(),
				created: new Date().toISOString(),
				last_modified: new Date().toISOString(),
				view: [{ type: 'content/paragraph/default' }],
				content: "New Section's first paragraph",
				activeView: 'content/paragraph/default'
			}
		]
	});
}

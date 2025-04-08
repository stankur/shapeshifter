import type { Section, SectionContainer } from '$lib/model/collection';

/**
 * Moves siblings after a section to be children of that section
 * 
 * @param container The section container
 * @param sectionId The ID of the section
 * @returns The siblings that were moved
 */
export function moveSiblingsToSection(container: SectionContainer, sectionId: string): Section[] {
	const sectionIndex = container.children.findIndex(child => child.id === sectionId);
	if (sectionIndex === -1) return [];
	
	const section = container.children[sectionIndex];
	const siblingsAfter = container.children.slice(sectionIndex + 1);
	
	// Find or create a section container in the section's children
	let sectionContainerIndex = section.children.findIndex(child => child.type === 'section-container');
	
	if (sectionContainerIndex === -1) {
		// Create a new section container and add it to the section's children
		const newContainer = createSectionContainer();
		section.children.push(newContainer);
		sectionContainerIndex = section.children.length - 1;
	}
	
	// Add siblings to the container by directly accessing it through the section's children
	for (const sibling of siblingsAfter) {
		(section.children[sectionContainerIndex] as SectionContainer).children.push(sibling);
	}
	
	// Remove siblings from original container
	container.children.splice(sectionIndex + 1, siblingsAfter.length);
	container.last_modified = new Date().toISOString();
	section.last_modified = new Date().toISOString();
	
	return siblingsAfter;
}

/**
 * Adds a section to a container after a specified section
 * 
 * @param container The section container
 * @param section The section to add
 * @param afterSectionId The ID of the section to add after
 */
export function addSectionAfter(
	container: SectionContainer, 
	section: Section, 
	afterSectionId: string
) {
	const afterIndex = container.children.findIndex(child => child.id === afterSectionId);
	if (afterIndex !== -1) {
		container.children.splice(afterIndex + 1, 0, section);
		container.last_modified = new Date().toISOString();
	}
}

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

export function removeSectionFromContainer(node: SectionContainer, index: number) {
	console.log('removing section from container: ', node.id, index);
	if (index >= 0 && index < node.children.length) {
		console.log('valid and removing section');
		node.children.splice(index, 1);
		console.log('just removed section');

		node.last_modified = new Date().toISOString();
	}
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
			{ type: 'collection/section-container/card', state: {  gap: 16 } },
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

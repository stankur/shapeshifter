import type { Section, SectionContainer } from '$lib/model/collection';
import type { Document } from '$lib/model/document';

// Navigation from content to previous content within the summary
export function getPrevEditableInSummary(section: Section, contentId: string): string | null {
	const index = section.summary.findIndex((item) => item.id === contentId);

	if (index > 0) {
		// Return previous sibling in the summary
		return section.summary[index - 1].id;
	}

	// If at the beginning of summary, go to heading
	if (index === 0) {
		return section.heading.id;
	}

	return null;
}

// Find the next section in a container
function getNextSection(container: SectionContainer, currentSectionId: string): Section | null {
	const index = container.children.findIndex((section) => section.id === currentSectionId);
	if (index >= 0 && index < container.children.length - 1) {
		return container.children[index + 1];
	}
	return null;
}

// Find the previous section in a container
export function getPrevSection(
	container: SectionContainer,
	currentSectionId: string
): Section | null {
	const index = container.children.findIndex((section) => section.id === currentSectionId);
	if (index > 0) {
		return container.children[index - 1];
	}
	return null;
}

// Navigation from the last content of a section to the first content of the next section
export function getNextEditableAcrossSections(
	container: SectionContainer,
	currentSectionId: string
): string | null {
	const nextSection = getNextSection(container, currentSectionId);
	if (nextSection) {
		return nextSection.heading.id;
	}
	return null;
}

// Navigation from the first content of a section to the last content of the previous section
export function getPrevEditableAcrossSections(
	container: SectionContainer,
	currentSectionId: string
): string | null {
	const prevSection = getPrevSection(container, currentSectionId);
	if (prevSection) {
		// If previous section has summary, return the last summary item
		if (prevSection.summary.length > 0) {
			return prevSection.summary[prevSection.summary.length - 1].id;
		}

		// If no summary, return the heading
		return prevSection.heading.id;
	}
	return null;
}

// Helper functions to create navigation props for Card view components

// For headings
export function createHeadingNavProps(
	section: Section,
	container: SectionContainer,
	sectionIndex: number,
	documentNode: Document
) {
	return {
		getNextEditable: () => {
			if (section.summary.length > 0) {
				return section.summary[0].id;
			}
			return null;
		},
		getPrevEditable: () => {
			// If first heading in first section, no previous
			if (sectionIndex === 0) return null;

			// Otherwise, get last content of previous section
			const index = container.children.findIndex((s) => s.id === section.id);
			if (index > 0) {
				const prevSection = container.children[index - 1];
				if (prevSection) {
					// If previous section has summary, return the last summary item
					if (prevSection.summary.length > 0) {
						return prevSection.summary[prevSection.summary.length - 1].id;
					}

					// If no summary, return the heading
					return prevSection.heading.id;
				}
			}
			return null;
		},
		documentNode
	};
}

// For summary content
export function createSummaryNavProps(
	section: Section,
	container: SectionContainer,
	contentId: string,
	sectionIndex: number,
	documentNode: Document
) {
	return {
		getNextEditable: () => {
			// Try to get next in same section
			const index = section.summary.findIndex((item) => item.id === contentId);

			if (index >= 0 && index < section.summary.length - 1) {
				// Return next sibling in the summary
				return section.summary[index + 1].id;
			}

			if (sectionIndex >= 0 && sectionIndex < container.children.length - 1) {
				const nextSection = container.children[sectionIndex + 1];
				if (nextSection) {
                    console.log('nextSection heading id: ', nextSection.heading.id);
                    // Ensure the heading exists and has an ID before returning
                    if (nextSection.heading && nextSection.heading.id) {
                        return nextSection.heading.id;
                    } else {
                        console.error('Next section heading is invalid:', nextSection);
                    }
				}
			}
			return null;
		},
		getPrevEditable: () => {
			// Try to get previous in same section
			const prevInSection = getPrevEditableInSummary(section, contentId);
			if (prevInSection) return prevInSection;

			// If first in section and first section, no previous
			if (sectionIndex === 0) return null;

			// Otherwise, get last content of previous section
			const index = container.children.findIndex((s) => s.id === section.id);
			if (index > 0) {
				const prevSection = container.children[index - 1];
				if (prevSection) {
					// If previous section has summary, return the last summary item
					if (prevSection.summary.length > 0) {
						return prevSection.summary[prevSection.summary.length - 1].id;
					}

					// If no summary, return the heading
					return prevSection.heading.id;
				}
			}
			return null;
		},
		documentNode
	};
}

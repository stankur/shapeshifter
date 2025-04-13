import type { Section } from '$lib/model/collection';
import { processContent } from './shared';

/**
 * Extracts markdown from a section and its children
 * @param section The section to extract markdown from
 * @param level The heading level to start with (default: 1)
 * @returns Markdown string representation of the section
 */
export function extractMarkdownSection(
	section: Section,
	level: number = 1
): string {
	// Start with the section heading
	let markdown = '';

	// Add heading with appropriate level
	const headingMarkers = '#'.repeat(level);
	markdown += `${headingMarkers} ${section.heading.content}\n\n`;

	// Process children content
	if (section.children.length > 0) {
		markdown += processContent(section.children, level);
	}

	return markdown;
}

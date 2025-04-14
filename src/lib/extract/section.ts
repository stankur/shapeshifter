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

/**
 * Extracts markdown from a section's summary content
 * @param section The section to extract summary markdown from
 * @returns Markdown string representation of the section's summary
 */
export function extractSummaryMarkdown(section: Section): string {
	let markdown = "";

	if (section.summary.length > 0) {
		markdown += processContent(section.summary, 1);
	}

	return markdown;
}

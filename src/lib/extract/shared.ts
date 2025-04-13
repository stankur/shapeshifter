import type { NoHeadingContentSingle, Section, SectionContainer } from '$lib/model/collection';
import type { ContentParagraph } from '$lib/model/content';

// Forward declarations to avoid circular dependencies
import { extractMarkdownSection } from './section';

/**
 * Processes section content (children) to markdown
 * @param content Array of content nodes
 * @param level Current heading level for nested sections
 * @returns Markdown string of processed content
 */
export function processContent(content: NoHeadingContentSingle[], level: number): string {
	let markdown = '';

	for (const node of content) {
		if (node.type === 'paragraph') {
			// Process paragraph content
			markdown += `${(node as ContentParagraph).content}\n\n`;
		} else if (node.type === 'section') {
			// Process nested section with incremented level
			markdown += extractMarkdownSection(node as Section, level + 1);
		} else if (node.type === 'section-container') {
			// Process section container
			const container = node as SectionContainer;

			// Process each child section in the container
			for (const childSection of container.children) {
				markdown += extractMarkdownSection(childSection, level + 1);
			}
		} else if (node.type === 'untitled-section') {
			// Process untitled section children with the same level
			if (node.children && node.children.length > 0) {
				markdown += processContent(node.children, level);
			}
		}
	}

	return markdown;
}

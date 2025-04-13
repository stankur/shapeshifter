import type { SectionContainer } from '$lib/model/collection';
import { processContent } from './shared';

/**
 * Extracts markdown from a section container and its children
 * @param container The section container to extract markdown from
 * @param level The heading level to start with (default: 1)
 * @returns Markdown string representation of the section container
 */
export function extractMarkdownSectionContainer(
	container: SectionContainer,
	level: number = 1
): string {
	return processContent(container.children, level - 1);
}

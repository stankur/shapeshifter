import { extractMarkdownSectionContainer } from './section-container';
import { nested, card, sectionContainerTOC } from '$lib/model/examples';
import type { SectionContainer } from '$lib/model/collection';

/**
 * Example function demonstrating how to use the markdown extractor
 * with existing document examples
 */
export function extractExampleMarkdown(): void {
	// Extract markdown from the nested example
	console.log('Extracting markdown from nested example:');
	console.log('--------------------------------------');

	const nestedMarkdown = extractMarkdownSectionContainer(nested.content as SectionContainer);
	console.log(nestedMarkdown);

	// Extract markdown from the card example
	console.log('\nExtracting markdown from card example:');
	console.log('------------------------------------');

	// The card example has multiple sections in a section-container
	const cardMarkdown = extractMarkdownSectionContainer(card.content as SectionContainer);
	console.log(cardMarkdown);

	// Extract markdown from the TOC example (more complex nested structure)
	console.log('\nExtracting markdown from TOC example:');
	console.log('------------------------------------');

	// The TOC example has a deeply nested structure
	const tocMarkdown = extractMarkdownSectionContainer(sectionContainerTOC.content as SectionContainer);

	console.log(tocMarkdown);
}

// Run the example
extractExampleMarkdown();

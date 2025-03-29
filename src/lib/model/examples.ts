import type { z } from 'zod';
import type { Section, sectionContainer } from './collection';
import type { ContentParagraph } from './content';
import type { Document } from './document';
import { type SectionContainer } from '$lib/model/collection';

/**
 * a document with one paragraph
 */
export const simpleParagraph: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: '550e8400-e29b-41d4-a716-446655440000',
	title: 'Simple Paragraph Example',
	slug: 'simple-paragraph-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'paragraph',
		id: '67e55044-10b1-426f-9247-bb680e5fe0c8',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		content: 'This is a simple paragraph with **basic** formatting.',
		view: [{ type: 'content/paragraph/default' }],
		activeView: 'content/paragraph/default'
	}
};

/**
 * a document with one section, no children, no summary
 */
export const simpleSection: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
	title: 'Simple Section Example',
	slug: 'simple-section-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section',
		id: 'c2d10889-457c-4553-9477-a5c3bcdac83c',
		heading: {
			type: 'heading',
			level: 2,
			id: '123e4567-e89b-12d3-a456-426614174000',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			content: 'Card 1',
			view: [{ type: 'content/heading/default' }],
			activeView: 'content/heading/default'
		},
		view: [
			{ type: 'collection/section/default', state: 'collapsed' },
			{ type: 'collection/section/static' },
			{ type: 'collection/section/page' }
		],
		activeView: 'collection/section/default',
		children: [],
		summary: [],
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z'
	}
};

/**
 * a document with one section, one paragraph child, one paragraph summary
 */
export const nested: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
	title: 'Nested Example',
	slug: 'nested-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section-container',
		id: 'f6a7b890-1234-5678-9abc-def012345678',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		view: [
			{ type: 'collection/section-container/default' },
			{ type: 'collection/section-container/static' },
			{ type: 'collection/section-container/card', state: { perRow: 3, gap: 4 } },
			{ type: 'collection/section-container/brick' },
			{
				type: 'collection/section-container/table-of-contents',
				state: {
					directions: [
						{
							type: 'column',
							gap: 72,
							interGenerationGap: 32,
							innerGap: 4,
							innerDirection: 'column'
						},
						{
							type: 'row',
							perRow: 3,
							gap: 16,
							interGenerationGap: 16,
							innerGap: 16,
							innerDirection: 'column'
						}
					]
				}
			},
			{
				type: 'collection/section-container/sidebar',
				state: { percentageWidth: 30, activeIndex: 0 }
			},
			{
				type: 'collection/section-container/tabs',
				state: { gap: 16, activeIndex: 0 }
			}
		],
		activeView: 'collection/section-container/default',
		children: [
			{
				type: 'section',
				id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				view: [
					{ type: 'collection/section/default', state: 'expanded' },
					{ type: 'collection/section/static' },
					{ type: 'collection/section/page' }
				],
				activeView: 'collection/section/default',
				heading: {
					type: 'heading',
					level: 1,
					id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'Main Section',
					view: [{ type: 'content/heading/default' }],
					activeView: 'content/heading/default'
				},
				children: [
					{
						type: 'paragraph',
						id: '936da01f-9abd-4d9d-80c7-02af85c822a8',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						content: 'First child paragraph',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				summary: [
					{
						type: 'paragraph',
						id: 'b7d0d2f8-6584-4af6-a28f-0aec59c6f442',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						content: 'Summary content',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				]
			}
		]
	}
};

/**
 * a document with one section, one paragraph child, one paragraph summary
 */
export const nestedSummary: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: '4f7eb358-c3c1-4c98-9f9c-12d5e5f19c1a',
	title: 'Nested Summary Example',
	slug: 'nested-summary-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section',
		id: '8f9aa33a-8d7c-4cb3-9b3a-c6f8f8f8f8f8',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		view: [
			{ type: 'collection/section/default', state: 'summary' },
			{ type: 'collection/section/static' },
			{ type: 'collection/section/page' }
		],
		activeView: 'collection/section/default',
		heading: {
			type: 'heading',
			level: 1,
			content: 'Main Section',
			id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			view: [{ type: 'content/heading/default' }],
			activeView: 'content/heading/default'
		},
		children: [
			{
				type: 'paragraph',
				id: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				content: 'First child paragraph',
				view: [{ type: 'content/paragraph/default' }],
				activeView: 'content/paragraph/default'
			}
		],
		summary: [
			{
				type: 'paragraph',
				id: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
				content: 'Summary content',
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				view: [{ type: 'content/paragraph/default' }],
				activeView: 'content/paragraph/default'
			}
		]
	}
};

/**
 * a document with one untitled section, a paragraph child and section child, one untitled section child
 */
export const untitled: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
	title: 'Untitled Example',
	slug: 'untitled-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'untitled-section',
		id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		view: [{ type: 'collection/untitled-section/default', state: 'expanded' }, { type: 'static' }],
		activeView: 'static',
		children: [
			{
				type: 'paragraph',
				id: 'f6a7b890-1234-5678-9abc-def012345678',
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				content: 'Content in untitled section',
				view: [{ type: 'content/paragraph/default' }],
				activeView: 'content/paragraph/default'
			},
			{
				type: 'section',
				id: 'a7b89012-3456-789a-bcde-f0123456789a',
				heading: {
					type: 'heading',
					level: 3,
					id: 'b8901234-5678-9abc-def0-123456789abc',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'Nested Section',
					view: [{ type: 'content/heading/default' }],
					activeView: 'content/heading/default'
				},
				view: [
					{ type: 'collection/section/default', state: 'summary' },
					{ type: 'collection/section/static' },
					{ type: 'collection/section/page' }
				],
				activeView: 'collection/section/page',
				children: [],
				summary: [],
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z'
			}
		]
	}
};

export const card: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: 'cdef0123-4567-89ab-cdef-0123456789ab',
	title: 'Card Example',
	slug: 'card-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section-container',
		id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		view: [
			{ type: 'collection/section-container/default' },
			{ type: 'collection/section-container/static' },
			{ type: 'collection/section-container/card', state: { perRow: 3, gap: 16 } },
			{ type: 'collection/section-container/brick' },
			{
				type: 'collection/section-container/table-of-contents',
				state: {
					directions: [
						{
							type: 'column',
							gap: 16,
							interGenerationGap: 16,
							innerGap: 16,
							innerDirection: 'column'
						},
						{
							type: 'row',
							perRow: 3,
							gap: 16,
							interGenerationGap: 16,
							innerGap: 16,
							innerDirection: 'row'
						}
					]
				}
			},
			{
				type: 'collection/section-container/sidebar',
				state: { percentageWidth: 30, activeIndex: 0 }
			},
			{
				type: 'collection/section-container/tabs',
				state: { gap: 0, activeIndex: 0 }
			}
		],
		activeView: 'collection/section-container/card',
		children: [
			{
				type: 'section',
				id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
				heading: {
					type: 'heading',
					level: 2,
					id: 'f6a7b890-1234-5678-9abc-def012345678',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'Card 1',
					view: [{ type: 'content/heading/default' }],
					activeView: 'content/heading/default'
				},
				view: [
					{ type: 'collection/section/default', state: 'summary' },
					{ type: 'collection/section/static' },
					{ type: 'collection/section/page' }
				],
				activeView: 'collection/section/default',
				children: [
					{
						type: 'paragraph',
						id: 'a7b89012-3456-789a-bcde-f0123456789a',
						content: 'Actual content',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				summary: [
					{
						type: 'paragraph',
						id: 'b8901234-5678-9abc-def0-123456789abc',
						content: 'Summary content 1',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z'
			},
			{
				type: 'section',
				id: 'cdef0123-4567-89ab-cdef-0123456789ab',
				heading: {
					type: 'heading',
					level: 2,
					id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'Card 2',
					view: [{ type: 'content/heading/default' }],
					activeView: 'content/heading/default'
				},
				view: [
					{ type: 'collection/section/default', state: 'summary' },
					{ type: 'collection/section/static' },
					{ type: 'collection/section/page' }
				],
				activeView: 'collection/section/default',
				children: [
					{
						type: 'paragraph',
						id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
						content: 'Actual content',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				summary: [
					{
						type: 'paragraph',
						id: 'f6a7b890-1234-5678-9abc-def012345678',
						content: 'Summary content 2',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z'
			},
			{
				type: 'section',
				id: 'a7b89012-3456-789a-bcde-f0123456789a',
				heading: {
					type: 'heading',
					level: 2,
					id: 'b8901234-5678-9abc-def0-123456789abc',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'Card 3',
					view: [{ type: 'content/heading/default' }],
					activeView: 'content/heading/default'
				},
				view: [
					{ type: 'collection/section/default', state: 'summary' },
					{ type: 'collection/section/static' },
					{ type: 'collection/section/page' }
				],
				activeView: 'collection/section/default',
				children: [
					{
						type: 'paragraph',
						id: 'cdef0123-4567-89ab-cdef-0123456789ab',
						content: 'Content for Card 3',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				summary: [
					{
						type: 'paragraph',
						id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
						content: 'Summary for Card 3',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z'
			},
			{
				type: 'section',
				id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
				heading: {
					type: 'heading',
					level: 2,
					id: 'f6a7b890-1234-5678-9abc-def012345678',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'Card 4',
					view: [{ type: 'content/heading/default' }],
					activeView: 'content/heading/default'
				},
				view: [
					{ type: 'collection/section/default', state: 'collapsed' },
					{ type: 'collection/section/static' },
					{ type: 'collection/section/page' }
				],
				activeView: 'collection/section/default',
				children: [
					{
						type: 'paragraph',
						id: 'a7b89012-3456-789a-bcde-f0123456789a',
						content: 'Content for Card 4',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				summary: [
					{
						type: 'paragraph',
						id: 'b8901234-5678-9abc-def0-123456789abc',
						content: 'Summary for Card 4',
						created: '2025-02-23T01:04:00Z',
						last_modified: '2025-02-23T01:04:00Z',
						view: [{ type: 'content/paragraph/default' }],
						activeView: 'content/paragraph/default'
					}
				],
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z'
			}
		]
	}
};

// Define a paragraph as a child content
const paragraphChild = (num: number, childNum: number, parentNum: number): ContentParagraph => ({
	type: 'paragraph',
	id: `${crypto.randomUUID()}`,
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: `This is child paragraph ${num}-${childNum} (parent: ${parentNum})`,
	view: [{ type: 'content/paragraph/default' }],
	activeView: 'content/paragraph/default'
});

// Define a nested section
const nestedSection = (num: number, childNum: number): Section => ({
	type: 'section',
	id: `${crypto.randomUUID()}`,
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	heading: {
		type: 'heading',
		level: 3,
		id: `${crypto.randomUUID()}`,
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		content: `Nested Section ${num} ${childNum}`,
		view: [{ type: 'content/heading/default' }],
		activeView: 'content/heading/default'
	},
	view: [
		{ type: 'collection/section/default', state: 'expanded' },
		{ type: 'collection/section/static' },
		{ type: 'collection/section/page' }
	],
	activeView: 'collection/section/default',
	children: [
		paragraphChild(num, childNum, 1),
		paragraphChild(num, childNum, 2),
		paragraphChild(num, childNum, 3)
	],
	summary: [
		{
			type: 'paragraph',
			id: `${crypto.randomUUID()}`,
			content: `Summary content ${num}-${childNum}`,
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			view: [{ type: 'content/paragraph/default' }],
			activeView: 'content/paragraph/default'
		}
	]
});

const nestedSectionContainer: (num: number) => z.infer<typeof sectionContainer> = (num) => ({
	type: 'section-container',
	id: `${crypto.randomUUID()}`,
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	view: [
		{ type: 'collection/section-container/default' },
		{ type: 'collection/section-container/static' },
		{ type: 'collection/section-container/card', state: { perRow: 3, gap: 4 } },
		{ type: 'collection/section-container/brick' },
		{
			type: 'collection/section-container/table-of-contents',
			state: {
				directions: [
					{
						type: 'column',
						gap: 16,
						interGenerationGap: 16,
						innerGap: 16,
						innerDirection: 'column'
					},
					{
						type: 'row',
						perRow: 3,
						gap: 16,
						interGenerationGap: 16,
						innerGap: 16,
						innerDirection: 'row'
					}
				]
			}
		},
		{
			type: 'collection/section-container/sidebar',
			state: { percentageWidth: 30, activeIndex: 0 }
		},
		{ type: 'collection/section-container/tabs', state: { gap: 16, activeIndex: 0 } }
	],
	activeView: 'collection/section-container/default',
	children: [
		nestedSection(num, 1),
		nestedSection(num, 2),
		nestedSection(num, 3),
		nestedSection(num, 4),
		nestedSection(num, 5),
		nestedSection(num, 6),
		nestedSection(num, 7),
		nestedSection(num, 8),
		nestedSection(num, 9),
		nestedSection(num, 10)
	]
});

// Define a top-level section
const topLevelSection = (num: number): Section => ({
	type: 'section',
	id: `${crypto.randomUUID()}`,
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	heading: {
		type: 'heading',
		level: 2,
		id: `${crypto.randomUUID()}`,
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		content: `Top Section ${num}`,
		view: [{ type: 'content/heading/default' }],
		activeView: 'content/heading/default'
	},
	view: [
		{ type: 'collection/section/default', state: 'expanded' },
		{ type: 'collection/section/static' },
		{ type: 'collection/section/page' }
	],
	activeView: 'collection/section/default',
	children: [nestedSectionContainer(num)],
	summary: [
		{
			type: 'paragraph',
			id: `${crypto.randomUUID()}`,
			content: `Summary content ${num}`,
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			view: [{ type: 'content/paragraph/default' }],
			activeView: 'content/paragraph/default'
		}
	]
});

// Define the section container with table-of-contents view
export const sectionContainerTOC: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: 'cdef0123-4567-89ab-cdef-0123456789ab',
	title: 'Section Container TOC Example',
	slug: 'section-container-toc-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section-container',
		id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		view: [
			{ type: 'collection/section-container/default' },
			{ type: 'collection/section-container/static' },
			{ type: 'collection/section-container/card', state: { perRow: 3, gap: 4 } },
			{ type: 'collection/section-container/brick' },
			{
				type: 'collection/section-container/table-of-contents',
				state: {
					directions: [
						{
							type: 'column',
							gap: 72,
							interGenerationGap: 32,
							innerGap: 4,
							innerDirection: 'column'
						},
						{
							type: 'row',
							perRow: 3,
							gap: 16,
							interGenerationGap: 16,
							innerGap: 16,
							innerDirection: 'column'
						}
					]
				}
			},
			{
				type: 'collection/section-container/sidebar',
				state: { percentageWidth: 30, activeIndex: 1 }
			},
			{
				type: 'collection/section-container/tabs',
				state: { gap: 16, activeIndex: 0 }
			}
		],
		activeView: 'collection/section-container/table-of-contents',
		children: [topLevelSection(1), topLevelSection(2), topLevelSection(3), topLevelSection(4)]
	}
};

export const sectionContainerDefault: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: 'cdef0123-4567-89ab-cdef-0123456789ab',
	title: 'Section Container TOC Example',
	slug: 'section-container-toc-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section-container',
		id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		view: [
			{ type: 'collection/section-container/default' },
			{ type: 'collection/section-container/static' },
			{ type: 'collection/section-container/card', state: { perRow: 3, gap: 4 } },
			{ type: 'collection/section-container/brick' },
			{
				type: 'collection/section-container/table-of-contents',
				state: {
					directions: [
						{
							type: 'column',
							gap: 72,
							interGenerationGap: 32,
							innerGap: 4,
							innerDirection: 'column'
						},
						{
							type: 'row',
							perRow: 3,
							gap: 16,
							interGenerationGap: 16,
							innerGap: 16,
							innerDirection: 'column'
						}
					]
				}
			},
			{
				type: 'collection/section-container/sidebar',
				state: { percentageWidth: 30, activeIndex: 1 }
			},
			{
				type: 'collection/section-container/tabs',
				state: { gap: 16, activeIndex: 0 }
			}
		],
		activeView: 'collection/section-container/default',
		children: [topLevelSection(1), topLevelSection(2), topLevelSection(3), topLevelSection(4)]
	}
};

// Define the section container with table-of-contents view
export const sectionContainerTOCCard: Document = {
	state: {
		mode: 'write',
		animateNextChange: true
	},
	type: 'document',
	id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
	title: 'Section Container TOC Card Example',
	slug: 'section-container-toc-card-example',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section-container',
		id: 'f6a7b890-1234-5678-9abc-def012345678',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		view: [
			{ type: 'collection/section-container/default' },
			{ type: 'collection/section-container/static' },
			{ type: 'collection/section-container/card', state: { perRow: 1, gap: 4 } },
			{ type: 'collection/section-container/brick' },
			{
				type: 'collection/section-container/table-of-contents',
				state: {
					directions: [
						{
							type: 'column',
							gap: 36,
							interGenerationGap: 16,
							innerGap: 16,
							innerDirection: 'column'
						},
						{
							type: 'row',
							perRow: 3,
							gap: 16,
							interGenerationGap: 16,
							innerGap: 16,
							innerDirection: 'column'
						}
					]
				}
			},
			{
				type: 'collection/section-container/sidebar',
				state: { percentageWidth: 30, activeIndex: 0 }
			},
			{
				type: 'collection/section-container/tabs',
				state: { gap: 16, activeIndex: 0 }
			}
		],
		activeView: 'collection/section-container/card',
		children: [topLevelSection(1), topLevelSection(2), topLevelSection(3), topLevelSection(4)]
	}
};

export const sidebarExample: SectionContainer = {
	id: 'a7b89012-3456-789a-bcde-f0123456789a',
	type: 'section-container',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	view: [
		{ type: 'collection/section-container/default' },
		{ type: 'collection/section-container/static' },
		{ type: 'collection/section-container/card', state: { perRow: 1, gap: 4 } },
		{ type: 'collection/section-container/brick' },
		{ type: 'collection/section-container/table-of-contents', state: { directions: [] } },
		{
			type: 'collection/section-container/sidebar',
			state: { percentageWidth: 30, activeIndex: 0 }
		},
		{ type: 'collection/section-container/tabs', state: { gap: 16, activeIndex: 0 } }
	],
	activeView: 'collection/section-container/sidebar',
	children: [
		{
			id: 'b8901234-5678-9abc-def0-123456789abc',
			type: 'section',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			heading: {
				id: 'cdef0123-4567-89ab-cdef-0123456789ab',
				type: 'heading',
				level: 2,
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				content: 'Introduction',
				view: [{ type: 'content/heading/default' }],
				activeView: 'content/heading/default'
			},
			summary: [
				{
					id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'This is an introduction to our sidebar example.',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				}
			],
			children: [
				{
					id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content:
						'Welcome to the sidebar example! This demonstrates how the sidebar component works with actual content. The sidebar shows section headings and summaries, while the main content area displays the full content of the active section.',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				}
			],
			view: [
				{ type: 'collection/section/default', state: 'expanded' },
				{ type: 'collection/section/static' },
				{ type: 'collection/section/page' }
			],
			activeView: 'collection/section/default'
		},
		{
			id: 'f6a7b890-1234-5678-9abc-def012345678',
			type: 'section',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			heading: {
				id: 'a7b89012-3456-789a-bcde-f0123456789a',
				type: 'heading',
				level: 2,
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				content: 'Features',
				view: [{ type: 'content/heading/default' }],
				activeView: 'content/heading/default'
			},
			summary: [
				{
					id: 'b8901234-5678-9abc-def0-123456789abc',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'Key features of the sidebar component.',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				}
			],
			children: [
				{
					id: 'cdef0123-4567-89ab-cdef-0123456789ab',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'The sidebar component offers several key features:',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				},
				{
					id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: '1. Configurable width through the percentageWidth parameter',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				},
				{
					id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: '2. Active section tracking with the activeIndex parameter',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				},
				{
					id: 'f6a7b890-1234-5678-9abc-def012345678',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: '3. Interactive section selection through sidebar clicks',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				}
			],
			view: [
				{ type: 'collection/section/default', state: 'expanded' },
				{ type: 'collection/section/static' },
				{ type: 'collection/section/page' }
			],
			activeView: 'collection/section/default'
		},
		{
			id: 'a7b89012-3456-789a-bcde-f0123456789a',
			type: 'section',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			heading: {
				id: 'b8901234-5678-9abc-def0-123456789abc',
				type: 'heading',
				level: 2,
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				content: 'Usage',
				view: [{ type: 'content/heading/default' }],
				activeView: 'content/heading/default'
			},
			summary: [
				{
					id: 'cdef0123-4567-89ab-cdef-0123456789ab',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'How to use the sidebar component in your projects.',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				}
			],
			children: [
				{
					id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content:
						'To use the sidebar component, simply set the activeView to "collection/section-container/sidebar" and configure the percentageWidth and activeIndex in the state object. The sidebar will automatically render your sections with their headings and summaries in the sidebar, and display the active section content in the main area.',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				}
			],
			view: [
				{ type: 'collection/section/default', state: 'expanded' },
				{ type: 'collection/section/static' },
				{ type: 'collection/section/page' }
			],
			activeView: 'collection/section/default'
		}
	]
};

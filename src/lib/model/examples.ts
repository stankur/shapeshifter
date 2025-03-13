import type { z } from 'zod';
import type { Section, sectionContainer } from './collection';
import type { ContentParagraph } from './content';
import type { Document } from './document';
import { type SectionContainer } from '$lib/model/collection';

export const simpleParagraph: Document = {  
    state: {
        mode: 'write'
    },
	type: 'document',
	id: 'document-id',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'paragraph',
		id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		content: 'This is a simple paragraph with **basic** formatting.',
		view: [{ type: 'content/paragraph/default' }],
		activeView: 'content/paragraph/default'
	}
};

export const simpleSection: Document = {
    state: {
        mode: 'write'
    },
	type: 'document',
	id: 'document-id',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section',
		id: '01234567-89ab-cdef-0123-456789abcdef',
		heading: {
			type: 'heading',
			level: 2,
			id: '12345678-9abc-def0-1234-56789abcdef0',
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

export const nested: Document = {
	state: {
        mode: 'write'
    },
	type: 'document',
	id: 'document-id',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section',
		id: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
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
			id: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			content: 'Main Section',
			view: [{ type: 'content/heading/default' }],
			activeView: 'content/heading/default'
		},
		children: [
			{
				type: 'paragraph',
				id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
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
				id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				content: 'Summary content',
				view: [{ type: 'content/paragraph/default' }],
				activeView: 'content/paragraph/default'
			}
		]
	}
};

export const nestedSummary: Document = {
	state: {
        mode: 'write'
    },
	type: 'document',
	id: 'document-id',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section',
		id: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
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
			id: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			view: [{ type: 'content/heading/default' }],
			activeView: 'content/heading/default'
		},
		children: [
			{
				type: 'paragraph',
				id: 'd4e5f6a7-b890-1234-5678-9abcdef01234',
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
				id: 'e5f6a7b8-9012-3456-789a-bcdef0123456',
				content: 'Summary content',
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				view: [{ type: 'content/paragraph/default' }],
				activeView: 'content/paragraph/default'
			}
		]
	}
};

export const untitled: Document = {
	state: {
        mode: 'write'
    },
	type: 'document',
	id: 'document-id',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'untitled-section',
		id: 'f6a7b890-1234-5678-9abc-def012345678',
		created: '2025-02-23T01:04:00Z',
		last_modified: '2025-02-23T01:04:00Z',
		view: [{ type: 'collection/untitled-section/default', state: 'expanded' }, { type: 'static' }],
		activeView: 'static',
		children: [
			{
				type: 'paragraph',
				id: 'a7b89012-3456-789a-bcde-f0123456789a',
				created: '2025-02-23T01:04:00Z',
				last_modified: '2025-02-23T01:04:00Z',
				content: 'Content in untitled section',
				view: [{ type: 'content/paragraph/default' }],
				activeView: 'content/paragraph/default'
			},
			{
				type: 'section',
				id: 'b8901234-5678-9abc-def0-123456789abc',
				heading: {
					type: 'heading',
					level: 3,
					id: 'cdef0123-4567-89ab-cdef-0123456789ab',
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
        mode: 'write'
    },
	type: 'document',
	id: 'document-id',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section-container',
		id: 'def01234-5678-9abc-def0-123456789abc',
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
				state: { percentageWidth: 25, activeIndex: 0 }
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
				id: '01234567-89ab-cdef-0123-456789abcdef',
				heading: {
					type: 'heading',
					level: 2,
					id: '12345678-9abc-def0-1234-56789abcdef0',
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
						id: 'e5f6a7b8-9012-3456-789a-bcdef0123456-1',
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
				id: '23456789-abcd-ef01-2345-6789abcdef01',
				heading: {
					type: 'heading',
					level: 2,
					id: '3456789a-bcde-f012-3456-789abcdef012',
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
						id: 'e5f6a7b8-9012-3456-789a-bcdef0123456-2',
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
				id: '3456789a-bcde-f012-3456-789abcdef012',
				heading: {
					type: 'heading',
					level: 2,
					id: '456789ab-cdef-0123-4567-89abcdef0123',
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
						id: 'f6a7b890-1234-5678-9abc-def012345678',
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
						id: 'f6a7b890-1234-5678-9abc-def012345678',
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
				id: '456789ab-cdef-0123-4567-89abcdef0123',
				heading: {
					type: 'heading',
					level: 2,
					id: '56789abc-def0-1234-5678-9abcdef01234',
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
						id: '6789abcd-ef01-2345-6789-abcdef012345',
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
						id: '6789abcd-ef01-2345-6789-abcdef012345',
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
	id: `child-paragraph-id-${num}-${childNum}-${parentNum}`,
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: `This is a child paragraph ${num}.`,
	view: [{ type: 'content/paragraph/default' }],
	activeView: 'content/paragraph/default'
});

// Define a nested section
const nestedSection = (num: number, childNum: number): Section => ({
	type: 'section',
	id: `nested-section-id-${num}-${childNum}`,
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	heading: {
		type: 'heading',
		level: 3,
		id: `nested-heading-id-${num}-${childNum}`,
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
			id: `nested-section-summary-${num}-${childNum}`,
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
	id: `nested-section-container-id-${num}`,
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
		{ type: 'collection/section-container/sidebar', state: { percentageWidth: 25, activeIndex: 0 } },
		{ type: 'collection/section-container/tabs', state: { gap: 16, activeIndex: 0 } }
	],
	activeView: 'collection/section-container/table-of-contents',
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
	id: `top-level-section-id-${num}`,
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	heading: {
		type: 'heading',
		level: 2,
		id: `top-level-heading-id-${num}`,
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
			id: `top-level-section-summary-${num}`,
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
		mode: 'write'
	},
	type: 'document',
	id: 'document-id',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section-container',
		id: 'section-container-id',
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
				state: { percentageWidth: 25, activeIndex: 1 }
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

// Define the section container with table-of-contents view
export const sectionContainerTOCCard: Document = {
	state: {
		mode: 'write'
	},
	type: 'document',
	id: 'document-id',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	content: {
		type: 'section-container',
		id: 'section-container-id',
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
				state: { percentageWidth: 25, activeIndex: 0 }
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
	id: 'sidebar-example',
	type: 'section-container',
	created: '2025-02-23T01:04:00Z',
	last_modified: '2025-02-23T01:04:00Z',
	view: [
		{ type: 'collection/section-container/default' },
		{ type: 'collection/section-container/static' },
		{ type: 'collection/section-container/card', state: { perRow: 1, gap: 4 } },
		{ type: 'collection/section-container/brick' },
		{ type: 'collection/section-container/table-of-contents', state: { directions: [] } },
		{ type: 'collection/section-container/sidebar', state: { percentageWidth: 25, activeIndex: 0 } },
		{ type: 'collection/section-container/tabs', state: { gap: 16, activeIndex: 0 } }
	],
	activeView: 'collection/section-container/sidebar',
	children: [
		{
			id: 'section-1',
			type: 'section',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			heading: {
				id: 'heading-1',
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
					id: 'summary-1',
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
					id: 'content-1',
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
			id: 'section-2',
			type: 'section',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			heading: {
				id: 'heading-2',
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
					id: 'summary-2',
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
					id: 'content-2-1',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: 'The sidebar component offers several key features:',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				},
				{
					id: 'content-2-2',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: '1. Configurable width through the percentageWidth parameter',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				},
				{
					id: 'content-2-3',
					type: 'paragraph',
					created: '2025-02-23T01:04:00Z',
					last_modified: '2025-02-23T01:04:00Z',
					content: '2. Active section tracking with the activeIndex parameter',
					view: [{ type: 'content/paragraph/default' }],
					activeView: 'content/paragraph/default'
				},
				{
					id: 'content-2-4',
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
			id: 'section-3',
			type: 'section',
			created: '2025-02-23T01:04:00Z',
			last_modified: '2025-02-23T01:04:00Z',
			heading: {
				id: 'heading-3',
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
					id: 'summary-3',
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
					id: 'content-3',
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

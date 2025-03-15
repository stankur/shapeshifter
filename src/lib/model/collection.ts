import { z } from 'zod';
import type { ContentParagraph } from './content';
import { contentHeading, contentParagraph } from './content';

export const noHeadingContentSingle = z.lazy(() =>
	z.union([contentParagraph, section, untitledSection, sectionContainer])
);

export type NoHeadingContentSingle =
	| UntitledSection
	| Section
	| ContentParagraph
	| SectionContainer;

const noHeadingContent = z.lazy(() => z.array(noHeadingContentSingle));
type NoHeadingContent = NoHeadingContentSingle[];

// collection
const collectionBase = z.object({
	type: z.literal('collection'),
	id: z.string(),
	created: z.string().datetime(),
	last_modified: z.string().datetime(),
	view: z.string()
});

// collection/section/view
const sectionView = z.tuple([
	z.object({
		type: z.literal('collection/section/default'),
		state: z.enum(['expanded', 'summary', 'collapsed'])
	}),
	z.object({
		type: z.literal('collection/section/static')
	}),
	z.object({
		type: z.literal('collection/section/page')
	})
]);

// collection/section
/**
 * A section is a container for content, such as paragraphs or other sections.
 * It starts with a heading.
 */
const sectionBase = collectionBase.extend({
	type: z.literal('section'),
	heading: contentHeading,
	view: sectionView,
	activeView: z.enum(
		sectionView.items.map((schema) => schema.shape.type.value) as [string, ...string[]]
	)
});

export type Section = z.infer<typeof sectionBase> & {
	children: NoHeadingContent;
	summary: NoHeadingContent;
};

export const section: z.ZodType<Section> = sectionBase.extend({
	children: noHeadingContent,
	summary: noHeadingContent
});


// collection/untitled-section view
const untitledSectionView = z.tuple([
	z.object({
		type: z.literal('collection/untitled-section/default'),
		state: z.enum(['expanded', 'summary'])
	}),
	z.object({
		type: z.literal('static')
	})
]);

// collection/untitled-section
/**
 * An untitled section is a section that does not have a heading.
 */

const untitledSectionBase = collectionBase.extend({
	type: z.literal('untitled-section'),
	summary: z.string().optional(),
	view: untitledSectionView,
	activeView: z.enum(
		untitledSectionView.items.map((schema) => schema.shape.type.value) as [string, ...string[]]
	)
});

export type UntitledSection = z.infer<typeof untitledSectionBase> & {
	children: NoHeadingContent;
};

export const untitledSection: z.ZodType<UntitledSection> = untitledSectionBase.extend({
	children: noHeadingContent
});

// Define a new type for the view state with constraints
export const sectionContainerCardViewState = z.object({
	perRow: z.number().int().min(1).max(4),
	gap: z.number().int().min(0).max(36)
});

export const sectionContainerTabsViewState = z.object({
	gap: z.number().int().min(0).max(72),
	activeIndex: z.number().int().min(0)
});

const dirctionStateBase = z.object({
	interGenerationGap: z.number().int().min(0).max(36),
	innerGap: z.number().int().min(0).max(36),
	gap: z.number().int().min(0).max(72),
	innerDirection: z.enum(['column', 'row'])
});

// Update the sectionContainerView to include the new state type
const sectionContainerView = z.tuple([
	z.object({
		type: z.literal('collection/section-container/default')
	}),
	z.object({
		type: z.literal('collection/section-container/static')
	}),
	z.object({
		type: z.literal('collection/section-container/card'),
		state: sectionContainerCardViewState
	}),
	z.object({
		type: z.literal('collection/section-container/brick')
	}),
	z.object({
		type: z.literal('collection/section-container/table-of-contents'),
		state: z.object({
			directions: z.array(
				z.union([
					z
						.object({
							type: z.literal('column')
						})
						.merge(dirctionStateBase),
					z
						.object({
							type: z.literal('row'),
							perRow: z.number().int().min(1).max(4)
						})
						.merge(dirctionStateBase)
				])
			)
		})
	}),
	z.object({
		type: z.literal('collection/section-container/sidebar'),
		state: z.object({
			percentageWidth: z.number().int().min(0).max(100),
			activeIndex: z.number().int().min(0)
		})
	}),
	z.object({
		type: z.literal('collection/section-container/tabs'),
		state: sectionContainerTabsViewState
	})
]);

// collection/section-container
/**
 * A section container is a container for sections.
 */
export const sectionContainer = collectionBase.extend({
	type: z.literal('section-container'),
	children: z.array(section),
	view: sectionContainerView,
	activeView: z.enum(
		sectionContainerView.items.map((schema) => schema.shape.type.value) as [string, ...string[]]
	)
});

export type SectionContainer = z.infer<typeof sectionContainer>;

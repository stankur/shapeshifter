import { z } from 'zod';

// content
const contentBase = z.object({
    type: z.literal('content'),
    id: z.string(),
    created: z.string().datetime(),
    last_modified: z.string().datetime(),
    content: z.string()
});

// content/heading/view
const headingView = z.tuple([
	z.object({
		type: z.literal('content/heading/default')
	})
]);

// content/heading
export const contentHeading = contentBase.extend({
    type: z.literal('heading'),
    level: z.number().nonnegative().int().min(1),
    view: headingView,
    activeView: z.enum(
        headingView.items.map((schema) => schema.shape.type.value) as [string, ...string[]]
    )
});

export type ContentHeading = z.infer<typeof contentHeading>;

// content/paragraph/view
const paragraphView = z.tuple([
	z.object({
		type: z.literal('content/paragraph/default')
	})
]);

// content/paragraph
export const contentParagraph = contentBase.extend({
    type: z.literal('paragraph'),
    view: paragraphView,
    activeView: z.enum(
        paragraphView.items.map((schema) => schema.shape.type.value) as [string, ...string[]]
    )
});

export type ContentParagraph = z.infer<typeof contentParagraph>;


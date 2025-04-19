import { z } from 'zod';
import { noHeadingContentSingle } from './collection';

export const document = z.object({
	type: z.literal('document'),
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	created: z.string().datetime(),
	last_modified: z.string().datetime(),
	content: noHeadingContentSingle,
	version: z.number(),
	state: z.object({
		mode: z.enum(['write', 'customize', 'read']),
		animateNextChange: z.boolean(),
		focusedContentId: z.string().nullable().optional()
	})
});

export type Document = z.infer<typeof document>;

import { z } from 'zod';
import { noHeadingContentSingle } from './collection';

export const document = z.object({
	type: z.literal('document'),
	id: z.string(),
	created: z.string().datetime(),
	last_modified: z.string().datetime(),
	content: noHeadingContentSingle,
    state: z.object({
        mode: z.enum(['write', 'customize', 'read'])
    })
});

export type Document = z.infer<typeof document>;

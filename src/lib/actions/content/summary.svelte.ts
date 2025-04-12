import type { ContentParagraph } from '$lib/model/content';

/**
 * Creates a new summary paragraph
 * 
 * @returns A new ContentParagraph object for use in summaries
 */
export function createSummaryParagraph(): ContentParagraph {
  return {
    type: 'paragraph',
    id: crypto.randomUUID(),
    created: new Date().toISOString(),
    last_modified: new Date().toISOString(),
    content: '',
    view: [{ type: 'content/paragraph/default' }],
    activeView: 'content/paragraph/default'
  };
}

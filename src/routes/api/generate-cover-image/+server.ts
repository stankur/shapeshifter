import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * POST endpoint to generate a cover image for a section
 * Currently returns a fixed image URL, but could be expanded to generate dynamic images
 */
export const POST: RequestHandler = async ({ request }) => {
	// Extract the markdown content from the request body
	const { markdown } = await request.json();
	
	// Log the content to the console
	console.log('Content for cover image generation:', markdown);
	
	try {
		// For now, always return the fixed image URL as specified
		const imageUrl = 'https://blocks.astratic.com/img/general-img-square.png';
		
		// Return the image URL as JSON
		return json({ imageUrl });
	} catch (error) {
		console.error('Error generating cover image:', error);
		return json({ error: 'Failed to generate cover image' }, { status: 500 });
	}
};

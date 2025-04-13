import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENROUTER_API_KEY, OPENROUTER_API_URL } from '$env/static/private';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

/**
 * POST endpoint to generate a summary with streaming response
 * Uses LangChain with ChatOpenAI pointed to OpenRouter for Claude 3.7
 */
export const POST: RequestHandler = async ({ request }) => {
	// Extract the content from the request body
	const { content } = await request.json();
	
	// Log the content to the console
	console.log('Content to summarize:', content);
	try {
		const stream = new ReadableStream({
			async start(controller) {
				try {
					const model = new ChatOpenAI({
						apiKey: OPENROUTER_API_KEY,
						configuration: {
							baseURL: OPENROUTER_API_URL
						},
						modelName: 'anthropic/claude-3-7-sonnet',
						streaming: true,
						temperature: 0.7
					});

					const prompt = ChatPromptTemplate.fromMessages([
						[
							'system',
							"Summarize the following to one concise paragraph. Use the source words as much as possible. Keep the most important points, and maintain the tone and personality of the writer. Write in markdown if appropriate but avoid enclosing the entire response in triple backticks, code blocks, or quotes. Write as if you are the original author. Write directly to the user without meta-comments or acknowledgments. Make it simple and easy to understand. The purpose of the summary is to be a blurb for the section, that exists for people to see before clicking into the section, and makes people curious and want to know more. It should be short because the purpose is to combat the daunting look of a wall of text. 20 words maximum. Don't make it sound fabricated. Make it spark curiosity, but sound neutral."
						],
						['human', content]
					]);

					const chain = prompt.pipe(model).pipe(new StringOutputParser());

          const streamingResponse = await chain.stream({});

          for await (const chunk of streamingResponse) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
				} catch (error) {
					console.error('Error in stream processing:', error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					controller.error(new Error(errorMessage));
				} finally {
					controller.close();
				}
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/plain',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch (error) {
		console.error('Error generating summary:', error);
		return json({ error: 'Failed to generate summary' }, { status: 500 });
	}
};

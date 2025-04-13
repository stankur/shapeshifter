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
export const POST: RequestHandler = async () => {
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
							'human',
							'Generate a 30-word lorem ipsum text. Respond with just the text, no explanations.'
						]
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

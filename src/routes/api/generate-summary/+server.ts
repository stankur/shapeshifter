import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * POST endpoint to generate a summary with streaming response
 * This is a mock implementation that simulates an LLM streaming response
 */
export const POST: RequestHandler = async () => {
  try {
    
    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        const mockSummary = "This is a mock summary of the document content. It demonstrates the streaming functionality that will eventually be connected to Claude 3.7 via OpenRouter. The summary appears word by word to simulate how an actual LLM would stream its response. This gives users immediate feedback as the summary is being generated.";
        
        const chunks = mockSummary.split(' ');
        
        for (const chunk of chunks) {
          controller.enqueue(new TextEncoder().encode(chunk + ' '));
          
          const delay = Math.floor(Math.random() * 200) + 100;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        controller.close();
      }
    });
    
    // Return the stream as a response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return json({ error: 'Failed to generate summary' }, { status: 500 });
  }
};

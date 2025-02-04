import { CohereClient } from 'cohere-ai';

if (!process.env.COHERE_API_KEY) {
  throw new Error('Missing COHERE_API_KEY environment variable');
}

export const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
}); 
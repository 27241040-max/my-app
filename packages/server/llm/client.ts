import { Ollama } from 'ollama';
import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import summarizePrompt from './prompts/summarize-reviews.txt';
import chatbot from './prompts/chatbot.txt';

const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const ollamaClient = new Ollama();

type GenerateTextOption = {
   model?: string;
   prompt: string;
   instructions?: string;
   temperature?: number;
   maxTokens?: number;
   previousResponseId?: string;
};
type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'meta-llama/Llama-3.1-8B-Instruct:novita',
      prompt,
      instructions,
      temperature = 0.2,
      maxTokens = 1000,
   }: GenerateTextOption): Promise<GenerateTextResult> {
      const response = await inferenceClient.chatCompletion({
         model,
         messages: [
            {
               role: 'system',
               content: instructions || chatbot,
            },
            {
               role: 'user',
               content: prompt,
            },
         ],
         temperature,
         max_tokens: maxTokens,
      });

      const text = response.choices[0]?.message?.content;
      if (!text) {
         throw new Error('Inference model returned empty content');
      }

      return {
         id: crypto.randomUUID(),
         text,
      };
   },
   async summarizeReviews(reviews: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });

      return chatCompletion.choices[0]?.message.content || '';
   },
};

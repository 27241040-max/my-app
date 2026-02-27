import { type Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../prompts/summarize-reviews.txt';
import { join } from '../generated/prisma/runtime/library';

export const reviewService = {
   async getReview(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },
   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);
      const response = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      return response.text;
   },
};

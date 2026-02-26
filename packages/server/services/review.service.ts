import { type Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReview(productId: number): Promise<Review[]> {
      return reviewRepository.getReview(productId);
   },
};

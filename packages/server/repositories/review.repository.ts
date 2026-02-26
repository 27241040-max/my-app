import { PrismaClient, type Review } from '../generated/prisma';

export const reviewRepository = {
   async getReview(productId: number): Promise<Review[]> {
      const prisma = new PrismaClient();
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};

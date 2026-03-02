import axios from 'axios';

export type Reviews = {
   id: number;
   author: string;
   content: string;
   rating: number;
   creatAt: string;
};

export type GetReviewsResponse = {
   summary: string | null;
   reviews: Reviews[];
};

export type SummarizeResponse = {
   summary: string;
};
export const reviewsApi = {
   fetchRevies(productId: number) {
      return axios
         .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
         .then((res) => res.data);
   },

   summerizeReviews(productId: number) {
      return axios
         .post<SummarizeResponse>(`/api/product/${productId}/reviews/summarize`)
         .then((res) => res.data);
   },
};

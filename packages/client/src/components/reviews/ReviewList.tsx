import axios from 'axios';
import StarRating from './StarRating';
import ReviewSkeleton from './ReviewSkeleton';
import { HiSparkles } from 'react-icons/hi2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';

type Props = {
   productId: number;
};

type Reviews = {
   id: number;
   author: string;
   content: string;
   rating: number;
   creatAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Reviews[];
};

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: fetchReviews,
   });

   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => summarizeReviews(),
   });

   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/product/${productId}/reviews/summarize`
      );
      return data;
   };

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }
   if (reviewsQuery.isError) {
      return <p className="text-red-500">无法获得评论，请重试</p>;
   }
   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }

   const currentSummary =
      reviewsQuery.data.summary || summaryMutation.data?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryMutation.isError && (
                     <p className="text-red-500">无法总结评论，请重试！</p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;

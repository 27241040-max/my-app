import axios from 'axios';
import StarRating from './StarRating';
import ReviewSkeleton from './ReviewSkeleton';
import { HiSparkles } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';

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

   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: fetchReviews,
   });

   const [summary, setSummary] = useState('');
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
   const [summaryError, setSummaryError] = useState('');

   const handleSummaize = async () => {
      try {
         setIsSummaryLoading(true);
         setSummaryError('');

         const { data } = await axios.post<SummarizeResponse>(
            `/api/product/${productId}/reviews/summarize`
         );

         setSummary(data.summary);
      } catch (error) {
         console.log(error);
         setSummaryError('无法总结评论，请重试');
      } finally {
         setIsSummaryLoading(false);
      }
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }
   if (error) {
      return <p className="text-red-500">无法获得评论，请重试</p>;
   }
   if (!reviewData?.reviews.length) {
      return null;
   }

   const currentSummary = reviewData.summary || summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={handleSummaize}
                     className="cursor-pointer"
                     disabled={isSummaryLoading}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {isSummaryLoading && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryError && (
                     <p className="text-red-500">{summaryError}</p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
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

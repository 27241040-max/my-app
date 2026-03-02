import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { HiSparkles } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
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

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton count={2} />
               </div>
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
   return (
      <div>
         <div className="mb-5">
            {reviewData?.summary ? (
               <p>{reviewData?.summary}</p>
            ) : (
               <Button>
                  <HiSparkles />
                  Summarize
               </Button>
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

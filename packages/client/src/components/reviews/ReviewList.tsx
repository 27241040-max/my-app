import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();

   const fetchReviews = async () => {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      setReviewData(data);
   };

   useEffect(() => {
      fetchReviews();
   }, []);

   return (
      <div className="flex flex-col gap-5">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>Rating:{review.rating}/5</div>
               <p className="py-2">{review.content}</p>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;

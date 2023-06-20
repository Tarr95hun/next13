import * as React from "react";
import fullStar from "../../../public/icons/full-star.png";
import halfStar from "../../../public/icons/half-star.png";
import emptyStar from "../../../public/icons/empty-star.png";
import Image from "next/image";
import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../../utils/calculateReviewRatingAverage";

export default function Stars({
  reviews,
  rating,
}: {
  reviews: Review[];
  rating?: number;
}) {
  const reviwRating = rating || calculateReviewRatingAverage(reviews);

  const renderImage = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const diff = parseFloat((+reviwRating - +i.toFixed(1)).toFixed(1));

      if (diff >= 1) stars.push(fullStar);
      else if (diff < 1 && diff > 0) {
        if (diff <= 0.2) stars.push(emptyStar);
        else if (diff > 0.2 && diff < 0.6) stars.push(halfStar);
        else stars.push(fullStar);
      } else stars.push(emptyStar);
    }

    return stars.map((star) => (
      <Image src={star} alt="" className="w-4 h-4 mr-1" />
    ));
  };

  return <div className="flex items-center">{renderImage()}</div>;
}

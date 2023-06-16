import Link from "next/link";
import { RestaurantCardType } from "../../page";
import Price from "../Price";

export interface PropsFull {
  id: number;
  name: string;
  main_img: string;
  description: string;
  images: string[];
  open_time: string;
  close_time: string;
  slug: string;
  price: string;
  location_id: number;
  created_at: string;
  updated_at: string;
  cuisine_id: number;
}

interface Prop {
  restaurant: RestaurantCardType;
}

export default function ReastaurantCard({ restaurant }: Prop) {
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img
          src={restaurant.main_img}
          alt={restaurant.name}
          className="w-full h-36"
        />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{restaurant.name}</h3>
          <div className="flex items-start">
            <div className="flex mb-2">*****</div>
            <p className="ml-2">77 reviews</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{restaurant.cuisine.name}</p>
            <Price price={restaurant.price} />
            <p>{restaurant.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
}

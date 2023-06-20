import Header from "./components/Header";
import ReastaurantCard from "./components/RestaurantCard";
import { Cuisine, PRICE, PrismaClient, Location, Review } from "@prisma/client";

export interface RestaurantCardType {
  id: number;
  name: string;
  main_img: string;
  slug: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  reviews: Review[];
}

const prisma = new PrismaClient();

const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_img: true,
      cuisine: true,
      slug: true,
      location: true,
      price: true,
      reviews: true,
    },
  });

  return restaurants;
};

export default async function Home() {
  const restaurants = await fetchRestaurants();

  return (
    <main>
      <Header />

      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restaurants.map((restaurant) => (
          <ReastaurantCard restaurant={restaurant} />
        ))}
      </div>
    </main>
  );
}

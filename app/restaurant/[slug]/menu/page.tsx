import ReastaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";
import { Item, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fetchRestaurantMenu = async (slug: string): Promise<Item[]> => {
  const menu = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      items: true,
    },
  });

  if (!menu) {
    throw new Error();
  }

  return menu.items;
};

export default async function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  const menuItems = await fetchRestaurantMenu(params.slug);

  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <ReastaurantNavBar slug={params.slug} />
      <Menu items={menuItems} />
    </div>
  );
}

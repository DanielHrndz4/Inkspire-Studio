import { Products } from "@/interface/product.interface";

interface CatProps {
  name: string;
  image: string;
  count: number;
}

export const getCategories = (products: Products[]): CatProps[] => {
  const categoryMap = new Map<string, CatProps>();

  products.forEach((p) => {
    if (categoryMap.has(p.category.name)) {
      // si ya existe, solo aumenta el contador
      categoryMap.get(p.category.name)!.count++;
    } else {
      // si no existe, lo agrega con count = 1
      categoryMap.set(p.category.name, {
        ...p.category,
        count: 1,
      });
    }
  });

  return Array.from(categoryMap.values());
};

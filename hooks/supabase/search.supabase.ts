import { Products } from "@/interface/product.interface";
import { supabase } from "@/utils/supabase/server";

/**
 * Busca productos que coincidan con el término dado en el título, tipo o nombre de la categoría.
 */
export const searchProducts = async (query: string): Promise<Products[]> => {
  const q = query.trim();
  if (!q) return [];

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      description,
      type,
      material,
      price,
      discount_percentage,
      category:categories(name,image),
      product_variants(color,sizes,images,tags)
    `)
    .or(
      `title.ilike.%${q}%,type.ilike.%${q}%,category.name.ilike.%${q}%`
    );

  if (error) throw error;

  return (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    type: p.type,
    material: p.material,
    price: p.price,
    discountPercentage: p.discount_percentage,
    category: {
      name: p.category?.name,
      image: p.category?.image,
    },
    product: (p.product_variants || []).map((v: any) => ({
      color: v.color,
      size: v.sizes || [],
      images: v.images || [],
      tags: v.tags || [],
    })),
  }));
};

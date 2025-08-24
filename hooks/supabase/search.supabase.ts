import { Products } from "@/interface/product.interface";
import { supabase } from "@/utils/supabase/server";

const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // quita signos de puntuación
    .toLowerCase()
    .trim();
};


export const searchProducts = async (query: string): Promise<Products[]> => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];
  
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
      categories!inner(name,image),
      product_variants(color,sizes,images,tags)
    `)
    .ilike('title', `%${normalizedQuery}%`)

  if (error) {
    console.error('Error en búsqueda:', error);
    throw error;
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    type: p.type,
    material: p.material,
    price: p.price,
    discountPercentage: p.discount_percentage,
    category: {
      name: p.categories?.name,
      image: p.categories?.image,
    },
    product: (p.product_variants || []).map((v: any) => ({
      color: v.color,
      size: v.sizes || [],
      images: v.images || [],
      tags: v.tags || [],
    })),
  }));
};
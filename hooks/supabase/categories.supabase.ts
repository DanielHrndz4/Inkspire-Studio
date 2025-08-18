import { supabase } from "@/utils/supabase/server";
import type { ProductRecord } from "./products.supabase";

export interface CategoryRecord {
  id: string;
  name: string;
  image?: string | null;
}

export interface CategoryWithCount extends CategoryRecord {
  count: number;
}

export interface CategoryProductsResponse {
  products: ProductRecord[];
  count: number;
}

export const getProductsByCategoryName = async (
  categoryName: string,
  page: number = 1,
  pageSize: number = 10
): Promise<CategoryProductsResponse> => {
  // Primero obtenemos el ID de la categoría por su nombre
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("name", categoryName)
    .single();

  if (categoryError) throw categoryError;
  if (!categoryData) return { products: [], count: 0 };

  // Calcular el rango para la paginación
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Obtenemos los productos paginados con sus variantes y categoría
  const {
    data,
    error,
    count,
  } = await supabase
    .from("products")
    .select(
      "id, title, description, type, material, price, discount_percentage, category:categories(name,image), product_variants(color,sizes,images)",
      { count: "exact" }
    )
    .eq("category_id", categoryData.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const products: ProductRecord[] =
    data?.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      type: p.type,
      material: p.material,
      price: p.price,
      discountPercentage: p.discount_percentage,
      category: { name: p.category?.name, image: p.category?.image },
      product: (p.product_variants || []).map((v: any) => ({
        color: v.color,
        size: v.sizes || [],
        images: v.images || [],
        tags: ["men", "women", "kids"],
      })),
    })) || [];

  return {
    products,
    count: count || 0,
  };
};
export const listCategoriesWithProductCount = async (): Promise<
  CategoryWithCount[]
> => {
  const { data, error } = await supabase.from("categories").select(`
      id, 
      name, 
      image,
      products!left(count)
    `);

  if (error) throw error;

  // Mapear los resultados para obtener el conteo de productos
  return data.map((category) => ({
    id: category.id,
    name: category.name,
    image: category.image,
    count: category.products[0]?.count || 0,
  }));
};

export const listCategories = async (): Promise<CategoryRecord[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, image");
  if (error) throw error;
  return data || [];
};

export const createCategory = async (input: {
  name: string;
  image?: string;
}) => {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name: input.name, image: input.image }])
    .select()
    .single();
  if (error) throw error;
  return data as CategoryRecord;
};

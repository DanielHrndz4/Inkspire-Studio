import { Products } from "@/interface/product.interface";
import { supabase } from "@/utils/supabase/server";

export interface CategoryRecord {
  id: string;
  name: string;
  image?: string | null;
}

export interface CategoryWithCount extends CategoryRecord {
  count: number;
}

export interface CategoryProductsResponse {
  products: Products[];
  count: number;
}

export const getProductsByCategoryName = async (
  categoryName: string,
  page: number = 1,
  pageSize: number = 10
): Promise<any> => {
  // Decodificar el nombre recibido y pasarlo a minúsculas
  const decodedCategoryName = decodeURIComponent(categoryName).toLowerCase();

  // Buscar la categoría ignorando mayúsculas/minúsculas
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id, name")
    .ilike("name", decodedCategoryName) // comparación insensible a mayúsculas
    .single();

  if (categoryError) throw categoryError;
  if (!categoryData) return { products: [], count: 0 };

  // Calcular rango para paginación
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Obtener productos con variantes
  const { data, error, count } = await supabase
    .from("products")
    .select(
      "id, title, description, type, material, price, discount_percentage, category:categories(name,image), product_variants(color,sizes,images,tags)",
      { count: "exact" }
    )
    .eq("category_id", categoryData.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const products: Products[] =
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
        tags: v.tags || [],
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

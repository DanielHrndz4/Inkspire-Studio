import { Products } from "@/interface/product.interface"
import { supabase } from "@/utils/supabase/server"

// Tipo para las claves de audiencia
export type AudienceKey = string; // Puedes definir tipos específicos como "hombre", "mujer", "unisex", etc.

// Función para verificar si un producto pertenece a una audiencia
export const hasAudienceTag = (product: Products, audience: AudienceKey): boolean => {
  return product.product.some((variant) =>
    variant.tags?.includes(audience as any)
  )
}

// Función para obtener productos filtrados por audiencia
export const getProductsByAudience = async (audience: AudienceKey): Promise<Products[]> => {
  const allProducts = await listProducts();
  return allProducts.filter(product => hasAudienceTag(product, audience));
}

export const getLatestProducts = async (): Promise<Products[]> => {
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
    .order("created_at", { ascending: false }) // 👈 trae los más recientes
    .limit(4); // 👈 solo 4

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


// Función para obtener productos con múltiples filtros (incluyendo audiencia)
export const getFilteredProducts = async (filters: {
  audience?: AudienceKey;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Products[]> => {
  let query = supabase
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
    `);

  // Aplicar filtros de precio si están presentes
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  // Aplicar filtro de categoría si está presente
  if (filters.category) {
    query = query.eq('categories.name', filters.category);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Mapear los datos a la estructura de Products
  const products: Products[] = (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    type: p.type,
    material: p.material,
    price: p.price,
    discountPercentage: p.discount_percentage,
    category: { 
      name: p.category?.name, 
      image: p.category?.image 
    },
    product: (p.product_variants || []).map((v: any) => ({
      color: v.color,
      size: v.sizes || [],
      images: v.images || [],
      tags: v.tags || [],
    })),
  }));

  // Filtrar por audiencia si está especificado
  if (filters.audience) {
    return products.filter(product => hasAudienceTag(product, filters.audience!));
  }

  return products;
}

// Función original para listar productos (mantenida para compatibilidad)
export const listProducts = async (): Promise<Products[]> => {
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
    `);

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
      image: p.category?.image 
    },
    product: (p.product_variants || []).map((v: any) => ({
      color: v.color,
      size: v.sizes || [],
      images: v.images || [],
      tags: v.tags || [],
    })),
  }));
}

export const getProductsByIds = async (ids: string[]): Promise<Products[]> => {
  if (ids.length === 0) return []

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
    .in("id", ids)

  if (error) throw error

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
      image: p.category?.image
    },
    product: (p.product_variants || []).map((v: any) => ({
      color: v.color,
      size: v.sizes || [],
      images: v.images || [],
      tags: v.tags || [],
    })),
  }))
}

// Las otras funciones (getProductById, createProduct, updateProduct, deleteProduct) se mantienen igual
export const getProductById = async (id: string): Promise<Products | null> => {
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
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    type: data.type,
    material: data.material,
    price: data.price,
    discountPercentage: data.discount_percentage,
    category: { 
      name: data.category?.[0]?.name, 
      image: data.category?.[0]?.image 
    },
    product: (data.product_variants || []).map((v: any) => ({
      color: v.color,
      size: v.sizes || [],
      images: v.images || [],
      tags: v.tags || [],
    })),
  };
}

export const createProduct = async (input: Products) => {
  const { data: category, error: catError } = await supabase
    .from("categories")
    .upsert([{ name: input.category.name, image: input.category.image }], { onConflict: "name" })
    .select()
    .single();

  if (catError) throw catError;

  const { data: product, error: prodError } = await supabase
    .from("products")
    .insert([
      {
        title: input.title,
        description: input.description,
        type: input.type,
        material: input.material,
        price: input.price,
        discount_percentage: input.discountPercentage ?? 0,
        category_id: category.id,
      },
    ])
    .select()
    .single();

  if (prodError) throw prodError;

  const variants = input.product.map((v) => ({
    product_id: product.id,
    color: v.color,
    sizes: v.size,
    images: v.images,
    tags: v.tags,
  }));

  const { error: variantError } = await supabase.from("product_variants").insert(variants);
  if (variantError) throw variantError;

  return product;
}

export const updateProduct = async (id: string, input: Partial<Products>) => {
  let category_id: string | undefined;

  if (input.category) {
    const { data: category, error: catError } = await supabase
      .from("categories")
      .upsert([{ name: input.category.name, image: input.category.image }], { onConflict: "name" })
      .select()
      .single();

    if (catError) throw catError;
    category_id = category.id;
  }

  const { error: prodError } = await supabase
    .from("products")
    .update({
      title: input.title,
      description: input.description,
      type: input.type,
      material: input.material,
      price: input.price,
      discount_percentage: input.discountPercentage,
      category_id,
    })
    .eq("id", id);

  if (prodError) throw prodError;

  if (input.product) {
    await supabase.from("product_variants").delete().eq("product_id", id);
    
    const variants = input.product.map((v) => ({
      product_id: id,
      color: v.color,
      sizes: v.size,
      images: v.images,
      tags: v.tags,
    }));

    const { error: variantError } = await supabase.from("product_variants").insert(variants);
    if (variantError) throw variantError;
  }
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
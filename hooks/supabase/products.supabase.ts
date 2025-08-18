import { supabase } from "@/utils/supabase/server"

export interface VariantInput {
  color: string
  size: string[]
  images: string[]
}

export interface ProductInput {
  title: string
  description?: string
  type?: string
  category: {
    name: string
    image?: string
  }
  material?: string
  price: number
  discountPercentage?: number
  product: VariantInput[]
}

export interface ProductRecord extends ProductInput {
  id: string
}

export const listProducts = async (): Promise<ProductRecord[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, description, type, material, price, discount_percentage, category:categories(name,image), product_variants(color,sizes,images)"
    )
  if (error) throw error
  return (
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
      })),
    })) || []
  )
}

export const createProduct = async (input: ProductInput) => {
  const { data: category, error: catError } = await supabase
    .from("categories")
    .upsert([{ name: input.category.name, image: input.category.image }], { onConflict: "name" })
    .select()
    .single()
  if (catError) throw catError
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
    .single()
  if (prodError) throw prodError
  const variants = input.product.map((v) => ({
    product_id: product.id,
    color: v.color,
    sizes: v.size,
    images: v.images,
  }))
  const { error: variantError } = await supabase.from("product_variants").insert(variants)
  if (variantError) throw variantError
  return product
}

export const updateProduct = async (id: string, input: Partial<ProductInput>) => {
  let category_id: string | undefined
  if (input.category) {
    const { data: category, error: catError } = await supabase
      .from("categories")
      .upsert([{ name: input.category.name, image: input.category.image }], { onConflict: "name" })
      .select()
      .single()
    if (catError) throw catError
    category_id = category.id
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
    .eq("id", id)
  if (prodError) throw prodError

  if (input.product) {
    await supabase.from("product_variants").delete().eq("product_id", id)
    const variants = input.product.map((v) => ({
      product_id: id,
      color: v.color,
      sizes: v.size,
      images: v.images,
    }))
    const { error: variantError } = await supabase.from("product_variants").insert(variants)
    if (variantError) throw variantError
  }
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}

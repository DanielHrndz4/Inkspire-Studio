export type Product = {
  id: string
  slug: string
  title: string
  price: number
  images: string[]
  category: string
  colors: string[]
  fabrics: string[]
  description: string
  tags?: string[] // e.g., ["anime", "camisas"] para mapear categorías temáticas y de tipo
}

export type Category = {
  slug: string
  title: string
  image: string
  description?: string
}

export const categories: Category[] = [
  {
    slug: "messi%20legacy%20collection",
    title: "Messi Collection",
    image: "/images/categories/messi-collection.jpg",
    description: "Corte, tejido y color a tu medida.",
  },
  {
    slug: "cr7%20'siuuu'%20edition",
    title: "CR7 Collection",
    image: "/images/categories/cr7-collection.jpg",
    description: "Comodidad premium y personalización total.",
  },
  {
    slug: "anime",
    title: "Anime",
    image: "/images/categories/anime.png",
    description: "Arte inspirado en tus series favoritas.",
  },
  {
    slug: "racing",
    title: "Racing",
    image: "https://icktrjprljbmkfhnsegu.supabase.co/storage/v1/object/public/isbucket/racing.jpg",
    description: "Motores y velocidad con estilo.",
  },
  {
    slug: "typography",
    title: "Tipografía",
    image: "/images/categories/typography.jpg",
    description: "Diseños tipográficos minimalistas.",
  },
  {
    slug: "superhéroes",
    title: "Superhéroes",
    image: "https://icktrjprljbmkfhnsegu.supabase.co/storage/v1/object/public/isbucket/1756148328276-sklh60fvpb7.jpg",
    description: "Superhéroes y villanos en cada prenda.",
  },
]

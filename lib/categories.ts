export type Category = {
  slug: string
  title: string
  image: string
  description?: string
}

export const categories: Category[] = [
  {
    slug: "messi-collection",
    title: "Messi Collection",
    image: "/images/categories/messi-collection.jpg",
    description: "Corte, tejido y color a tu medida.",
  },
  {
    slug: "cr7-collection",
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
    slug: "cars",
    title: "Carros",
    image: "/images/categories/cars.jpg",
    description: "Motores y velocidad con estilo.",
  },
  {
    slug: "typography",
    title: "Tipografía",
    image: "/images/categories/typography.jpg",
    description: "Diseños tipográficos minimalistas.",
  },
  {
    slug: "marvel",
    title: "Marvel",
    image: "/images/categories/marvel.jpg",
    description: "Superhéroes y villanos en cada prenda.",
  },
]

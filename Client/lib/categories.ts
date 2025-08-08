export type Category = {
  slug: string
  title: string
  image: string
  description?: string
}

export const categories: Category[] = [
  {
    slug: "camisas",
    title: "Camisas",
    image: "/images/categories/camisas.png",
    description: "Corte, tejido y color a tu medida.",
  },
  {
    slug: "hoodies",
    title: "Hoodies",
    image: "/images/categories/hoodies.png",
    description: "Comodidad premium y personalización total.",
  },
  {
    slug: "anime",
    title: "Anime",
    image: "/images/categories/anime.png",
    description: "Arte inspirado en tus series favoritas.",
  },
  {
    slug: "carros",
    title: "Carros",
    image: "/images/categories/cars.png",
    description: "Motores y velocidad con estilo.",
  },
  {
    slug: "tipografia",
    title: "Tipografía",
    image: "/images/categories/typography.png",
    description: "Diseños tipográficos minimalistas.",
  },
]

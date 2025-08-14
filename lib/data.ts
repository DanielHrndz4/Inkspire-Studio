import { type Product } from "./types"

export const products: Product[] = [
  {
    id: "p1",
    slug: "camisa-classic-white",
    title: "Classic White",
    price: 89,
    images: ["/images/products/classic-white.png", "/images/fabric-detail.png"],
    category: "Camisas",
    colors: ["Blanco"],
    fabrics: ["Algodón Egipcio"],
    description: "Camisa blanca clásica en algodón egipcio. Suavidad y resistencia en un corte atemporal.",
    tags: ["camisas", "tipografia", "hombres"],
  },
  {
    id: "p2",
    slug: "camisa-black-oxford",
    title: "Black Oxford",
    price: 95,
    images: ["/images/products/black-oxford.png", "/images/fabric-detail.png"],
    category: "Camisas",
    colors: ["Negro"],
    fabrics: ["Oxford"],
    description: "Textura oxford en negro profundo. Versátil y elegante para el día y la noche.",
    tags: ["camisas", "hombres"],
  },
  {
    id: "p3",
    slug: "camisa-sky-blue",
    title: "Sky Blue",
    price: 92,
    images: ["/images/products/sky-blue.png", "/images/fabric-detail.png"],
    category: "Camisas",
    colors: ["Celeste"],
    fabrics: ["Algodón"],
    description: "Celeste suave que ilumina cualquier look. Ideal para oficina y eventos casuales.",
    tags: ["camisas", "mujeres"],
  },
  {
    id: "p4",
    slug: "camisa-striped-navy",
    title: "Striped Navy",
    price: 99,
    images: ["/images/products/striped-navy.png", "/images/fabric-detail.png"],
    category: "Camisas",
    colors: ["Azul Marino", "Blanco"],
    fabrics: ["Popelina"],
    description: "Rayas sutiles en azul marino para un estilo distinguido y contemporáneo.",
    tags: ["camisas", "hombres"],
  },
  // Hoodies
  {
    id: "h1",
    slug: "hoodie-black-premium",
    title: "Hoodie Black Premium",
    price: 75,
    images: ["/images/products/hoodie-black.png"],
    category: "Hoodies",
    colors: ["Negro"],
    fabrics: ["Algodón Orgánico"],
    description: "Hoodie negro de gramaje premium con interior perchado.",
    tags: ["hoodies", "hombres", "tipografia"],
  },
  {
    id: "h2",
    slug: "hoodie-grey-classic",
    title: "Hoodie Grey Classic",
    price: 72,
    images: ["/images/products/hoodie-grey.png"],
    category: "Hoodies",
    colors: ["Gris"],
    fabrics: ["Algodón", "Poliéster Reciclado"],
    description: "Clásico gris con caída perfecta y tacto suave.",
    tags: ["hoodies", "mujeres"],
  },
  // Anime
  {
    id: "a1",
    slug: "camisa-anime-ink-dragon",
    title: "Anime Ink Dragon",
    price: 89,
    images: ["/images/products/anime-dragon.png"],
    category: "Camisas",
    colors: ["Blanco", "Negro"],
    fabrics: ["Algodón"],
    description: "Ilustración estilo sumi-e de dragón. Trazo expresivo y contrastes fuertes.",
    tags: ["anime", "camisas", "hombres"],
  },
  {
    id: "a2",
    slug: "hoodie-anime-neo-tokyo",
    title: "Neo Tokyo Hoodie",
    price: 79,
    images: ["/images/products/anime-neotokyo.png"],
    category: "Hoodies",
    colors: ["Negro"],
    fabrics: ["Algodón Orgánico"],
    description: "Gráfica neón inspirada en metrópolis futurista.",
    tags: ["anime", "hoodies", "mujeres"],
  },
  // Carros
  {
    id: "c1",
    slug: "camisa-racing-lines",
    title: "Racing Lines",
    price: 95,
    images: ["/images/products/cars-racing-lines.png"],
    category: "Camisas",
    colors: ["Blanco"],
    fabrics: ["Popelina"],
    description: "Líneas dinámicas inspiradas en el automovilismo.",
    tags: ["carros", "camisas", "hombres"],
  },
  {
    id: "c2",
    slug: "hoodie-turbo-blue",
    title: "Turbo Blue",
    price: 82,
    images: ["/images/products/cars-turbo-blue.png"],
    category: "Hoodies",
    colors: ["Azul"],
    fabrics: ["Algodón"],
    description: "Tipografía técnica con acentos en azul turbo.",
    tags: ["carros", "hoodies", "hombres", "tipografia"],
  },
  // Niños
  {
    id: "k1",
    slug: "camiseta-kids-white",
    title: "Kids White Tee",
    price: 39,
    images: ["/images/products/kids-shirt.png"],
    category: "Camisas",
    colors: ["Blanco"],
    fabrics: ["Algodón"],
    description: "Camiseta para niños en algodón suave, ideal para personalizar.",
    tags: ["camisas", "niños"],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getAllColors(): string[] {
  const set = new Set<string>()
  products.forEach((p) => p.colors.forEach((c) => set.add(c)))
  return Array.from(set)
}

export function getAllFabrics(): string[] {
  const set = new Set<string>()
  products.forEach((p) => p.fabrics.forEach((f) => set.add(f)))
  return Array.from(set)
}

export function countProductsByCategorySlug(slug: string) {
  const s = slug.toLowerCase()
  return products.filter((p) => p.category.toLowerCase() === s || (p.tags ?? []).includes(s)).length
}

export function listProductsByCategorySlug(slug: string) {
  const s = slug.toLowerCase()
  return products.filter((p) => p.category.toLowerCase() === s || (p.tags ?? []).includes(s))
}

import { Products } from "@/interface/product.interface";

export const products: Products[] = [
  {
    id: "p1",
    title: "Classic White",
    description: "Camisa blanca clásica en algodón egipcio. Suavidad y resistencia en un corte atemporal.",
    type: "long-sleeve",
    category: {
      name: "Anime",
      image: "/images/categories/anime.png"
    },
    material: "Algodón Egipcio",
    price: 89,
    discountPercentage: 0,
    product: [
      {
        color: "Blanco",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/classic-white.png", "/images/fabric-detail.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "p2",
    title: "Black Oxford",
    description: "Textura oxford en negro profundo. Versátil y elegante para el día y la noche.",
    type: "long-sleeve",
    category: {
      name: "Anime",
      image: "/images/categories/anime.png"
    },
    material: "Oxford",
    price: 95,
    discountPercentage: 0,
    product: [
      {
        color: "Negro",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/black-oxford.png", "/images/fabric-detail.png"],
        tags: ["men"]
      }
    ],
  },
  {
    id: "p3",
    title: "Sky Blue",
    description: "Celeste suave que ilumina cualquier look. Ideal para oficina y eventos casuales.",
    type: "long-sleeve",
    category: {
      name: "Anime",
      image: "/images/categories/anime.png"
    },
    material: "Algodón",
    price: 92,
    discountPercentage: 0,
    product: [
      {
        color: "Celeste",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/sky-blue.png", "/images/fabric-detail.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "p4",
    title: "Striped Navy",
    description: "Rayas sutiles en azul marino para un estilo distinguido y contemporáneo.",
    type: "long-sleeve",
    category: {
      name: "Anime",
      image: "/images/categories/anime.png"
    },
    material: "Popelina",
    price: 99,
    discountPercentage: 0,
    product: [
      {
        color: "Azul Marino",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/striped-navy.png", "/images/fabric-detail.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "h1",
    title: "Hoodie Black Premium",
    description: "Hoodie negro de gramaje premium con interior perchado.",
    type: "hoodie",
    category: {
      name: "Hoodies",
      image: "/images/categories/hoodies.png"
    },
    material: "Algodón Orgánico",
    price: 75,
    discountPercentage: 0,
    product: [
      {
        color: "Negro",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/hoodie-black.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "h2",
    title: "Hoodie Grey Classic",
    description: "Clásico gris con caída perfecta y tacto suave.",
    type: "hoodie",
    category: {
      name: "Hoodies",
      image: "/images/categories/hoodies.png"
    },
    material: "Algodón, Poliéster Reciclado",
    price: 72,
    discountPercentage: 0,
    product: [
      {
        color: "Gris",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/hoodie-grey.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "a1",
    title: "Anime Ink Dragon",
    description: "Ilustración estilo sumi-e de dragón. Trazo expresivo y contrastes fuertes.",
    type: "t-shirt",
    category: {
      name: "Anime",
      image: "/images/categories/anime.png"
    },
    material: "Algodón",
    price: 89,
    discountPercentage: 0,
    product: [
      {
        color: "Blanco",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/anime-dragon.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "a2",
    title: "Neo Tokyo Hoodie",
    description: "Gráfica neón inspirada en metrópolis futurista.",
    type: "hoodie",
    category: {
      name: "Hoodies",
      image: "/images/categories/hoodies.png"
    },
    material: "Algodón Orgánico",
    price: 79,
    discountPercentage: 0,
    product: [
      {
        color: "Negro",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/anime-neotokyo.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "c1",
    title: "Racing Lines",
    description: "Líneas dinámicas inspiradas en el automovilismo.",
    type: "t-shirt",
    category: {
      name: "Anime",
      image: "/images/categories/anime.png"
    },
    material: "Popelina",
    price: 95,
    discountPercentage: 0,
    product: [
      {
        color: "Blanco",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/cars-racing-lines.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "c2",
    title: "Turbo Blue",
    description: "Tipografía técnica con acentos en azul turbo.",
    type: "hoodie",
    category: {
      name: "Hoodies",
      image: "/images/categories/hoodies.png"
    },
    material: "Algodón",
    price: 82,
    discountPercentage: 0,
    product: [
      {
        color: "Azul",
        size: ["S", "M", "L", "XL"],
        images: ["/images/products/cars-turbo-blue.png"],
        tags: ["men", "women"]
      }
    ],
  },
  {
    id: "k1",
    title: "Kids White Tee",
    description: "Camiseta para niños en algodón suave, ideal para personalizar.",
    type: "t-shirt",
    category: {
      name: "Anime",
      image: "/images/categories/anime.png"
    },
    material: "Algodón",
    price: 39,
    discountPercentage: 0,
    product: [
      {
        color: "Blanco",
        size: ["XS", "S", "M"],
        images: ["/images/products/kids-shirt.png"],
        tags: ["kids"]
      },
      {
        color: "Negro",
        size: ["S", "M"],
        images: ["/images/categories/anime.png","/images/products/kids-shirt.png"],
        tags: ["kids"]
      }
    ],
  }
];


export function getProductByTitle(title: string): Products | undefined {
  return products.find((p) => p.title.toLowerCase() === title.toLowerCase());
}

export function getProductById(id: string): Products | undefined {
  return products.find((p) => p.id === id);
}

export function countProductsByCategory(category: string): number {
  if (!category) return 0; // Si category es undefined, null o string vacío
  
  const lowerCategory = category.toLowerCase();
  return products.filter((product) => 
    product.category?.name?.toLowerCase() === lowerCategory
  ).length;
}

export function getAllColors(): string[] {
  const colors = new Set<string>();
  products.forEach((product) => {
    product.product.forEach((variant) => {
      colors.add(variant.color);
    });
  });
  return Array.from(colors);
}

export function getAllMaterials(): string[] {
  const materials = new Set<string>();
  products.forEach((product) => {
    materials.add(product.material);
  });
  return Array.from(materials);
}

// En tu archivo de datos (lib/data.ts o similar)
export function listProductsByCategory(category: string) {
  if (category === "tshirts") {
    return products.filter(p => p.type === "t-shirt")
  }
  return products.filter(p => p.category.name.toLowerCase() === category)
}

export function getProductsByColor(color: string): Products[] {
  const lowerColor = color.toLowerCase();
  return products.filter((product) =>
    product.product.some((variant) => 
      variant.color.toLowerCase() === lowerColor
    )
  );
}

export function getProductsBySize(size: string): Products[] {
  const upperSize = size.toUpperCase();
  return products.filter((product) =>
    product.product.some((variant) => 
      variant.size.includes(upperSize)
    )
  );
}

// Función adicional para obtener productos por tipo
export function getProductsByType(type: string): Products[] {
  const lowerType = type.toLowerCase();
  return products.filter((product) => 
    product.type.toLowerCase() === lowerType
  );
}
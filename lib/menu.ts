import type { LucideIcon } from "lucide-react";
import {
  Shirt,
  Sparkles,
  Layers,
  List,
  Grid2X2,
  FolderGit2,
  Wrench,
  Heart,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

export type CategoryGroup = {
  key: string;
  title: string;
  icon?: LucideIcon;
  items: NavItem[];
};

// Grupos de categorías (submenu)
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "camisas",
    title: "Camisas",
    icon: Shirt,
    items: [
      { label: "Hombres", href: "/categories/t-shirt?audiencia=hombres" },
      { label: "Mujeres", href: "/categories/t-shirt?audiencia=mujeres" },
      { label: "Niños", href: "/categories/t-shirt?audiencia=niños" },
      { label: "Todas las camisas", href: "/categories/t-shirt" },
    ],
  },
  {
    key: "hoodies",
    title: "Hoodies",
    icon: Shirt,
    items: [
      { label: "Hombres", href: "/categories/hoodie?audiencia=hombres" },
      { label: "Mujeres", href: "/categories/hoodie?audiencia=mujeres" },
      { label: "Niños", href: "/categories/hoodie?audiencia=niños" },
      { label: "Todos los hoodies", href: "/categories/hoodie" },
    ],
  },
  {
    key: "tematicas",
    title: "Temáticas",
    icon: Sparkles,
    items: [
      { label: "Anime", href: "/categories/anime" },
      { label: "Carros", href: "/categories/cars" },
      { label: "Tipografía", href: "/categories/typography" },
    ],
  },
];

// Ítems de primer nivel (main menu) – SIEMPRE visibles en desktop y como atajos arriba en móvil
export const TOP_LEVEL_MAIN: NavItem[] = [
  { label: "Categorías", href: "/categories", icon: Layers },
  { label: "Colección", href: "/collection", icon: FolderGit2 },
  // { label: "Personalizar", href: "/customize", icon: Wrench },
];

// Resto de accesos (se muestran en submenu/“Explorar” y en la lista de atajos del móvil)
export const SHORTCUTS: NavItem[] = [
  // { label: "Todos los productos", href: "/products", icon: List },
  { label: "Servicios", href: "/services", icon: Grid2X2 },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];

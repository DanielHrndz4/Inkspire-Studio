type ProductTag = "women" | "men" | "kids";

interface Product {
  color: string;
  size: string[];
  images: string[];
  tags: ProductTag[];
}

interface Category {
  name: string;
  image: string;
}

export interface Products {
  id: string;
  title: string;
  description: string;
  type: "t-shirt" | "hoodie" | "polo" | "croptop" | "oversized" | "long-sleeve";
  category: Category;
  material: string;
  price: number;
  discountPercentage: number;
  product: Product[];
}

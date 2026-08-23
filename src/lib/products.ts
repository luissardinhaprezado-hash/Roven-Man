export type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  description: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured?: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "Camisa Oversized Bege",
    price: 49.90,
    originalPrice: 79.90,
    category: "Camisas",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    description: "Camisa oversized em algodão premium. Corte moderno e confortável para o dia a dia.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Bege", "Branco", "Preto"],
    inStock: true,
    featured: true
  },
  {
    id: "2",
    name: "Calça Cargo Preta",
    price: 69.90,
    originalPrice: 99.90,
    category: "Calças",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop",
    description: "Calça cargo com bolsos laterais. Tecido resistente e estilo urbano.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Preto", "Verde Militar"],
    inStock: true,
    featured: true
  },
  {
    id: "3",
    name: "T-Shirt Básica Preta",
    price: 29.90,
    category: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
    description: "T-shirt essencial em algodão penteado. Corte regular e qualidade premium.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Preto", "Branco", "Cinza"],
    inStock: true,
    featured: true
  },
  {
    id: "4",
    name: "Blazer Slim Fit Cinza",
    price: 149.90,
    originalPrice: 199.90,
    category: "Blazers",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    description: "Blazer slim fit em tecido de alta qualidade. Ideal para ocasiões formais e casuais.",
    sizes: ["46", "48", "50", "52"],
    colors: ["Cinza", "Preto", "Azul Marinho"],
    inStock: true
  },
  {
    id: "5",
    name: "Sapatilhas Brancas Minimal",
    price: 89.90,
    originalPrice: 129.90,
    category: "Calçado",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop",
    description: "Sapatilhas minimalistas em couro sintético. Conforto e estilo limpo.",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["Branco"],
    inStock: true,
    featured: true
  },
  {
    id: "6",
    name: "Casaco Bomber Preto",
    price: 119.90,
    category: "Casacos",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
    description: "Casaco bomber clássico com fecho e bolsos. Perfeito para meia-estação.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Preto", "Verde"],
    inStock: true
  },
  {
    id: "7",
    name: "Calça Chino Bege",
    price: 59.90,
    category: "Calças",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    description: "Calça chino em algodão stretch. Versátil e confortável.",
    sizes: ["28", "30", "32", "34"],
    colors: ["Bege", "Azul", "Preto"],
    inStock: true
  },
  {
    id: "8",
    name: "Hoodie Oversized Cinza",
    price: 79.90,
    originalPrice: 99.90,
    category: "Hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
    description: "Hoodie oversized com capuz e bolso canguru. Estilo streetwear premium.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cinza", "Preto", "Bege"],
    inStock: true,
    featured: true
  }
]

export const categories = [
  "Tudo",
  "Camisas",
  "T-Shirts",
  "Calças",
  "Casacos",
  "Blazers",
  "Hoodies",
  "Calçado"
]

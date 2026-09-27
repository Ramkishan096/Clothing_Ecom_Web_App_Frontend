// data/categories.ts
export const categories = [
  { 
    id: 1, 
    name: "T-Shirts", 
    image: "./CategoryImage/T-Shirt.png" 
  },
  { 
    id: 2, 
    name: "Shirts", 
    image: "./CategoryImage/Shirt.png" 
  },
  { 
    id: 3, 
    name: "Jeans", 
    image: "./CategoryImage/Jeans.png" 
  },
  {
    id: 4,
    name: "Lower",
    image: "./CategoryImage/Lower.png",
  }
];

export const heroSlides = [
  {
    id: 1,
    title: "Premium T-Shirts",
    subtitle: "Comfort Meets Style",
    image: categories[0].image,
    category: "T-Shirts",
    cta: "Shop Now"
  },
  {
    id: 2,
    title: "Classic Shirts",
    subtitle: "Timeless Elegance",
    image: categories[1].image,
    category: "Shirts",
    cta: "Shop Now"
  },
  {
    id: 3,
    title: "Denim Collection",
    subtitle: "Perfect Fit, Perfect Look",
    image: categories[2].image,
    category: "Jeans",
    cta: "Shop Now"
  },
  {
    id: 4,
    title: "Trendy Lower Wear",
    subtitle: "Style Your Way",
    image: categories[3].image,
    category: "Lower",
    cta: "Shop Now"
  }  
];
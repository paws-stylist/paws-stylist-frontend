export const sampleProducts = [
  {
    id: 1,
    name: "Royal Canin Maxi Adult",
    detail: "Premium dry dog food specially formulated for large breed adult dogs, promoting healthy joints and maintaining ideal weight",
    salePrice: 79.99,
    promotionPrice: 69.99,
    images: ["/image.png"],
    promotion: {
      startDate: "2024-03-01",
      endDate: "2024-04-30",
      price: 69.99
    },
    brand: "Royal Canin",
    category: "Dog Food",
    productCode: "RC-MAXI-15KG",
    barcode: "8888888888888",
    subCategory: "Dry Food",
    productType: "Food",
    unit: "Bag",
    pack: 1,
    taxRate: 5
  },
  {
    id: 2,
    name: "Furminator deShedding Tool",
    detail: "Professional-grade grooming tool that reduces shedding by up to 90% in dogs and cats",
    salePrice: 45.99,
    images: ["/image.png"],
    brand: "Furminator",
    category: "Grooming",
    productCode: "FUR-SHED-L",
    barcode: "7777777777777",
    subCategory: "Brushes",
    productType: "Accessories",
    unit: "Piece",
    pack: 1,
    taxRate: 5
  },
  {
    id: 3,
    name: "Kong Classic Dog Toy",
    detail: "Durable natural rubber toy that can be stuffed with treats, perfect for keeping dogs mentally and physically stimulated",
    salePrice: 14.99,
    promotionPrice: 11.99,
    images: ["/image.png"],
    promotion: {
      startDate: "2024-03-15",
      endDate: "2024-04-15",
      price: 11.99
    },
    brand: "Kong",
    category: "Toys",
    productCode: "KONG-CL-L",
    barcode: "6666666666666",
    subCategory: "Interactive Toys",
    productType: "Toys",
    unit: "Piece",
    pack: 1,
    taxRate: 5
  },
  {
    id: 4,
    name: "Frontline Plus for Dogs",
    detail: "Monthly flea and tick prevention for dogs, kills all life stages of fleas and ticks",
    salePrice: 39.99,
    images: ["/image.png"],
    brand: "Frontline",
    category: "Healthcare",
    productCode: "FL-PLUS-L",
    barcode: "5555555555555",
    subCategory: "Flea & Tick",
    productType: "Medicine",
    unit: "Pack",
    pack: 3,
    taxRate: 5
  }
];

export const sampleServices = [
  {
    id: 1,
    name: "Full Grooming Package",
    detail: "Complete grooming service including bath, haircut, nail trimming, ear cleaning, and teeth brushing. Suitable for all dog breeds.",
    price: 89.99,
    promotionPrice: 74.99,
    images: ["/image.png"],
    promotion: {
      startDate: "2024-03-01",
      endDate: "2024-04-30",
      price: 74.99
    },
    serviceType: "Grooming",
    duration: 120
  },
  {
    id: 2,
    name: "Veterinary Check-up",
    detail: "Comprehensive health examination including vital signs check, physical assessment, and basic health screening.",
    price: 129.99,
    images: ["/image.png"],
    serviceType: "Veterinary Care",
    duration: 45
  },
  {
    id: 3,
    name: "Pet Training Session",
    detail: "One-on-one training session with our certified trainer. Perfect for addressing specific behavioral issues or basic obedience training.",
    price: 69.99,
    promotionPrice: 59.99,
    images: ["/image.png"],
    promotion: {
      startDate: "2024-03-15",
      endDate: "2024-05-15",
      price: 59.99
    },
    serviceType: "Training",
    duration: 60
  }
]; 
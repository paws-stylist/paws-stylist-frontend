import { serviceTypes, productCategories } from '@/data/sampleData';

export const navbarData = [
  {
    name: "Home",
    url: "/",
    desc: "All about PAWS",
  },
  {
    name: "Services",
    url: "/services",
    desc: "Pet grooming and care services",
    isDropdown: true,
    dropdownItems: serviceTypes.map(service => ({
      name: service.name,
      url: `/services/${service.name.toLowerCase().replace(' ', '-')}`,
      desc: `${service.name} services for your pet`,
      image: service.image,
    })),
  },
  ...productCategories.map(category => ({
    name: category.name,
    url: `/products/${category.name.toLowerCase()}`,
    desc: `${category.name} products for your pet`,
    isDropdown: true,
    dropdownItems: category.subCategories.map(subCategory => ({
      name: subCategory.name,
      url: `/products/${category.name.toLowerCase()}/${subCategory.slug}`,
      desc: `${subCategory.name} in ${category.name}`,
    })),
  })),
  // {
  //   name: "Blogs",
  //   url: "/blogs",
  //   desc: "Latest blog posts",
  // }
];

export const footerData = [
  {
    name: "Home",
    url: "/",
    desc: "All about PAWS",
  },
  {
    name: "Home Grooming",
    url: "/products/home-grooming",
    desc: "Get your pet home groomed",
  },
  {
    name: "Walking Gear",
    url: "/products/walking-gear",
    desc: "Get your pet walking gear",
  },
  {
    name: "Feeding",
    url: "/products/feeding",
    desc: "Get your pet fed",
  },
  {
    name: "Beds",
    url: "/products/beds",
    desc: "Get your pet a bed",
  },
  {
    name: "Toys",
    desc: "Get your pet a toy",
    isDropdown: true,
    url: "/products/toys",
    dropdownItems: [
      {
        name: "Dogs",
        url: "/products/toys/dogs",
        desc: "Get your pet a dog toy",
      },
      {
        name: "Cats",
        url: "/products/toys/cats",
        desc: "Get your pet a cat toy",
      },
    ],
  },
];
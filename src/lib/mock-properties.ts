export type FeaturedProperty = {
  title: string;
  location: string;
  price: string;
  image: string;
  beds: number;
  baths: number;
  area: string;
  tag: string;
};

export const featuredProperties: FeaturedProperty[] = [
  {
    title: "Glass Ridge Estate",
    location: "Malibu, California",
    price: "$8.9M",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    beds: 6,
    baths: 7,
    area: "8,240 sq ft",
    tag: "Ocean View",
  },
  {
    title: "Crescent Garden Villa",
    location: "Austin, Texas",
    price: "$3.4M",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    beds: 5,
    baths: 5,
    area: "5,180 sq ft",
    tag: "Private Courtyard",
  },
  {
    title: "Hudson Penthouse",
    location: "New York, New York",
    price: "$6.2M",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    beds: 4,
    baths: 4,
    area: "3,910 sq ft",
    tag: "Skyline Terrace",
  },
];

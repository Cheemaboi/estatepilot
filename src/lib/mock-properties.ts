export type FeaturedProperty = {
  slug: string;
  title: string;
  location: string;
  price: string;
  image: string;
  gallery: string[];
  beds: number;
  baths: number;
  area: string;
  tag: string;
  type: string;
  description: string;
  amenities: string[];
  agent: {
    name: string;
    role: string;
    phone: string;
  };
};

export const featuredProperties: FeaturedProperty[] = [
  {
    slug: "glass-ridge-estate",
    title: "Glass Ridge Estate",
    location: "Malibu, California",
    price: "$8.9M",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
    ],
    beds: 6,
    baths: 7,
    area: "8,240 sq ft",
    tag: "Ocean View",
    type: "Private estate",
    description:
      "A cinematic cliffside estate with layered terraces, floor-to-ceiling glass, and resort-grade entertaining spaces oriented toward the Pacific.",
    amenities: ["Infinity pool", "Wine room", "Private cinema", "Guest pavilion"],
    agent: {
      name: "Maya Sterling",
      role: "Luxury estates advisor",
      phone: "+1 (310) 555-0184",
    },
  },
  {
    slug: "crescent-garden-villa",
    title: "Crescent Garden Villa",
    location: "Austin, Texas",
    price: "$3.4M",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80",
    ],
    beds: 5,
    baths: 5,
    area: "5,180 sq ft",
    tag: "Private Courtyard",
    type: "Garden villa",
    description:
      "A warm modern villa wrapped around a quiet courtyard, designed for indoor-outdoor living and polished daily comfort.",
    amenities: ["Chef kitchen", "Courtyard pool", "Studio suite", "Three-car garage"],
    agent: {
      name: "Noah Vale",
      role: "Austin market principal",
      phone: "+1 (512) 555-0149",
    },
  },
  {
    slug: "hudson-penthouse",
    title: "Hudson Penthouse",
    location: "New York, New York",
    price: "$6.2M",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80",
    ],
    beds: 4,
    baths: 4,
    area: "3,910 sq ft",
    tag: "Skyline Terrace",
    type: "Penthouse",
    description:
      "A full-floor residence with city-facing terraces, gallery walls, and a quiet private wing above the Hudson corridor.",
    amenities: ["Doorman", "Private elevator", "Roof terrace", "Wellness room"],
    agent: {
      name: "Elena Park",
      role: "Manhattan penthouse specialist",
      phone: "+1 (212) 555-0177",
    },
  },
  {
    slug: "harbor-court-residence",
    title: "Harbor Court Residence",
    location: "Miami, Florida",
    price: "$4.8M",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585152909-3f27c4c1c2cc?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
    ],
    beds: 5,
    baths: 6,
    area: "4,720 sq ft",
    tag: "Harbor View",
    type: "Residence",
    description:
      "A polished waterfront residence with sunset terraces, a private dock feel, and clean lines tuned for entertaining by the bay.",
    amenities: ["Private terrace", "Wine storage", "Guest suite", "Fitness room"],
    agent: {
      name: "Iris Chen",
      role: "Miami waterfront advisor",
      phone: "+1 (305) 555-0191",
    },
  },
  {
    slug: "desert-canyon-compound",
    title: "Desert Canyon Compound",
    location: "Scottsdale, Arizona",
    price: "$5.7M",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80",
    ],
    beds: 5,
    baths: 6,
    area: "6,140 sq ft",
    tag: "Desert Retreat",
    type: "Compound",
    description:
      "A low-profile desert compound organized around an interior courtyard, with shaded outdoor rooms and a calm modern material palette.",
    amenities: ["Courtyard pool", "Detached office", "Fire lounge", "Motor court"],
    agent: {
      name: "Renee Calder",
      role: "Scottsdale estate specialist",
      phone: "+1 (480) 555-0128",
    },
  },
  {
    slug: "northstar-lake-house",
    title: "Northstar Lake House",
    location: "Lake Tahoe, California",
    price: "$7.4M",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    ],
    beds: 4,
    baths: 5,
    area: "4,360 sq ft",
    tag: "Lakefront",
    type: "House",
    description:
      "A crisp mountain-lake home with big windows, warm timber details, and direct access to winter and summer recreation.",
    amenities: ["Private dock", "Ski storage", "Fireplace lounge", "Guest bunk room"],
    agent: {
      name: "Sofia Hale",
      role: "Lakefront property advisor",
      phone: "+1 (530) 555-0162",
    },
  },
  {
    slug: "belmont-modern-residence",
    title: "Belmont Modern Residence",
    location: "Nashville, Tennessee",
    price: "$2.9M",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154534-5c1fb3d0b6cb?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    ],
    beds: 4,
    baths: 4,
    area: "3,680 sq ft",
    tag: "Modern Residence",
    type: "Residence",
    description:
      "A compact modern residence with studio flexibility, clean detailing, and easy proximity to the city core.",
    amenities: ["Studio suite", "Roof deck", "Library nook", "Two-car garage"],
    agent: {
      name: "Jordan Hayes",
      role: "Nashville luxury agent",
      phone: "+1 (615) 555-0188",
    },
  },
];

export const curatedMarkets = [
  {
    name: "Coastal Estates",
    location: "Malibu to Montecito",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    count: "42 homes",
  },
  {
    name: "Urban Penthouses",
    location: "New York and Miami",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
    count: "31 homes",
  },
  {
    name: "Private Compounds",
    location: "Austin and Scottsdale",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=80",
    count: "18 homes",
  },
  {
    name: "Waterfront Residences",
    location: "Miami and Lake Tahoe",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    count: "24 homes",
  },
];

export const propertyStats = [
  { label: "Avg. close time", value: "27 days" },
  { label: "Private advisors", value: "64" },
  { label: "Luxury markets", value: "12" },
];

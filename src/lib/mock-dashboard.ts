export const dashboardKpis = [
  { label: "Active listings", value: "128", change: "+12 this month" },
  { label: "Pipeline value", value: "$84.6M", change: "+8.4% vs last month" },
  { label: "New leads", value: "342", change: "64 high intent" },
  { label: "Tours booked", value: "76", change: "18 this week" },
];

export const dashboardProperties = [
  {
    slug: "glass-ridge-estate",
    name: "Glass Ridge Estate",
    market: "Malibu",
    agent: "Maya Sterling",
    price: "$8.9M",
    status: "Live",
    inquiries: 28,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "crescent-garden-villa",
    name: "Crescent Garden Villa",
    market: "Austin",
    agent: "Noah Vale",
    price: "$3.4M",
    status: "Review",
    inquiries: 16,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "hudson-penthouse",
    name: "Hudson Penthouse",
    market: "New York",
    agent: "Elena Park",
    price: "$6.2M",
    status: "Live",
    inquiries: 34,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "harbor-court-residence",
    name: "Harbor Court Residence",
    market: "Miami",
    agent: "Iris Chen",
    price: "$4.8M",
    status: "Draft",
    inquiries: 9,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "desert-canyon-compound",
    name: "Desert Canyon Compound",
    market: "Scottsdale",
    agent: "Renee Calder",
    price: "$5.7M",
    status: "Live",
    inquiries: 21,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "northstar-lake-house",
    name: "Northstar Lake House",
    market: "Lake Tahoe",
    agent: "Sofia Hale",
    price: "$7.4M",
    status: "Review",
    inquiries: 12,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
  },
];

export const agents = [
  {
    name: "Maya Sterling",
    market: "Malibu",
    status: "Active",
    listings: 18,
    pipeline: "$22.4M",
  },
  {
    name: "Noah Vale",
    market: "Austin",
    status: "Active",
    listings: 14,
    pipeline: "$13.8M",
  },
  {
    name: "Elena Park",
    market: "New York",
    status: "Active",
    listings: 21,
    pipeline: "$31.2M",
  },
  {
    name: "Iris Chen",
    market: "Miami",
    status: "Onboarding",
    listings: 7,
    pipeline: "$9.6M",
  },
];

export const leads = [
  {
    name: "Amelia Hart",
    property: "Glass Ridge Estate",
    stage: "Tour scheduled",
    source: "Smart Finder",
    value: "$8M+",
  },
  {
    name: "Daniel Reed",
    property: "Hudson Penthouse",
    stage: "Qualified",
    source: "Listing page",
    value: "$5M - $7M",
  },
  {
    name: "Priya Shah",
    property: "Crescent Garden Villa",
    stage: "New inquiry",
    source: "Homepage search",
    value: "$3M - $4M",
  },
  {
    name: "Marcus Lane",
    property: "Harbor Court Residence",
    stage: "Negotiation",
    source: "Agent referral",
    value: "$4M+",
  },
];

export const transactions = [
  {
    client: "Marcus Lane",
    property: "Harbor Court Residence",
    amount: "$4.6M",
    status: "Contract",
    close: "Jul 22",
  },
  {
    client: "Amelia Hart",
    property: "Glass Ridge Estate",
    amount: "$8.7M",
    status: "Diligence",
    close: "Aug 04",
  },
  {
    client: "Daniel Reed",
    property: "Hudson Penthouse",
    amount: "$6.1M",
    status: "Offer",
    close: "Aug 18",
  },
];

export const appointments = [
  {
    time: "09:30",
    title: "Private showing",
    property: "Glass Ridge Estate",
    contact: "Amelia Hart",
  },
  {
    time: "11:00",
    title: "Agent pricing review",
    property: "Crescent Garden Villa",
    contact: "Noah Vale",
  },
  {
    time: "14:30",
    title: "Offer strategy",
    property: "Hudson Penthouse",
    contact: "Daniel Reed",
  },
  {
    time: "16:00",
    title: "Media upload review",
    property: "Harbor Court Residence",
    contact: "Iris Chen",
  },
];

export const activity = [
  "Maya updated media for Glass Ridge Estate",
  "New Smart Finder lead matched to Hudson Penthouse",
  "Admin approved Crescent Garden Villa for publication",
  "Tour confirmed for Friday morning",
];

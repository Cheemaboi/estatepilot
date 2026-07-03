import type { FeaturedProperty } from "@/lib/mock-properties";

export const suggestedPropertyQuestions = [
  "Is this good for entertaining?",
  "What makes it private?",
  "What should I ask the agent?",
];

export function getLocalPropertyAnswer(property: FeaturedProperty, question: string) {
  const normalized = question.toLowerCase();
  const amenityHits = property.amenities.filter((amenity) =>
    normalized
      .split(/\s+/)
      .filter((token) => token.length > 3)
      .some((token) => amenity.toLowerCase().includes(token)),
  );

  if (normalized.includes("entertain")) {
    return `${property.title} is strong for entertaining because it offers ${property.amenities
      .slice(0, 2)
      .join(" and ")} plus generous ${property.area}.`;
  }

  if (normalized.includes("cost") || normalized.includes("fee") || normalized.includes("tax")) {
    return `For ${property.price}, ask ${property.agent.name} for carrying costs, recent comparable sales, tax history, insurance assumptions, and any HOA or building fees before you tour.`;
  }

  if (
    normalized.includes("family") ||
    normalized.includes("guest") ||
    normalized.includes("bedroom")
  ) {
    return `${property.beds} bedrooms and amenities like ${property.amenities
      .slice(0, 2)
      .join(", ")} make ${property.title} worth shortlisting for family or guest-heavy use.`;
  }

  if (normalized.includes("work") || normalized.includes("office") || normalized.includes("remote")) {
    return `For work-from-home fit, focus on noise, light, room separation, and whether ${property.amenities.join(", ").toLowerCase()} can support a dedicated work zone.`;
  }

  if (amenityHits.length) {
    return `${property.title} directly lines up with ${amenityHits.join(", ")}. I would ask the agent how recently those spaces were updated and how they are used day to day.`;
  }

  if (normalized.includes("private")) {
    return `${property.location} and the ${property.type.toLowerCase()} profile suggest a more private showing strategy. Ask ${property.agent.name} about arrival sequence, sight lines, and neighboring lots.`;
  }

  if (normalized.includes("ask")) {
    return `Ask about recent comparable sales, operating costs, inspection priorities, and how quickly private tours are booking for ${property.location}.`;
  }

  return `${property.title} looks strongest on ${property.tag.toLowerCase()}, ${property.area}, and ${property.amenities
    .slice(0, 3)
    .join(", ")}. If your priority is different, ask about that directly during the private tour.`;
}

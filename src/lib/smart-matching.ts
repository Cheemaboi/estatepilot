import type { FeaturedProperty } from "@/lib/mock-properties";

const lifestyleKeywords = [
  "ocean",
  "water",
  "coastal",
  "city",
  "skyline",
  "private",
  "family",
  "villa",
  "penthouse",
  "pool",
  "garden",
  "terrace",
  "office",
  "quiet",
  "entertain",
];

export type SmartMatch = {
  property: FeaturedProperty;
  score: number;
  reasons: string[];
};

function getSearchText(property: FeaturedProperty) {
  return [
    property.title,
    property.location,
    property.tag,
    property.type,
    property.description,
    property.amenities.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function parseBudgetValue(budget: string) {
  const match = budget.replaceAll(",", "").match(/(\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function parsePriceValue(price: string) {
  const match = price.replaceAll(",", "").match(/(\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

export function getSmartMatches({
  properties,
  query,
  budget,
  timeline,
}: {
  properties: FeaturedProperty[];
  query: string;
  budget: string;
  timeline: string;
}) {
  const normalizedQuery = query.toLowerCase();
  const queryWords = lifestyleKeywords.filter((keyword) =>
    normalizedQuery.includes(keyword),
  );
  const budgetValue = parseBudgetValue(budget);

  return properties
    .map<SmartMatch>((property) => {
      const propertyText = getSearchText(property);
      const matchedWords = queryWords.filter((word) => propertyText.includes(word));
      const priceValue = parsePriceValue(property.price);
      const budgetFit =
        budgetValue && priceValue ? Math.max(0, 24 - Math.abs(priceValue - budgetValue) * 5) : 8;
      const timelineBoost = timeline === "30" ? 8 : timeline === "90" ? 5 : 3;
      const score = Math.min(
        98,
        54 + matchedWords.length * 8 + budgetFit + timelineBoost,
      );
      const reasons = [
        matchedWords.length
          ? `Matches ${matchedWords.slice(0, 3).join(", ")}`
          : `Strong fit for ${property.type.toLowerCase()}`,
        `${property.beds} beds in ${property.location}`,
        `${property.price} target profile`,
      ];

      return {
        property,
        score: Math.round(score),
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score);
}

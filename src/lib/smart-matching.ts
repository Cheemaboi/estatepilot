import type { FeaturedProperty } from "@/lib/mock-properties";

const intentGroups = [
  {
    label: "waterfront setting",
    terms: ["ocean", "water", "waterfront", "coastal", "beach", "sea", "harbor"],
  },
  {
    label: "city energy",
    terms: ["city", "skyline", "downtown", "restaurant", "walkable", "urban"],
  },
  {
    label: "privacy",
    terms: ["private", "quiet", "secluded", "gated", "calm", "peaceful"],
  },
  {
    label: "family scale",
    terms: ["family", "guest", "children", "bedroom", "extended", "multi-generational"],
  },
  {
    label: "entertaining",
    terms: ["entertain", "party", "hosting", "terrace", "pool", "outdoor", "dining"],
  },
  {
    label: "work from home",
    terms: ["office", "studio", "work", "remote", "library"],
  },
  {
    label: "low-maintenance living",
    terms: ["easy", "lock-and-leave", "low-maintenance", "doorman", "managed"],
  },
];

export type SmartMatch = {
  property: FeaturedProperty;
  score: number;
  reasons: string[];
};

type MatchedIntent = {
  label: string;
  hits: string[];
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

function getQueryTokens(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3);
}

function getMatchedIntents(query: string, propertyText: string) {
  return intentGroups
    .map<MatchedIntent>((group) => {
      const hits = group.terms.filter(
        (term) => query.includes(term) && propertyText.includes(term),
      );

      return { label: group.label, hits };
    })
    .filter((intent) => intent.hits.length > 0);
}

function getAmenityMatches(query: string, property: FeaturedProperty) {
  const tokens = getQueryTokens(query);

  return property.amenities.filter((amenity) => {
    const normalizedAmenity = amenity.toLowerCase();

    return tokens.some((token) => normalizedAmenity.includes(token));
  });
}

function getLifestyleSummary(
  property: FeaturedProperty,
  matchedIntents: MatchedIntent[],
  amenityMatches: string[],
) {
  if (matchedIntents.length) {
    return `Best for ${matchedIntents.map((intent) => intent.label).slice(0, 2).join(" and ")}.`;
  }

  if (amenityMatches.length) {
    return `Amenity match: ${amenityMatches.slice(0, 2).join(", ")}.`;
  }

  return `Strong baseline fit for a ${property.type.toLowerCase()} search.`;
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
  const budgetValue = parseBudgetValue(budget);

  return properties
    .map<SmartMatch>((property) => {
      const propertyText = getSearchText(property);
      const matchedIntents = getMatchedIntents(normalizedQuery, propertyText);
      const amenityMatches = getAmenityMatches(normalizedQuery, property);
      const freeTokenHits = getQueryTokens(normalizedQuery).filter((token) =>
        propertyText.includes(token),
      );
      const priceValue = parsePriceValue(property.price);
      const budgetFit =
        budgetValue && priceValue ? Math.max(0, 24 - Math.abs(priceValue - budgetValue) * 5) : 8;
      const timelineBoost = timeline === "30" ? 8 : timeline === "90" ? 5 : 3;
      const score = Math.min(
        98,
        42 +
          matchedIntents.reduce((total, intent) => total + intent.hits.length * 7, 0) +
          amenityMatches.length * 9 +
          Math.min(freeTokenHits.length * 3, 15) +
          budgetFit +
          timelineBoost,
      );
      const reasons = [
        getLifestyleSummary(property, matchedIntents, amenityMatches),
        amenityMatches.length
          ? `Specific amenities: ${amenityMatches.slice(0, 3).join(", ")}.`
          : `${property.beds} beds, ${property.baths} baths, ${property.area}.`,
        budgetValue && priceValue
          ? Math.abs(priceValue - budgetValue) <= 1.5
            ? `Close to your $${budgetValue}M budget signal.`
            : `${property.price} may need budget review.`
          : `${property.price} listed profile.`,
      ];

      return {
        property,
        score: Math.round(score),
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score);
}

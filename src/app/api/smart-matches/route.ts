import { NextResponse } from "next/server";
import type { FeaturedProperty } from "@/lib/mock-properties";
import {
  createOpenRouterJson,
  getOpenRouterModel,
  hasOpenRouterEnv,
} from "@/lib/openrouter";
import { getSmartMatches, type SmartMatch } from "@/lib/smart-matching";
import { getPublicProperties } from "@/lib/supabase/data";

export const dynamic = "force-dynamic";

type SmartMatchesRequest = {
  budget?: string;
  mustHaves?: string[];
  query?: string;
  timeline?: string;
};

type AiMatch = {
  reasons: string[];
  score: number;
  slug: string;
};

type AiSmartMatchesResponse = {
  matches: AiMatch[];
  summary: string;
};

const smartMatchesSchema = {
  additionalProperties: false,
  properties: {
    matches: {
      items: {
        additionalProperties: false,
        properties: {
          reasons: {
            items: { type: "string" },
            maxItems: 3,
            minItems: 2,
            type: "array",
          },
          score: { maximum: 100, minimum: 0, type: "integer" },
          slug: { type: "string" },
        },
        required: ["slug", "score", "reasons"],
        type: "object",
      },
      maxItems: 3,
      minItems: 1,
      type: "array",
    },
    summary: { type: "string" },
  },
  required: ["summary", "matches"],
  type: "object",
};

function getEnrichedQuery(body: SmartMatchesRequest) {
  return [body.query, ...(body.mustHaves ?? [])].filter(Boolean).join(" ");
}

function getLocalResponse(
  properties: FeaturedProperty[],
  body: SmartMatchesRequest,
  fallbackReason?: string,
) {
  const matches = getSmartMatches({
    budget: body.budget ?? "",
    properties,
    query: getEnrichedQuery(body),
    timeline: body.timeline ?? "flexible",
  }).slice(0, 3);

  return {
    fallbackReason,
    matches: matches.map((match) => ({
      reasons: match.reasons,
      score: match.score,
      slug: match.property.slug,
    })),
    source: "local" as const,
    summary:
      fallbackReason ??
      "Using EstatePilot's local matcher until OpenRouter is configured.",
  };
}

function hydrateAiMatches(properties: FeaturedProperty[], aiMatches: AiMatch[]): SmartMatch[] {
  return aiMatches
    .map((match) => {
      const property = properties.find((item) => item.slug === match.slug);

      if (!property) {
        return null;
      }

      return {
        property,
        reasons: match.reasons,
        score: Math.max(0, Math.min(100, Math.round(match.score))),
      };
    })
    .filter((match): match is SmartMatch => Boolean(match))
    .sort((a, b) => b.score - a.score);
}

export async function POST(request: Request) {
  const body = (await request.json()) as SmartMatchesRequest;
  const properties = await getPublicProperties();
  const localResponse = getLocalResponse(properties, body);

  if (!hasOpenRouterEnv()) {
    return NextResponse.json(localResponse);
  }

  try {
    const aiResponse = await createOpenRouterJson<AiSmartMatchesResponse>({
      input: {
        budget: body.budget,
        mustHaves: body.mustHaves ?? [],
        properties: properties.map((property) => ({
          amenities: property.amenities,
          area: property.area,
          baths: property.baths,
          beds: property.beds,
          description: property.description,
          location: property.location,
          price: property.price,
          slug: property.slug,
          tag: property.tag,
          title: property.title,
          type: property.type,
        })),
        query: body.query,
        timeline: body.timeline,
      },
      instructions:
        "Rank luxury real-estate listings for a buyer brief. Use only the provided property facts. Return concise, useful reasons and avoid legal or financial guarantees.",
      schema: smartMatchesSchema,
      schemaName: "estatepilot_smart_matches",
    });
    const hydratedMatches = aiResponse
      ? hydrateAiMatches(properties, aiResponse.matches)
      : [];

    if (!aiResponse || hydratedMatches.length === 0) {
      return NextResponse.json(
        getLocalResponse(properties, body, "OpenRouter returned no valid matches; using local matcher."),
      );
    }

    return NextResponse.json({
      matches: hydratedMatches.map((match) => ({
        reasons: match.reasons,
        score: match.score,
        slug: match.property.slug,
      })),
        model: getOpenRouterModel(),
        source: "openrouter",
        summary: aiResponse.summary,
      });
  } catch (error) {
    const fallbackReason =
      error instanceof Error
        ? error.message
        : "OpenRouter unavailable; using local matcher.";

    return NextResponse.json(
      getLocalResponse(properties, body, fallbackReason),
    );
  }
}

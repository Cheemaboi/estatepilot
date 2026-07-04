import { NextResponse } from "next/server";
import {
  createOpenRouterJson,
  getOpenRouterModel,
  hasOpenRouterEnv,
} from "@/lib/openrouter";
import { getLocalPropertyAnswer } from "@/lib/property-assistant";
import { getPropertyBySlug } from "@/lib/supabase/data";

export const dynamic = "force-dynamic";

type PropertyAssistantRequest = {
  question?: string;
  slug?: string;
};

type AiPropertyAssistantResponse = {
  answer: string;
  followUps: string[];
};

const propertyAssistantSchema = {
  additionalProperties: false,
  properties: {
    answer: { type: "string" },
    followUps: {
      items: { type: "string" },
      maxItems: 3,
      minItems: 2,
      type: "array",
    },
  },
  required: ["answer", "followUps"],
  type: "object",
};

export async function POST(request: Request) {
  const body = (await request.json()) as PropertyAssistantRequest;

  if (!body.slug) {
    return NextResponse.json({ error: "Property slug is required." }, { status: 400 });
  }

  const property = await getPropertyBySlug(body.slug);

  if (!property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  const question = body.question?.trim() || "What should I know about this property?";
  const localAnswer = getLocalPropertyAnswer(property, question);

  if (!hasOpenRouterEnv()) {
    return NextResponse.json({
      answer: localAnswer,
      fallbackReason: "Using local assistant until OpenRouter is configured.",
      followUps: [
        "What should I ask before touring?",
        "How does this compare with similar homes?",
      ],
      source: "local",
    });
  }

  try {
    const aiResponse = await createOpenRouterJson<AiPropertyAssistantResponse>({
      input: {
        property: {
          agent: property.agent,
          amenities: property.amenities,
          area: property.area,
          baths: property.baths,
          beds: property.beds,
          description: property.description,
          location: property.location,
          price: property.price,
          tag: property.tag,
          title: property.title,
          type: property.type,
        },
        question,
      },
      instructions:
        "Answer as a concise luxury real-estate assistant. Use only the provided property facts, suggest practical agent questions when useful, and avoid legal, lending, tax, or investment guarantees.",
      schema: propertyAssistantSchema,
      schemaName: "estatepilot_property_assistant",
    });

    if (!aiResponse?.answer) {
      return NextResponse.json({
        answer: localAnswer,
        fallbackReason: "OpenRouter returned no answer; using local assistant.",
        followUps: [
          "What should I ask before touring?",
          "How does this compare with similar homes?",
        ],
        source: "local",
      });
    }

    return NextResponse.json({
      answer: aiResponse.answer,
      followUps: aiResponse.followUps,
      model: getOpenRouterModel(),
      source: "openrouter",
    });
  } catch (error) {
    const fallbackReason =
      error instanceof Error
        ? error.message
        : "OpenRouter unavailable; using local assistant.";

    return NextResponse.json({
      answer: localAnswer,
      fallbackReason,
      followUps: [
        "What should I ask before touring?",
        "How does this compare with similar homes?",
      ],
      source: "local",
    });
  }
}

"use client";

import { useState } from "react";
import type { FeaturedProperty } from "@/lib/mock-properties";

const suggestedQuestions = [
  "Is this good for entertaining?",
  "What makes it private?",
  "What should I ask the agent?",
];

type PropertyAssistantProps = {
  property: FeaturedProperty;
};

function getAnswer(property: FeaturedProperty, question: string) {
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

  if (normalized.includes("family") || normalized.includes("guest") || normalized.includes("bedroom")) {
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

export function PropertyAssistant({ property }: PropertyAssistantProps) {
  const [question, setQuestion] = useState(suggestedQuestions[0]);
  const [answer, setAnswer] = useState(getAnswer(property, suggestedQuestions[0]));

  function askQuestion(nextQuestion = question) {
    setQuestion(nextQuestion);
    setAnswer(getAnswer(property, nextQuestion));
  }

  return (
    <div>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((item) => (
          <button
            className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-luxury-accent/50 hover:text-white"
            key={item}
            onClick={() => askQuestion(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <label className="mt-5 grid gap-2 text-sm font-medium text-white/78">
        <span>Ask a property question</span>
        <textarea
          className="min-h-24 rounded-[24px] border border-white/12 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-luxury-accent focus:outline-none"
          onChange={(event) => setQuestion(event.target.value)}
          value={question}
        />
      </label>
      <button
        className="mt-4 rounded-full bg-luxury-accent px-5 py-3 text-sm font-semibold text-public-bg transition hover:bg-[#e7cf98]"
        onClick={() => askQuestion()}
        type="button"
      >
        Ask
      </button>
      <div className="mt-5 rounded-[24px] border border-luxury-accent/25 bg-public-bg/55 p-5 text-sm leading-7 text-public-muted">
        {answer}
      </div>
    </div>
  );
}

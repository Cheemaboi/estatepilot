"use client";

import { useState } from "react";
import type { FeaturedProperty } from "@/lib/mock-properties";
import {
  getLocalPropertyAnswer,
  suggestedPropertyQuestions,
} from "@/lib/property-assistant";

type PropertyAssistantProps = {
  property: FeaturedProperty;
};

type PropertyAssistantResponse = {
  answer: string;
  fallbackReason?: string;
  followUps: string[];
  source: "local" | "openrouter";
};

export function PropertyAssistant({ property }: PropertyAssistantProps) {
  const [question, setQuestion] = useState(suggestedPropertyQuestions[0]);
  const [answer, setAnswer] = useState(
    getLocalPropertyAnswer(property, suggestedPropertyQuestions[0]),
  );
  const [followUps, setFollowUps] = useState(suggestedPropertyQuestions);
  const [source, setSource] = useState<"local" | "openrouter">("local");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("EstatePilot assistant ready.");

  async function askQuestion(nextQuestion = question) {
    setQuestion(nextQuestion);
    setStatus("loading");

    try {
      const response = await fetch("/api/property-assistant", {
        body: JSON.stringify({
          question: nextQuestion,
          slug: property.slug,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Property assistant request failed");
      }

      const data = (await response.json()) as PropertyAssistantResponse;

      setAnswer(data.answer);
      setFollowUps(data.followUps.length ? data.followUps : suggestedPropertyQuestions);
      setSource(data.source);
      setStatus("idle");
      setStatusMessage(data.fallbackReason ?? "Answer generated from the live assistant route.");
    } catch {
      setAnswer(getLocalPropertyAnswer(property, nextQuestion));
      setFollowUps(suggestedPropertyQuestions);
      setSource("local");
      setStatus("error");
      setStatusMessage("AI request could not complete, so EstatePilot used guided responses.");
    }
  }

  return (
    <div>
      <div className="mt-4 flex flex-wrap gap-2">
        {followUps.map((item) => (
          <button
            className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-luxury-accent/50 hover:text-white"
            key={item}
            onClick={() => {
              void askQuestion(item);
            }}
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
        className="mt-4 rounded-full bg-luxury-accent px-5 py-3 text-sm font-semibold text-public-bg transition hover:bg-[#e7cf98] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={status === "loading"}
        onClick={() => {
          void askQuestion();
        }}
        type="button"
      >
        {status === "loading" ? "Thinking..." : "Ask"}
      </button>
      <div className="mt-5 rounded-[24px] border border-luxury-accent/25 bg-public-bg/55 p-5 text-sm leading-7 text-public-muted">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <span className="rounded-full border border-luxury-accent/35 bg-luxury-accent/12 px-3 py-1 text-luxury-accent">
            {source === "openrouter" ? "OpenRouter AI" : "EstatePilot AI"}
          </span>
          <span className="text-white/45">
            {status === "error" ? "Recovered" : statusMessage}
          </span>
        </div>
        {answer}
      </div>
    </div>
  );
}

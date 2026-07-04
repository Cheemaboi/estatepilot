type OpenRouterJsonRequest = {
  instructions: string;
  input: unknown;
  schemaName: string;
  schema: Record<string, unknown>;
};

type OpenRouterChoice = {
  message?: {
    content?: string;
  };
};

type OpenRouterResponse = {
  choices?: OpenRouterChoice[];
};

export function getOpenRouterModel() {
  return (process.env.OPENROUTER_MODEL ?? "openai/gpt-4.1-mini").trim();
}

export function hasOpenRouterEnv() {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export async function createOpenRouterJson<T>({
  instructions,
  input,
  schemaName,
  schema,
}: OpenRouterJsonRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    body: JSON.stringify({
      messages: [
        { content: instructions, role: "system" },
        { content: JSON.stringify(input), role: "user" },
      ],
      model: getOpenRouterModel(),
      response_format: {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          schema,
          strict: true,
        },
      },
      structured_outputs: true,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "http://localhost:3000",
      "X-OpenRouter-Title": "EstatePilot",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenRouter request failed with ${response.status}${
        errorText ? `: ${errorText.slice(0, 220)}` : ""
      }`,
    );
  }

  const data = (await response.json()) as OpenRouterResponse;
  const outputText = data.choices?.[0]?.message?.content;

  if (!outputText) {
    throw new Error("OpenRouter response did not include message content");
  }

  return JSON.parse(outputText) as T;
}

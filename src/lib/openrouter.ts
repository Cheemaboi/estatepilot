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
  return process.env.OPENROUTER_MODEL ?? "openrouter/auto";
}

export function hasOpenRouterEnv() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export async function createOpenRouterJson<T>({
  instructions,
  input,
  schemaName,
  schema,
}: OpenRouterJsonRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

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
        json_schema: {
          name: schemaName,
          schema,
          strict: true,
        },
        type: "json_schema",
      },
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-OpenRouter-Title": "EstatePilot",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with ${response.status}`);
  }

  const data = (await response.json()) as OpenRouterResponse;
  const outputText = data.choices?.[0]?.message?.content;

  if (!outputText) {
    throw new Error("OpenRouter response did not include message content");
  }

  return JSON.parse(outputText) as T;
}

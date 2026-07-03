type OpenAiJsonRequest = {
  instructions: string;
  input: unknown;
  schemaName: string;
  schema: Record<string, unknown>;
};

type OpenAiTextPart = {
  type?: string;
  text?: string;
};

type OpenAiOutputItem = {
  content?: OpenAiTextPart[];
};

type OpenAiResponse = {
  output_text?: string;
  output?: OpenAiOutputItem[];
};

export function getOpenAiModel() {
  return process.env.OPENAI_MODEL ?? "gpt-5.5";
}

export function hasOpenAiEnv() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function getOutputText(data: OpenAiResponse) {
  if (data.output_text) {
    return data.output_text;
  }

  return data.output
    ?.flatMap((item) => item.content ?? [])
    .find((part) => part.type === "output_text" && part.text)?.text;
}

export async function createOpenAiJson<T>({
  instructions,
  input,
  schemaName,
  schema,
}: OpenAiJsonRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    body: JSON.stringify({
      input: JSON.stringify(input),
      instructions,
      model: getOpenAiModel(),
      reasoning: { effort: "low" },
      text: {
        format: {
          name: schemaName,
          schema,
          strict: true,
          type: "json_schema",
        },
      },
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const data = (await response.json()) as OpenAiResponse;
  const outputText = getOutputText(data);

  if (!outputText) {
    throw new Error("OpenAI response did not include output text");
  }

  return JSON.parse(outputText) as T;
}

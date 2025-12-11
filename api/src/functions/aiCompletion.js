
const { app } = require("@azure/functions");
const { AzureOpenAI } = require("openai");

const endpoint   = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey     = process.env.AZURE_OPENAI_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = "2024-10-21";

const client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });

async function getResponseFromModel(messagesFromClient) {
  // Ensure only user/assistant roles and strings
  const chatMessages = messagesFromClient
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));

  const response = await client.chat.completions.create({
    model: deployment,
    messages: [
      { role: "system", content: "You are a helpful assistant for a student app." },
      ...chatMessages,
    ],
    max_tokens: 256,
  });

  const reply =
    response.choices?.[0]?.message?.content?.trim() ?? "Failed to generate a response.";

  return reply;
}

app.http("aiCompletion", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "ai-completion",
  handler: async (request, context) => {
    context.log("aiCompletion request:", request.method);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "http://localhost:8081",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return {
        status: 204,
        headers: corsHeaders,
      };
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "Request body must be JSON." },
      };
    }

    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { error: "Request must include a non-empty messages array." },
      };
    }

    try {
      const reply = await getResponseFromModel(messages);

      return {
        status: 200,
        headers: corsHeaders,
        jsonBody: { reply },
      };
    } catch (err) {
      context.log("Azure OpenAI error:", err);

      return {
        status: 500,
        headers: corsHeaders,
        jsonBody: {
          error: "Failed to generate completion.",
          details: err.message ?? String(err),
        },
      };
    }
  },
});

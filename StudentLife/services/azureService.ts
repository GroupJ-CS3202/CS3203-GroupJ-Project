const API_URL = "/api/ai-completion";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function callAi(history: ChatMessage[]) {
  if (!history || history.length === 0) {
    throw new Error("History cannot be empty.");
  }

  const messages = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const authToken = localStorage.getItem('authToken');


  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.log("Failed to parse JSON from server:", e);
    throw new Error("Server did not return valid JSON.");
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return data.reply as string;
}

export async function callAiFromString(
  prompt: string,
  role: ChatMessage["role"] = "user"
) {
  const history: ChatMessage[] = [{ role, content: prompt }];
  return callAi(history);
}


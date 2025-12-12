import { loadAuth } from "./authService";
import type { BackendEvent } from "./sqlFetchService"; // adjust path if needed

export interface InsertEventArgs {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Inserts a new event and returns it using the BackendEvent interface.
 */
export async function insertEvent(
  args: InsertEventArgs
): Promise<BackendEvent> {
  const { title, description, startTime, endTime } = args;

  if (!title || !startTime || !endTime) {
    throw new Error("Event must contain title, startTime, and endTime.");
  }

  const authState = loadAuth();
  if (!authState || !authState.token) {
    throw new Error("Not authenticated");
  }

  const token = authState.token;

  const res = await fetch("/api/insertEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    }),
  });

  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    console.error("Error parsing JSON from server:", e);
    throw new Error("Server did not return valid JSON.");
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  // convert server response into a BackendEvent
  const ev = data.event;

  const backendEvent: BackendEvent = {
    id: ev.id,
    title: ev.title,
    description: ev.description,
    startTime: ev.startTime,
    endTime: ev.endTime,
    isUserOrganizer: ev.isUserOrganizer ?? 1, // should be 1 for creator
  };

  return backendEvent;
}

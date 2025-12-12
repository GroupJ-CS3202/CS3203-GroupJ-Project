import { loadAuth } from "./authService";
import type { BackendEvent } from "./sqlFetchService"; // adjust path if needed

export interface EditEventArgs {
  eventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
}

/**
 * Edits an existing event and returns the updated BackendEvent.
 * Only the organizer can edit an event.
 */
export async function editEvent(args: EditEventArgs): Promise<BackendEvent> {
  const { eventId, title, description, startTime, endTime } = args;

  if (!eventId || !title || !startTime || !endTime) {
    throw new Error("eventId, title, startTime, and endTime are required.");
  }

  const authState = loadAuth();
  if (!authState || !authState.token) {
    throw new Error("Not authenticated");
  }

  const token = authState.token;

  const res = await fetch("/api/editEvent", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": `Bearer ${token}`,
    },
    body: JSON.stringify({
      eventId,
      title,
      description: description || "",
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

  const ev = data.event;

  const backendEvent: BackendEvent = {
    id: ev.id,
    title: ev.title,
    description: ev.description,
    startTime: ev.startTime,
    endTime: ev.endTime,
    isUserOrganizer: 1, // should always be 1 for the organizer
  };

  return backendEvent;
}

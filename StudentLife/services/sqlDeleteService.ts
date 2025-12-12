import { loadAuth } from "./authService";

/**
 * Arguments required to delete an event.
 */
export interface DeleteEventArgs {
  eventId: string;
}

/**
 * Deletes an event by ID. Only the organizer can delete the event.
 * Returns a simple message confirming deletion.
 */
export async function deleteEvent(args: DeleteEventArgs): Promise<{ message: string; eventId: string }> {
  const { eventId } = args;

  if (!eventId) {
    throw new Error("eventId is required to delete an event.");
  }

  const authState = loadAuth();
  if (!authState || !authState.token) {
    throw new Error("Not authenticated");
  }

  const token = authState.token;

  const res = await fetch("/api/deleteEvent", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId }),
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

  return {
    message: data.message,
    eventId: data.eventId,
  };
}

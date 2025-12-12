// StudentLife/src/services/events.ts
import { loadAuth } from "./authService";

export interface BackendEvent {
  id: string;
  title: string;
  description: string;
  startTime: string; 
  endTime: string;   
  isUserOrganizer: number;
}

export interface EventsRangeResult {
  events: BackendEvent[];
}

export async function getEventsInRange(
  startTime: Date,
  endTime: Date
): Promise<EventsRangeResult> {
  if (!startTime || !endTime) {
    throw new Error("Range must have start and end time");
  }

  const authState = loadAuth();
  if (!authState || !authState.token) {
    throw new Error("Not authenticated");
  }

  const token = authState.token;

  const res = await fetch("http://localhost:7071/api/getEventsForRange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": `Bearer ${token}`,
    },
    body: JSON.stringify({
      rangeStart: startTime.toISOString(),
      rangeEnd: endTime.toISOString(),
    }),
  });

  let data: any;
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

  return {
    events: data.userEvents as BackendEvent[],
  };
}

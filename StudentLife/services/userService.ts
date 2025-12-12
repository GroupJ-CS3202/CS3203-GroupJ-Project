// src/services/userService.ts

export interface StoredUser {
  id: number | string;
  name?: string;
  email: string;
}

export interface BackendEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isUserOrganizer: number;
}

const USER_KEY = 'authUser';//refers to the name of the variable within the local storage

export function getStoredUser(): StoredUser | null {
    if (typeof window === 'undefined' || !window.localStorage) {
        return null;
    }
    
    try {
        const raw = window.localStorage.getItem(USER_KEY);
        if (!raw) return null;
        
        const user = JSON.parse(raw) as StoredUser;
        if (!user || !user.email) return null;
        
        return user;
    } catch {
        return null;
    }
}

export function getStoredUserName(): string | null {
    const user = getStoredUser();
    if (!user) return null;
    
    return user.name || user.email || null;
}

export function buildSummaryPrompt(events: BackendEvent[]): string {
  let prompt =
    "You are a summarization bot. Summarize all of these events in 60 words or less.\n\n";

  for (const e of events) {
    prompt +=
      `EventName: ${e.title}\n` +
      `Description: ${e.description}\n` +
      `StartTime: ${e.startTime}\n` +
      `EndTime: ${e.endTime}\n\n`;
  }

  return prompt;
}
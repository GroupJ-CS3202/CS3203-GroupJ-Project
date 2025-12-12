import { buildSummaryPrompt } from "../services/userService";

describe("buildSummaryPrompt", () => {
  it("includes header + all event fields", () => {
    const prompt = buildSummaryPrompt([
      {
        id: "1",
        title: "CS Exam",
        description: "Study hashing",
        startTime: "2025-12-12T10:00:00Z",
        endTime: "2025-12-12T11:00:00Z",
        isUserOrganizer: 1,
      },
    ]);

    expect(prompt).toContain("You are a summarization bot.");
    expect(prompt).toContain("60 words or less");
    expect(prompt).toContain("EventName: CS Exam");
    expect(prompt).toContain("Description: Study hashing");
    expect(prompt).toContain("StartTime: 2025-12-12T10:00:00Z");
    expect(prompt).toContain("EndTime: 2025-12-12T11:00:00Z");
  });
});

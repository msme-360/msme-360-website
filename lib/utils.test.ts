import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge tailwind classes correctly", () => {
    const result = cn("px-2 py-2", "px-4");
    expect(result).toBe("py-2 px-4");
  });

  it("should handle conditional classes", () => {
    const result = cn("flex", true && "hidden", false && "block");
    expect(result).toBe("hidden");
  });
});

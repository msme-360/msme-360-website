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

  it("should handle undefined and null inputs", () => {
    const result = cn("flex", undefined, null, "items-center");
    expect(result).toBe("flex items-center");
  });

  it("should handle empty arrays and objects", () => {
    const result = cn("grid", [], {});
    expect(result).toBe("grid");
  });

  it("should handle nested arrays", () => {
    const result = cn(["flex", ["gap-2", "p-4"]]);
    expect(result).toBe("flex gap-2 p-4");
  });
});

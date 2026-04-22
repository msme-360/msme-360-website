import { describe, it, expect, vi } from "vitest";
import { AppError, ErrorCode, isAppError, withRetry, handleError } from "./error-utils";
import { logger } from "./logger";

// Mock logger to prevent console noise during tests
vi.mock("./logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe("AppError", () => {
  it("should create an instance with correct properties", () => {
    const error = new AppError("Test message", ErrorCode.AUTH_FAILED, { userId: 123 });
    expect(error.message).toBe("Test message");
    expect(error.code).toBe(ErrorCode.AUTH_FAILED);
    expect(error.details).toEqual({ userId: 123 });
    expect(error.name).toBe("AppError");
  });

  it("should return true for isAppError", () => {
    const error = new AppError("Test");
    expect(isAppError(error)).toBe(true);
    expect(isAppError(new Error("Generic"))).toBe(false);
  });

  describe("fromAny", () => {
    it("should return the same error if it is already an AppError", () => {
      const original = new AppError("Existing");
      expect(AppError.fromAny(original)).toBe(original);
    });

    it("should convert a generic Error into an AppError", () => {
      const generic = new Error("Something went wrong");
      const normalized = AppError.fromAny(generic);
      expect(normalized).toBeInstanceOf(AppError);
      expect(normalized.message).toBe("Something went wrong");
      expect(normalized.code).toBe(ErrorCode.INTERNAL_ERROR);
    });

    it("should handle non-error objects", () => {
      const normalized = AppError.fromAny("string error", "Default message");
      expect(normalized.message).toBe("Default message");
      expect((normalized.details as Record<string, unknown>).original).toBe("string error");
    });
  });
});

describe("withRetry", () => {
  it("should return the result of a successful operation", async () => {
    const operation = vi.fn().mockResolvedValue("success");
    const result = await withRetry(operation);
    expect(result).toBe("success");
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("should retry the specified number of times", async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockResolvedValue("success");
    
    const result = await withRetry(operation, { initialDelay: 1 });
    expect(result).toBe("success");
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it("should throw after max retries", async () => {
    const operation = vi.fn().mockRejectedValue(new Error("Constant fail"));
    await expect(withRetry(operation, { maxRetries: 2, initialDelay: 1 })).rejects.toThrow("Constant fail");
    expect(operation).toHaveBeenCalledTimes(3);
  });
});

describe("handleError", () => {
  it("should log and return clean message for AppError", () => {
    const error = new AppError("User message", ErrorCode.VALIDATION_FAILED);
    const result = handleError(error, "test-context");
    expect(result).toBe("User message");
    expect(logger.error).toHaveBeenCalled();
  });

  it("should handle generic errors", () => {
    const error = new Error("System crash");
    const result = handleError(error);
    expect(result).toBe("System crash");
  });
});

import { logger } from "./logger";

/**
 * Standard Application Error Codes
 */
export enum ErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  AUTH_FAILED = 'AUTH_FAILED',
  NAV_FORBIDDEN = 'NAV_FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

/**
 * Standard Application Error
 */
export class AppError extends Error {
  public code: string;
  public details?: unknown;

  constructor(message: string, code: ErrorCode | string = ErrorCode.INTERNAL_ERROR, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }

  /**
   * Normalizes any error into an AppError instance.
   */
  static fromAny(error: unknown, defaultMessage: string = 'An unexpected error occurred'): AppError {
    if (isAppError(error)) return error;
    
    if (error instanceof Error) {
      return new AppError(error.message, ErrorCode.INTERNAL_ERROR, { original: error });
    }
    
    return new AppError(defaultMessage, ErrorCode.INTERNAL_ERROR, { original: error });
  }
}

/**
 * Type guard for AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
}

/**
 * Executes a function with exponential backoff retry logic.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 500,
    maxDelay = 5000,
    factor = 2
  } = options;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) break;

      // Log retry attempt
      logger.warn(`Operation failed, retrying (${attempt + 1}/${maxRetries})...`, "error-utils", { 
        error: error instanceof Error ? error.message : String(error)
      });

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * factor, maxDelay);
    }
  }

  logger.error(`Operation failed after ${maxRetries} retries`, "error-utils", lastError);
  throw lastError;
}

/**
 * Standard error handler for client-side operations.
 */
export function handleError(error: unknown, context: string = 'global') {
  if (isAppError(error)) {
    logger.error(`[${error.code}] ${error.message}`, context, error.details);
    return error.message;
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  logger.error(message, context, error);
  return message;
}

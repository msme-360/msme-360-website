/**
 * MSME 360 Structured Logger
 * Simple console-based structured logging for Next.js Server & Client.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  context?: string;
  data?: unknown;
  error?: Error | unknown;
}

class Logger {
  private format(level: LogLevel, message: string, context?: string, data?: unknown, error?: Error | unknown): LogPayload {
    return {
      message,
      level,
      timestamp: new Date().toISOString(),
      context,
      data,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    };
  }

  private print(payload: LogPayload) {
    const output = JSON.stringify(payload);
    
    switch (payload.level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "info":
        console.info(output);
        break;
      default:
        console.log(output);
    }
  }

  info(message: string, context?: string, data?: unknown) {
    this.print(this.format("info", message, context, data));
  }

  warn(message: string, context?: string, data?: unknown) {
    this.print(this.format("warn", message, context, data));
  }

  error(message: string, context?: string, error?: unknown, data?: unknown) {
    this.print(this.format("error", message, context, data, error));
  }

  debug(message: string, context?: string, data?: unknown) {
    if (process.env.NODE_ENV === "development") {
      this.print(this.format("debug", message, context, data));
    }
  }
}

export const logger = new Logger();

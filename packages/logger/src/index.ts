import type { Logger as PinoLogger } from "pino";
import pino, { DestinationStream, LoggerOptions } from "pino";
// no import of Readable stream

/**
 * Configuration interface for custom logger settings
 */
export interface LoggerConfig {
  level?: string;
  pretty?: boolean;
  // Only DestinationStream or null
  destination?: DestinationStream | null;
}

/**
 * Create a named logger.
 *
 * @param service Name of the service (e.g. "auth", "gateway", etc.)
 * @param config Optional overrides (level, pretty, destination)
 * @returns A Pino logger instance, typed.
 */
export function createLogger(
  service: string,
  config: LoggerConfig = {},
): PinoLogger {
  const baseLevel = config.level || process.env.LOG_LEVEL || "info";
  const isPretty = config.pretty ?? process.env.NODE_ENV !== "production";

  const pinoOpts: LoggerOptions = {
    name: service,
    level: baseLevel,
    transport: undefined,
  };

  if (isPretty) {
    pinoOpts.transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss.l o",
        ignore: "pid,hostname",
      },
    };
  }

  // Cast destination to satisfy TS (we now only accept DestinationStream or null)
  const dest = config.destination ?? undefined;

  const logger = pino(pinoOpts, dest);

  return logger;
}

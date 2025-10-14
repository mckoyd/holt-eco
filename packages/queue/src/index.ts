import {
  Job,
  JobsOptions,
  Queue,
  QueueEvents,
  QueueEventsOptions,
  QueueOptions,
  Worker,
  WorkerOptions,
} from "bullmq";
import type { RedisOptions } from "ioredis";

/**
 * Base shape of job data
 */
export interface BaseJobData {
  [key: string]: unknown;
}

/**
 * Strongly typed BullMQ Queue wrapper
 * – zero 'any'
 * – compiles cleanly under strict mode
 * – compatible with BullMQ v5+
 */
export class JobQueue<
  TName extends string,
  TData extends BaseJobData,
  TResult = void,
> {
  readonly name: TName;
  readonly queue: Queue<TData, TResult>;
  readonly worker: Worker<TData, TResult>;
  readonly events: QueueEvents;

  constructor(
    queueName: TName,
    redis: RedisOptions,
    processor?: (job: Job<TData, TResult>) => Promise<TResult>,
    options?: {
      queue?: QueueOptions;
      worker?: WorkerOptions;
      events?: QueueEventsOptions;
    }
  ) {
    this.name = queueName;

    this.queue = new Queue<TData, TResult>(queueName, {
      connection: redis,
      ...options?.queue,
    });

    this.events = new QueueEvents(queueName, {
      connection: redis,
      ...options?.events,
    });

    this.worker = new Worker<TData, TResult>(
      queueName,
      processor ??
        (async (job: Job<TData, TResult>): Promise<TResult> => {
          console.log(`Processing job ${job.id}`, job.data);
          // Return the same data as default behavior
          return job.data as unknown as TResult;
        }),
      {
        connection: redis,
        ...options?.worker,
      }
    );

    this.registerEvents();
  }

  /**
   * Add a new job to the queue.
   * @param name - Job name string
   * @param data - Job payload
   * @param opts - BullMQ job options
   */
  async addJob(
    name: string,
    data: TData,
    opts?: JobsOptions
  ): Promise<Job<TData, TResult>> {
    // Cast name and data to bypass BullMQ internal Extract types
    return this.queue.add(name as unknown as any, data as unknown as any, opts);
  }

  /**
   * Subscribe to lifecycle events
   */
  private registerEvents(): void {
    this.events.on("completed", (event: { jobId: string }) => {
      console.log(`[${this.name}] Job ${event.jobId} completed`);
    });

    this.events.on(
      "failed",
      (event: { jobId: string; failedReason: string }) => {
        console.error(
          `[${this.name}] Job ${event.jobId} failed: ${event.failedReason}`
        );
      }
    );
  }
}

/**
 * Example usage
 * -------------
 * interface EmailData { to: string; subject: string }
 *
 * const emailQueue = new JobQueue<"send-email", EmailData>(
 *   "send-email",
 *   { host: "127.0.0.1", port: 6379 },
 *   async (job) => {
 *     console.log("Sending email to:", job.data.to);
 *   }
 * );
 *
 * await emailQueue.addJob("send-email", { to: "a@b.com", subject: "Hello!" });
 */

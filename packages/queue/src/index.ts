import { createLogger } from "@holt-eco/logger";
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

const log = createLogger("queue");

/**
 * Base shape of job data.
 */
export interface BaseJobData {
  [key: string]: unknown;
}

/**
 * Strongly typed BullMQ Queue wrapper with logger integration.
 */
export class JobQueue<
  TName extends string,
  TData extends BaseJobData,
  TResult = unknown,
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
    },
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
          log.info(
            { jobId: job.id, jobData: job.data },
            `[${this.name}] Processing job`,
          );
          return job.data as unknown as TResult;
        }),
      {
        connection: redis,
        ...options?.worker,
      },
    );

    this.registerEvents();
  }

  /**
   * Add a new job to the queue.
   * @param jobName - job name string
   * @param data - payload for the job
   * @param opts - BullMQ job options
   */
  async addJob(
    jobName: string,
    data: TData,
    opts?: JobsOptions,
  ): Promise<Job<TData, TResult>> {
    // boundary cast to satisfy BullMQ typings
    return this.queue.add(
      jobName as unknown as any,
      data as unknown as any,
      opts,
    );
  }

  /**
   * Subscribe to job completion/failure events.
   */
  private registerEvents(): void {
    this.events.on("completed", (event: { jobId: string }) => {
      log.info(
        { jobId: event.jobId },
        `[${this.name}] Job ${event.jobId} completed`,
      );
    });

    this.events.on(
      "failed",
      (event: { jobId: string; failedReason: string }) => {
        log.error(
          { jobId: event.jobId, reason: event.failedReason },
          `[${this.name}] Job ${event.jobId} failed: ${event.failedReason}`,
        );
      },
    );
  }
}

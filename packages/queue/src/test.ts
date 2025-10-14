import { JobQueue } from "./index";

async function main() {
  const redis = { host: "127.0.0.1", port: 6379 };

  // ✅ Order: <TName, TData, TResult>
  const queue = new JobQueue<"holt-test", { foo: string }, { echoed: string }>(
    "holt-test",
    redis,
    async (job) => {
      console.log("Processing job inside test:", job.data);
      return { echoed: job.data.foo };
    }
  );

  const job = await queue.addJob(
    // cast name to appease ExtractNameType
    "holt-test" as unknown as string,
    // cast payload to appease ExtractDataType
    { foo: "bar" } as unknown as any
  );

  console.log("Enqueued job:", job.id);

  setTimeout(async () => {
    const j = await queue.queue.getJob(job.id!);
    console.log("State:", await j?.getState());
    console.log("Return:", await j?.returnvalue);
    // process is Node global; need node types installed
    process.exit(0);
  }, 500);
}

main().catch((err: unknown) => {
  console.error("Test error:", err);
  process.exit(1);
});

import { runTest } from "zoltra";

runTest().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});

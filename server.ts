import { Zoltra, Logger, corsPlugin, colorText } from "zoltra";
import { errorPlugin } from "./plugins/error";

const logger = new Logger("Server");

async function startServer() {
  try {
    const app = new Zoltra();

    app.register(corsPlugin());
    app.register(errorPlugin);

    await app.start();

    console.log("Hello");
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to start server: ${colorText(err.message, "red", "bold")}`
    );
    process.exit(1);
  }
}

startServer();

import { zoltraConfig } from "zoltra";

export default zoltraConfig({
  PORT: 8000,
  LOG_LEVEL: "info",
  NODE_ENV: "development",
  error: {
    displayErrObj: true,
    showStack: true,
  },
});

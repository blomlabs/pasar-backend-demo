import { zoltraConfig } from "zoltra";

export default zoltraConfig({
  PORT: 8000,
  LOG_LEVEL: "info",
  NODE_ENV: "development",
  error: {
    displayErrObj: true,
    showStack: true,
    includeErrorMessage: true,
  },
  experimental: {
    dev: {
      turboClient: true,
    },
  },
});
// TODO: Allow terminal input - r for server restart, -s for stop

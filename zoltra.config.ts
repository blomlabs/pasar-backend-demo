import { zoltraConfig } from "zoltra";

export default zoltraConfig({
  PORT: 8000,
  LOG_LEVEL: "info",
  NODE_ENV: "development",
  error: {
    displayErrObj: false,
    showStack: true,
    includeErrorMessage: true,
  },
  experimental: {
    dev: {
      turboClient: false,
    },
  },
});
// TODO: Allow terminal input - r for server restart, -s for stop

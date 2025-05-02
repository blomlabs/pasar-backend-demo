import { createErrorPlugin, Logger } from "zoltra";

export const errorPlugin = createErrorPlugin({
  name: "error-plugin",
  handler: async (err, req, res, next) => {
    const logger = new Logger("ErrorPlugin");

    try {
      let error = {
        ...err,
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
      };

      logger.error(error.name, {
        stack: error.stack,
        message: error.message,
        name: error.name,
      });

      const code = error.statusCode;

      return res.status(code).json({
        success: false,
        error: error.name || "Err",
        message: err.message,
      });
    } catch (internalError) {
      next(internalError);
    }
  },
});

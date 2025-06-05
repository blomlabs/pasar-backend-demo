import { RequestError, ZoltraResponse } from "zoltra";

export const throwIfInvalid = (
  condition: boolean,
  message: string,
  errName: string,
  statusCode: number = 400,
  res: ZoltraResponse | null = null
) => {
  if (condition) {
    if (res) {
      return res
        .status(statusCode)
        .json({ success: false, error: errName, message });
    } else {
      const error = new RequestError(message, errName);
      error.statusCode = statusCode || 400;
      throw error;
    }
  }
};

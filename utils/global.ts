import { RequestError } from "zoltra";

export const throwIfInvalid = (
  condition: boolean,
  message: string,
  errName: string,
  statusCode?: number
) => {
  if (condition) {
    const error = new RequestError(message, errName);
    error.statusCode = statusCode || 403;
    throw error;
  }
};

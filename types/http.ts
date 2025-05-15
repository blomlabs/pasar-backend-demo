import { User } from "./app";

declare module "http" {
  export interface IncomingMessage {
    user: User;
  }
}

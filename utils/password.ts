import { compare, genSalt, hash } from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  return hashedPassword;
}

export async function comparePassword(
  password: string,
  userPassword: string
): Promise<boolean> {
  return await compare(password, userPassword);
}

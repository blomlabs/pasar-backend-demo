#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import crypto from "crypto";

const GenerateAuthSecret = () => {
  const newSecret = crypto.randomUUID();
  const envPath = path.join(process.cwd(), ".env");

  try {
    if (!existsSync(envPath)) {
      console.error("❌ .env file not found.");
      return;
    }

    let envContents = readFileSync(envPath, "utf-8");

    if (/^JWT_AUTH_SECRET=.*/m.test(envContents)) {
      envContents = envContents.replace(
        /^JWT_AUTH_SECRET=.*/m,
        `JWT_AUTH_SECRET="${newSecret}"`
      );
    } else {
      envContents += `\nJWT_AUTH_SECRET="${newSecret}"`;
    }

    writeFileSync(envPath, envContents, "utf-8");

    console.log("✅ JWT_AUTH_SECRET UPDATED");
  } catch (error) {
    console.error("❌", error.message);
  }
};

GenerateAuthSecret();

import jwt from "jsonwebtoken";

import { base64Decode } from "./base64";
import { BasicCredentials, BearerCredential } from "@bariyer/types";

export function _parseBasicCredentials(
  credentials: string
): BasicCredentials | undefined {
  try {
    const decodedCredential = base64Decode(credentials);
    if (decodedCredential.includes(":")) {
      const [username, password] = decodedCredential.split(":");
      return { username, password };
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
}

export function parseBasicCredentialsFromAuthHeader(
  authorizationHeader: string
): BasicCredentials | undefined {
  try {
    const matches = /Basic:?\s(?<credential>[\w=]+)/i.exec(authorizationHeader);

    if (matches?.groups?.credential) {
      return _parseBasicCredentials(matches.groups.credential);
    }

    return undefined;
  } catch (err) {
    return undefined;
  }
}

export function parseBearerCredentialsFromAuthHeader(
  authorizationHeader: string,
  secret_key: string
): Partial<BearerCredential> | undefined {
  try {
    const matches = /Bearer:?\s(?<credential>.*)/i.exec(authorizationHeader);

    if (matches?.groups?.credential) {
      const credential = jwt.verify(matches.groups.credential, secret_key);

      if (typeof credential !== "string") {
        return credential;
      }
    }

    return undefined;
  } catch (err) {
    return undefined;
  }
}
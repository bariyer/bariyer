import { Request, Response, NextFunction } from "express";

import { parseBearerCredentialsFromAuthHeader } from "@bariyer/express/helpers";

/**
 * Bearer authorization middleware
 * @param secret_key jwt secret key
 * @returns bearer authentication middleware for express.js
 */
export function bearerAuth(secret_key: string) {
  return function(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return res.status(400).json({ error: "Authorization header missing!" });
    }

    const bearerCredentials = parseBearerCredentialsFromAuthHeader(
      req.headers.authorization,
      secret_key
    );

    if (!bearerCredentials) {
      return res
        .status(400)
        .json({ error: "Authorization type isn't the Bearer!" });
    }

    next();
  };
}

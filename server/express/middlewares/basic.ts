import { Request, Response, NextFunction } from "express";
import { parseBasicCredentialsFromAuthHeader } from "../helpers";

import { ResponseBody, BasicLocals } from "../types";

// TODO: username and password must be a list of allowed users or a single user
// TODO: also have authorize type like an admin etc.
// TODO: add i18n
/**
 * `@bariyer/express` basic authentication middleware for express.js
 * @param username basic authentication username
 * @param password basic authentication password
 * @returns basic authentication middleware for express.js
 */
export function basicAuth(username: string, password: string) {
  return function(
    req: Request,
    res: Response<ResponseBody, BasicLocals>,
    next: NextFunction
  ) {
    if (!req.headers.authorization) {
      return res.status(400).json({ error: "Authorization header missing!" });
    }

    const basicCredentials = parseBasicCredentialsFromAuthHeader(
      req.headers.authorization
    );

    if (!basicCredentials) {
      return res
        .status(400)
        .json({ error: "Authorization type isn't the Basic!" });
    }

    if (
      username !== basicCredentials.username &&
      password !== basicCredentials.password
    ) {
      return res
        .status(400)
        .json({ error: "Username and password incorrect!" });
    } else if (username !== basicCredentials.username) {
      return res.status(400).json({ error: "Username incorrect!" });
    } else if (password !== basicCredentials.password) {
      return res.status(400).json({ error: "Password incorrect!" });
    } else {
      res.locals.user = {
        username: basicCredentials.username,
        password: basicCredentials.password,
      };

      next();
    }
  };
}

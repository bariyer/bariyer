import { Request, Response, NextFunction } from "express";

export default function basicAuth(username: string, password: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const CREDENTIALS_REGEXP =
        /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/,
      USER_PASS_REGEXP = /^([^:]*):(.*)$/;

    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authorization header missing!" });
    }

    const _match_credential = CREDENTIALS_REGEXP.exec(
      req.headers.authorization
    );

    if (!_match_credential) {
      return res.status(401).json({ error: "Incorrect authorization type!" });
    }

    const _credential = USER_PASS_REGEXP.exec(
      Buffer.from(_match_credential[1], "base64").toString()
    );

    if (!_credential) {
      return res.status(401).json({ error: "Header incorrect credential!" });
    }

    if (username !== _credential[1]) {
      return res.status(401).json({ error: "Username incorrect!" });
    } else if (password !== _credential[2]) {
      return res.status(401).json({ error: "Password incorrect!" });
    } else {
      next();
    }
  };
}

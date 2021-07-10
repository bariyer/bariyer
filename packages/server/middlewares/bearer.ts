import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getAccessTokenFromHeader } from "../helpers/authorization";
import { AuthorizationError } from "../helpers/error";

/**
 * Bearer authorization middleware
 * @param secret_key
 * @returns
 */
export default function bearerAuth(secret_key: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const access_token = getAccessTokenFromHeader(req.headers);

    if (!access_token) {
      return res
        .status(400)
        .json(AuthorizationError.response("Authorization header incorrect"));
    }
    jwt.verify(access_token, secret_key, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json(
            AuthorizationError.response(`Authorization credentials incorrect`)
          );
      }
      console.info("\nLogged in as:", decode);
      // res.status(200).json(decode);
      next();
    });
  };
}

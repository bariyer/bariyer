import { getMockReq, getMockRes } from "@jest-mock/express";
import { Response } from "express";
import * as jwt from "jsonwebtoken";

import { middlewares } from "@bariyer/express";
import { ResponseBody } from "@bariyer/express/types";

describe("bearer authenticaton middleware", () => {
  const secret_key = "secret_key";

  const { res, next, clearMockRes } = getMockRes<Response<ResponseBody>>();
  const bearerAuthMiddleware = middlewares.bearerAuth(secret_key);

  beforeEach(() => {
    clearMockRes();
  });

  test("should status code is 400 if authorization header is missing", () => {
    const req = getMockReq();

    bearerAuthMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining<ResponseBody>({
        error: expect.stringMatching(/.*?\bheader\b.*?\bmissing\b.*?$/i),
      })
    );
  });

  test("should status code is 400 if authorization method isn't Bearer", () => {
    const req = getMockReq({
      headers: {
        authorization: "Basic token",
      },
    });

    bearerAuthMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining<ResponseBody>({
        error: expect.stringMatching(/.*?\bisn\'t\b.*?\bbearer\b.*?$/i),
      })
    );
  });

  test("should call next if everything correctly", () => {
    const credentials = {
      id: "id",
      username: "username",
      password: "$2a$10$BSrgkOMyxuKU.DhLld6N7uPE6jw68e.GLe/VQ.9ALPtZ/W7sFm2ly",
    };

    const token = jwt.sign(credentials, secret_key);

    const req = getMockReq({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    bearerAuthMiddleware(req, res, next);

    expect(res.json).not.toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

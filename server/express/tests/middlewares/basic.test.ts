import { getMockReq, getMockRes } from "@jest-mock/express";
import { Response } from "express";

import { middlewares } from "@bariyer/express";
import { base64Encode } from "@bariyer/express/helpers";
import { ResponseBody, BasicLocals } from "@bariyer/express/types";

describe("basic authenticaton middleware", () => {
  const { res, next, clearMockRes } = getMockRes<
    Response<ResponseBody, BasicLocals>
  >();
  const basicAuthMiddleware = middlewares.basicAuth("username", "password");

  beforeEach(() => {
    clearMockRes();
  });

  test("should status code is 400 if authorization header is missing", () => {
    const req = getMockReq();

    basicAuthMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining<ResponseBody>({
        error: expect.stringMatching(/.*?\bheader\b.*?\bmissing\b.*?$/i),
      })
    );
  });

  test("should status code is 400 if authorization method isn't Basic", () => {
    const req = getMockReq({
      headers: {
        authorization: "Bearer token",
      },
    });

    basicAuthMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining<ResponseBody>({
        error: expect.stringMatching(/.*?\bisn\'t\b.*?\bbasic\b.*?$/i),
      })
    );
  });

  test("should status code is 400 if username is incorrect", () => {
    const req = getMockReq({
      headers: {
        authorization: `Basic ${base64Encode("john:password")}`,
      },
    });

    basicAuthMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining<ResponseBody>({
        error: expect.stringMatching(/.*?\busername\b.*?\bincorrect\b.*?$/i),
      })
    );
  });

  test("should status code is 400 if password is incorrect", () => {
    const req = getMockReq({
      headers: {
        authorization: `Basic ${base64Encode("username:123456")}`,
      },
    });

    basicAuthMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining<ResponseBody>({
        error: expect.stringMatching(/.*?\bpassword\b.*?\bincorrect\b.*?$/i),
      })
    );
  });

  test("should call next if everything correctly", () => {
    const req = getMockReq({
      headers: {
        authorization: `Basic ${base64Encode("username:password")}`,
      },
    });

    basicAuthMiddleware(req, res, next);

    expect(res.locals.user).not.toBeUndefined();
    expect(res.locals.user).toEqual(
      expect.objectContaining({
        username: "username",
        password: "password",
      })
    );
    expect(next).toHaveBeenCalledTimes(1);
  });
});

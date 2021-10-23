import {
  _parseBasicCredentials,
  parseBasicCredentialsFromAuthHeader,
  parseBearerCredentialsFromAuthHeader,
} from "@bariyer/express/helpers";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

describe("token helpers", () => {
  describe(`${_parseBasicCredentials.name}()`, () => {
    test("should parse basic credential", () => {
      const credential = _parseBasicCredentials("dXNlcm5hbWU6cGFzc3dvcmQ=");
      expect(credential).not.toBeUndefined();
      expect(credential!.username).toBe("username");
      expect(credential!.password).toBe("password");
    });
  });

  describe(`${parseBasicCredentialsFromAuthHeader.name}()`, () => {
    test("should parse basic credential from auth header", () => {
      const credential = parseBasicCredentialsFromAuthHeader(
        "Basic dXNlcm5hbWU6cGFzc3dvcmQ="
      );
      expect(credential).not.toBeUndefined();
      expect(credential!.username).toBe("username");
      expect(credential!.password).toBe("password");
    });
  });

  describe(`${parseBearerCredentialsFromAuthHeader.name}()`, () => {
    test("should parse bearer credential from auth header", () => {
      const secret_key = "secret";
      const payload = {
        id: "6n7f1isd9pul7jzbigue0ilk",
        username: "john",
        password: bcrypt.hashSync("123456", 10),
      };

      const token = jwt.sign(payload, secret_key);

      const credential = parseBearerCredentialsFromAuthHeader(
        `Bearer ${token}`,
        secret_key
      );
      expect(credential).not.toBeUndefined();
      expect(credential).toEqual(expect.objectContaining(payload));
    });
  });
});

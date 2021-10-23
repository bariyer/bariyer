import { base64Encode, base64Decode } from "@bariyer/express/helpers";

describe("helpers/base64", () => {
  describe("base64Encode", () => {
    test("should encode a string", () => {
      expect(base64Encode("test")).toBe("dGVzdA==");
    });

    test("should encode a string with whitespace", () => {
      expect(base64Encode("test ")).toBe("dGVzdCA=");
    });
  });

  describe("base64Decode", () => {
    test("should decode a string", () => {
      expect(base64Decode("dGVzdA==")).toBe("test");
    });

    test("should decode a string with whitespace", () => {
      expect(base64Decode("dGVzdCA=")).toBe("test ");
    });
  });
});

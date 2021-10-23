export function base64Encode(text: string): string {
  return Buffer.from(text).toString("base64");
}

export function base64Decode(text: string): string {
  return Buffer.from(text, "base64").toString("utf-8");
}

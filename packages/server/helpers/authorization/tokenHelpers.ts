import { IncomingHttpHeaders } from "http";

const AUTH_BEARER_TOKEN_REGEX = /Bearer:?\s(?<access_token>.*)/gi;

export function getAccessTokenFromHeader(
  headers: IncomingHttpHeaders
): string | null {
  if (headers.authorization) {
    const _matches = AUTH_BEARER_TOKEN_REGEX.exec(headers.authorization);

    if (_matches?.groups?.access_token) {
      return _matches.groups.access_token;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

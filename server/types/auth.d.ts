import type { JwtPayload } from "jsonwebtoken"

export interface BasicCredentials {
  username: string;
  password: string;
}

export interface BearerCredential extends JwtPayload {
  id: string;
  username: string;
  password: string;
};
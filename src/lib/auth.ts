import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-not-for-production";

export interface StudentTokenPayload {
  id: string;
  name: string;
  mobileNumber: string;
  role: "student";
}

export interface AdminTokenPayload {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export type TokenPayload = StudentTokenPayload | AdminTokenPayload;

export function signToken(payload: TokenPayload): string {
  const expiresIn = payload.role === "admin" ? "1d" : "7d";
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const header = JSON.parse(base64UrlDecode(headerB64));
    const payload = JSON.parse(base64UrlDecode(payloadB64));

    if (header.alg !== "HS256") return null;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(JWT_SECRET);
    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
      c.charCodeAt(0)
    );

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      signature,
      encoder.encode(`${headerB64}.${payloadB64}`)
    );

    if (!isValid) return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get("yogsadhak_token");
  return cookie?.value ?? null;
}

export async function getStudentFromRequestEdge(req: NextRequest): Promise<StudentTokenPayload | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = await verifyTokenEdge(token);
  if (!payload || payload.role !== "student") return null;
  return payload as StudentTokenPayload;
}

export async function getAdminFromRequestEdge(req: NextRequest): Promise<AdminTokenPayload | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = await verifyTokenEdge(token);
  if (!payload || payload.role !== "admin") return null;
  return payload as AdminTokenPayload;
}

export function getStudentFromRequest(req: NextRequest): StudentTokenPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== "student") return null;
  return payload as StudentTokenPayload;
}

export function getAdminFromRequest(req: NextRequest): AdminTokenPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload as AdminTokenPayload;
}

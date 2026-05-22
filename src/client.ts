import type { HttpMethod } from "./endpoints.js";

const DEFAULT_BASE_URL = "https://api.mangools.com/v3";

export interface CallOptions {
  method: HttpMethod;
  path: string;
  pathParams?: Record<string, string | number>;
  query?: Record<string, unknown>;
  body?: unknown;
}

export interface MangoolsResponse {
  status: number;
  ok: boolean;
  contentType: string | null;
  url: string;
  body: unknown;
}

function substitutePath(
  path: string,
  pathParams: Record<string, string | number> = {},
): string {
  return path.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = pathParams[key];
    if (value === undefined || value === null || value === "") {
      throw new Error(`Missing path parameter '${key}' for ${path}`);
    }
    return encodeURIComponent(String(value));
  });
}

function buildQueryString(query: Record<string, unknown> = {}): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      for (const item of v) usp.append(k, String(item));
    } else if (typeof v === "object") {
      usp.append(k, JSON.stringify(v));
    } else {
      usp.append(k, String(v));
    }
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export function getApiToken(): string {
  const token = process.env.MANGOOLS_API_TOKEN ?? "";
  if (!token) {
    throw new Error(
      "MANGOOLS_API_TOKEN env variable is not set. Add it to your .mcp.json env block.",
    );
  }
  return token;
}

export function getBaseUrl(): string {
  return process.env.MANGOOLS_BASE_URL ?? DEFAULT_BASE_URL;
}

export async function callMangools(
  opts: CallOptions,
): Promise<MangoolsResponse> {
  const token = getApiToken();
  const base = getBaseUrl().replace(/\/+$/, "");
  const resolvedPath = substitutePath(opts.path, opts.pathParams);
  const url = `${base}${resolvedPath}${buildQueryString(opts.query)}`;

  const headers: Record<string, string> = {
    "x-access-token": token,
    accept: "application/json",
  };

  let bodyInit: BodyInit | undefined;
  if (opts.body !== undefined && opts.method !== "GET") {
    headers["content-type"] = "application/json";
    bodyInit =
      typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  }

  const res = await fetch(url, {
    method: opts.method,
    headers,
    body: bodyInit,
  });

  const contentType = res.headers.get("content-type");
  let parsed: unknown;
  const text = await res.text();
  if (contentType && contentType.includes("application/json")) {
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }
  } else {
    parsed = text;
  }

  return {
    status: res.status,
    ok: res.ok,
    contentType,
    url,
    body: parsed,
  };
}

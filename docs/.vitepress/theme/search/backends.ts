import { formatMessage, resolveMessages } from "../i18n";
import type {
  AkariMessages,
  AkariSearchBackendConfig,
  AkariSearchResult,
} from "../types";
import { searchLocal } from "./local";
import { getSearchBackend } from "./registry";
import type { AkariSearchBackend, AkariSearchContext } from "./types";

const MAX_TITLE_LENGTH = 200;
const MAX_EXCERPT_LENGTH = 320;

interface HttpSearchBackendConfig {
  type: "http";
  endpoint: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  queryParam?: string;
  limitParam?: string;
}

export type AkariSearchErrorCode =
  | "index-unavailable"
  | "index-invalid"
  | "request-failed"
  | "backend-missing";

const ERROR_MESSAGES: Record<AkariSearchErrorCode, keyof AkariMessages> = {
  "index-unavailable": "searchIndexUnavailable",
  "index-invalid": "searchIndexInvalid",
  "request-failed": "searchRequestFailed",
  "backend-missing": "searchBackendMissing",
};

/**
 * A failure of a built-in backend. The dialog shows it in the reader's
 * language; `message` is the English text for logs.
 */
export class AkariSearchError extends Error {
  constructor(
    readonly code: AkariSearchErrorCode,
    readonly params: Readonly<Record<string, string | number>> = {},
  ) {
    super(formatMessage(resolveMessages("en")[ERROR_MESSAGES[code]], params));
    this.name = "AkariSearchError";
  }
}

/** Text for a failed search, in the language of `messages`. */
export function describeSearchError(
  cause: unknown,
  messages: AkariMessages,
): string {
  if (cause instanceof AkariSearchError) {
    return formatMessage(messages[ERROR_MESSAGES[cause.code]], cause.params);
  }

  // Custom backends speak for themselves.
  if (cause instanceof Error && cause.message) return cause.message;
  return messages.searchFailed;
}

export function resolveSearchEndpoint(endpoint: string, base = "/"): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(endpoint)) return endpoint;

  const normalizedBase = base === "/" ? "" : base.replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${normalizedBase}${path}` || "/";
}

function normalizeField(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function unwrapResults(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;

  const record = toRecord(raw);
  if (record && Array.isArray(record.results)) return record.results;
  if (record && Array.isArray(record.data)) return record.data;

  return [];
}

export function normalizeSearchResults(
  raw: unknown,
  limit: number,
): AkariSearchResult[] {
  const results: AkariSearchResult[] = [];
  const seen = new Set<string>();

  for (const item of unwrapResults(raw)) {
    const record = toRecord(item);
    if (!record) continue;

    const href = normalizeField(record.href ?? record.url ?? record.path);
    const rawTitle =
      record.title ?? record.heading ?? record.pageTitle ?? record.name;
    const title = normalizeField(rawTitle);

    if (!href || !title) continue;

    const key = `${href}::${title}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const pageTitle =
      normalizeField(record.pageTitle ?? record.page ?? title) ?? title;
    const heading = normalizeField(record.heading ?? record.section);
    const excerpt =
      normalizeField(
        record.excerpt ?? record.snippet ?? record.content ?? record.description,
      ) ?? "";
    const id = normalizeField(record.id) ?? `${href}::${results.length}`;

    results.push({
      id,
      title: title.slice(0, MAX_TITLE_LENGTH),
      href,
      pageTitle: pageTitle.slice(0, MAX_TITLE_LENGTH),
      heading: heading?.slice(0, MAX_TITLE_LENGTH),
      excerpt: excerpt.slice(0, MAX_EXCERPT_LENGTH),
    });

    if (results.length >= limit) break;
  }

  return results;
}

function rejectedAbort(): Error {
  const error = new Error("Search aborted");
  error.name = "AbortError";
  return error;
}

/**
 * Searches the index VitePress builds for the locale being read. The index
 * module is loaded on the first search, so a site on another backend never
 * downloads it.
 */
function createLocalSearchBackend(): AkariSearchBackend {
  return {
    async search(query, context) {
      if (context.signal?.aborted) throw rejectedAbort();

      const { loadLocalIndex, MissingLocalIndexError } = await import(
        "./localIndex"
      );
      let index: Awaited<ReturnType<typeof loadLocalIndex>>;
      try {
        index = await loadLocalIndex(context.locale ?? "root");
      } catch (error) {
        throw error instanceof MissingLocalIndexError ||
          !(error instanceof SyntaxError)
          ? new AkariSearchError("index-unavailable")
          : new AkariSearchError("index-invalid");
      }

      if (context.signal?.aborted) throw rejectedAbort();
      return searchLocal(index, query, context.limit);
    },
  };
}

export interface HttpRequestInit {
  url: string;
  init: RequestInit;
}

export function buildHttpRequest(
  config: HttpSearchBackendConfig,
  query: string,
  limit: number,
  base = "/",
): HttpRequestInit {
  const endpoint = resolveSearchEndpoint(config.endpoint, base);
  const queryParam = config.queryParam?.trim() || "q";
  const limitParam = config.limitParam?.trim() || "limit";
  const method = config.method === "POST" ? "POST" : "GET";
  const headers = { ...(config.headers ?? {}) };

  if (method === "GET") {
    const separator = endpoint.includes("?") ? "&" : "?";
    const params = new URLSearchParams();
    params.set(queryParam, query);
    params.set(limitParam, String(limit));

    return {
      url: `${endpoint}${separator}${params.toString()}`,
      init: {
        method,
        headers,
        credentials: config.credentials ?? "same-origin",
        cache: "no-store",
      },
    };
  }

  if (
    !Object.keys(headers).some(
      (key) => key.toLowerCase() === "content-type",
    )
  ) {
    headers["Content-Type"] = "application/json";
  }

  return {
    url: endpoint,
    init: {
      method,
      headers,
      credentials: config.credentials ?? "same-origin",
      cache: "no-store",
      body: JSON.stringify({
        [queryParam]: query,
        [limitParam]: limit,
      }),
    },
  };
}

function createHttpSearchBackend(
  config: HttpSearchBackendConfig,
  base: string,
): AkariSearchBackend {
  return {
    async search(query, context) {
      const request = buildHttpRequest(config, query, context.limit, base);
      const response = await fetch(request.url, {
        ...request.init,
        signal: context.signal,
      });

      if (!response.ok) {
        throw new AkariSearchError("request-failed", {
          status: response.status,
        });
      }

      return normalizeSearchResults(
        await response.json(),
        context.limit,
      );
    },
  };
}

function createRegisteredSearchBackend(id: string): AkariSearchBackend {
  return {
    async search(query, context) {
      const handler = getSearchBackend(id);

      if (!handler) {
        throw new AkariSearchError("backend-missing", { id });
      }

      const result = await handler(query, context);

      return normalizeSearchResults(result, context.limit);
    },
  };
}

export function createSearchBackend(
  config: AkariSearchBackendConfig,
  options: { base?: string } = {},
): AkariSearchBackend {
  const base = options.base ?? "/";

  switch (config.type) {
    case "http":
      return createHttpSearchBackend(config, base);
    case "registered":
      return createRegisteredSearchBackend(config.id);
    case "local":
    default:
      return createLocalSearchBackend();
  }
}

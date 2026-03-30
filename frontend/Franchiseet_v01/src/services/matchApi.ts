export interface BackendTopMatch {
  "Brand Name": string;
  "Contact Email": string;
  total_score: number;
  asset_match_score: number;
  investment_score: number;
  trait_score: number;
  industry_score: number;
}

export interface MatchApiResponse {
  franchisee_name: string;
  top_matches: BackendTopMatch[];
}

export interface MatchProfileRequest {
  first_name: string;
  last_name: string;
  email: string;
  asset_type: string;
  liquid_asset_inr: number;
  preferred_industry: string;
  traits: string[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8000";

const REQUEST_TIMEOUT_MS = 10000;
const MAX_RETRIES = 1;

async function postWithTimeoutAndRetry<T>(
  path: string,
  payload: unknown,
  attempt = 0,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const errorBody = (await response.json()) as { detail?: string };
        if (errorBody.detail) {
          message = errorBody.detail;
        }
      } catch {
        // Keep default message for non-JSON error responses.
      }
      throw new Error(message);
    }

    return (await response.json()) as T;
  } catch (error) {
    const isAbort = error instanceof DOMException && error.name === "AbortError";
    const isNetworkIssue = error instanceof TypeError || isAbort;

    if (isNetworkIssue && attempt < MAX_RETRIES) {
      return postWithTimeoutAndRetry<T>(path, payload, attempt + 1);
    }

    if (isAbort) {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchMatchesByEmail(email: string): Promise<MatchApiResponse> {
  return postWithTimeoutAndRetry<MatchApiResponse>("/match", { email });
}

export async function fetchMatchesByProfile(
  payload: MatchProfileRequest,
): Promise<MatchApiResponse> {
  return postWithTimeoutAndRetry<MatchApiResponse>("/match/profile", payload);
}

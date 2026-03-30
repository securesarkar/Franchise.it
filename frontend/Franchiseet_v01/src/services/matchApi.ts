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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8000";

export async function fetchMatchesByEmail(email: string): Promise<MatchApiResponse> {
  const response = await fetch(`${API_BASE_URL}/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    let message = `Failed to fetch matches (${response.status})`;
    try {
      const errorBody = (await response.json()) as { detail?: string };
      if (errorBody.detail) {
        message = errorBody.detail;
      }
    } catch {
      // Fall back to default message when error response is not JSON.
    }
    throw new Error(message);
  }

  return (await response.json()) as MatchApiResponse;
}

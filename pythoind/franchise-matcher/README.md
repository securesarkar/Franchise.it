# Franchise Matcher Backend

FastAPI backend for franchise recommendation based on dataset and live profile matching.

## Run

1. Create/activate a Python environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start server:

```bash
uvicorn app:app --reload --port 8000
```

## Endpoints

- `GET /health`
  - Returns service health status.

- `POST /match`
  - Lookup by existing dataset email.
  - Request body:

```json
{
  "email": "shruti.mehta3484@gmail.com"
}
```

- `POST /match/profile`
  - Match using live profile payload (works even if email is not in CSV).
  - Request body:

```json
{
  "first_name": "Demo",
  "last_name": "User",
  "email": "demo@user.com",
  "asset_type": "Retail Space",
  "liquid_asset_inr": 3500000,
  "preferred_industry": "HORECA",
  "traits": ["Strategic Planner", "Execution Specialist", "Confident Leader"]
}
```

Both match endpoints return:

```json
{
  "franchisee_name": "...",
  "top_matches": [
    {
      "Brand Name": "...",
      "Contact Email": "...",
      "total_score": 90.0,
      "asset_match_score": 30.0,
      "investment_score": 20.0,
      "trait_score": 30.0,
      "industry_score": 10.0
    }
  ]
}
```

## Notes

- CORS is enabled for `http://localhost:5173` and `http://127.0.0.1:5173`.
- Datasets are loaded at startup from the `data` folder (with fallback path resolution).

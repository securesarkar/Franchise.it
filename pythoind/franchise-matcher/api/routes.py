from __future__ import annotations

import logging
from typing import Any

import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from data.loader import load_datasets
from model.matcher import match_franchisee_to_franchisors

router = APIRouter()
logger = logging.getLogger(__name__)

franchisees_df: pd.DataFrame | None = None
franchisors_df: pd.DataFrame | None = None


class MatchRequest(BaseModel):
    email: str


@router.on_event("startup")
def load_dataframes() -> None:
    global franchisees_df, franchisors_df
    franchisees_df, franchisors_df = load_datasets()


@router.post("/match")
def match_franchisee(payload: MatchRequest) -> dict[str, Any]:
    if franchisees_df is None or franchisors_df is None:
        raise HTTPException(status_code=500, detail="Datasets are not loaded")

    target_email = payload.email.strip().lower()
    if not target_email:
        raise HTTPException(status_code=400, detail="Email is required")

    logger.info("Match lookup requested for email=%s", target_email)

    franchisee_rows = franchisees_df[
        franchisees_df["Email"].astype(str).str.strip().str.lower() == target_email
    ]

    if franchisee_rows.empty:
        raise HTTPException(status_code=404, detail="Franchisee email not found")

    franchisee_row = franchisee_rows.iloc[0]
    top_matches_df = match_franchisee_to_franchisors(franchisee_row, franchisors_df)

    full_name = (
        f"{str(franchisee_row.get('First Name', '')).strip()} "
        f"{str(franchisee_row.get('Last Name', '')).strip()}"
    ).strip()

    return {
        "franchisee_name": full_name,
        "top_matches": top_matches_df.to_dict(orient="records"),
    }

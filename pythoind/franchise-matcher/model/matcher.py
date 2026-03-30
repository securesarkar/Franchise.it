from __future__ import annotations

from typing import Any

import pandas as pd


def _normalize_text(value: Any) -> str:
	if pd.isna(value):
		return ""
	return str(value).strip().lower()


def _to_float(value: Any) -> float:
	if pd.isna(value):
		return 0.0

	if isinstance(value, (int, float)):
		return float(value)

	cleaned = (
		str(value)
		.replace(",", "")
		.replace("INR", "")
		.replace("Rs.", "")
		.replace("Rs", "")
		.replace("₹", "")
		.strip()
	)
	try:
		return float(cleaned)
	except ValueError:
		return 0.0


def _extract_franchisee_traits(franchisee_row: pd.Series) -> list[str]:
	if "traits_list" in franchisee_row and isinstance(franchisee_row["traits_list"], list):
		return [_normalize_text(t) for t in franchisee_row["traits_list"] if _normalize_text(t)]

	traits = [
		franchisee_row.get("Trait 1"),
		franchisee_row.get("Trait 2"),
		franchisee_row.get("Trait 3"),
	]
	return [_normalize_text(t) for t in traits if _normalize_text(t)]


def _extract_franchisor_traits(franchisor_row: pd.Series) -> list[str]:
	if "traits_list" in franchisor_row and isinstance(franchisor_row["traits_list"], list):
		return [_normalize_text(t) for t in franchisor_row["traits_list"] if _normalize_text(t)]

	raw_traits = franchisor_row.get("Expected Personality Traits", "")
	return [_normalize_text(t) for t in str(raw_traits).split(",") if _normalize_text(t)]


def match_franchisee_to_franchisors(
	franchisee_row: pd.Series, franchisors_df: pd.DataFrame
) -> pd.DataFrame:
	"""Return top 5 franchisors ranked by matching score out of 100."""
	franchisee_asset_type = _normalize_text(franchisee_row.get("Asset Type"))
	franchisee_liquid_asset = _to_float(franchisee_row.get("Liquid Asset INR"))
	franchisee_industry = _normalize_text(franchisee_row.get("Preferred Industry"))
	franchisee_traits = set(_extract_franchisee_traits(franchisee_row))

	scored_rows: list[dict[str, Any]] = []

	for _, franchisor_row in franchisors_df.iterrows():
		required_asset_type = _normalize_text(franchisor_row.get("Required Asset Type"))
		required_investment = _to_float(franchisor_row.get("Required Investment INR"))
		franchisor_industry = _normalize_text(franchisor_row.get("Industry"))
		required_traits = _extract_franchisor_traits(franchisor_row)

		asset_match_score = 30.0 if franchisee_asset_type == required_asset_type else 0.0

		if required_investment <= 0 or franchisee_liquid_asset < required_investment:
			investment_score = 0.0
		else:
			ratio = franchisee_liquid_asset / required_investment
			if ratio <= 1.2:
				investment_score = 30.0
			elif ratio <= 1.5:
				investment_score = 20.0
			elif ratio <= 2.0:
				investment_score = 10.0
			else:
				investment_score = 0.0

		if required_traits:
			matched_traits = franchisee_traits.intersection(set(required_traits))
			trait_score = (len(matched_traits) / len(required_traits)) * 30.0
		else:
			trait_score = 0.0

		industry_score = 10.0 if franchisee_industry == franchisor_industry else 0.0

		total_score = asset_match_score + investment_score + trait_score + industry_score

		scored_rows.append(
			{
				"Brand Name": franchisor_row.get("Brand Name"),
				"Contact Email": franchisor_row.get("Contact Email"),
				"total_score": round(total_score, 2),
				"asset_match_score": round(asset_match_score, 2),
				"investment_score": round(investment_score, 2),
				"trait_score": round(trait_score, 2),
				"industry_score": round(industry_score, 2),
			}
		)

	result_df = pd.DataFrame(scored_rows)
	return result_df.sort_values(by="total_score", ascending=False).head(5).reset_index(drop=True)

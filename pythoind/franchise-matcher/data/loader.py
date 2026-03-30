from __future__ import annotations

from pathlib import Path

import pandas as pd


def _resolve_csv_path(filename: str) -> Path:
	"""Resolve CSV path from common project locations."""
	data_dir = Path(__file__).resolve().parent
	candidates = [
		data_dir / filename,
		data_dir.parent / filename,
		data_dir.parent.parent / filename,
	]

	for path in candidates:
		if path.exists():
			return path

	raise FileNotFoundError(f"Could not find CSV file: {filename}")


def load_datasets() -> tuple[pd.DataFrame, pd.DataFrame]:
	"""
	Load franchisee/franchisor datasets and create normalized trait list columns.

	Returns:
		Tuple of (franchisee_df, franchisor_df)
	"""
	franchisee_path = _resolve_csv_path("franchisee_dataset_2000.csv")
	franchisor_path = _resolve_csv_path("franchisor_dataset_2000.csv")

	franchisee_df = pd.read_csv(franchisee_path)
	franchisor_df = pd.read_csv(franchisor_path)

	trait_cols = ["Trait 1", "Trait 2", "Trait 3"]
	franchisee_df["traits_list"] = franchisee_df[trait_cols].apply(
		lambda row: [str(v).strip() for v in row if pd.notna(v) and str(v).strip()], axis=1
	)

	franchisor_df["traits_list"] = franchisor_df["Expected Personality Traits"].fillna("").apply(
		lambda traits: [t.strip() for t in str(traits).split(",") if t.strip()]
	)

	return franchisee_df, franchisor_df

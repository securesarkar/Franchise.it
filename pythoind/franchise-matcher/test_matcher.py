from __future__ import annotations

from tabulate import tabulate

from data.loader import load_datasets
from model.matcher import match_franchisee_to_franchisors


def main() -> None:
    franchisees_df, franchisors_df = load_datasets()

    if franchisees_df.empty:
        print("No franchisee records found in franchisee_dataset_2000.csv")
        return

    franchisee_row = franchisees_df.iloc[0]

    first_name = str(franchisee_row.get("First Name", "")).strip()
    last_name = str(franchisee_row.get("Last Name", "")).strip()
    franchisee_name = f"{first_name} {last_name}".strip()
    asset_type = str(franchisee_row.get("Asset Type", "")).strip()
    liquid_asset = franchisee_row.get("Liquid Asset INR", "")

    traits = franchisee_row.get("traits_list")
    if not isinstance(traits, list):
        traits = [
            str(franchisee_row.get("Trait 1", "")).strip(),
            str(franchisee_row.get("Trait 2", "")).strip(),
            str(franchisee_row.get("Trait 3", "")).strip(),
        ]
    traits = [t for t in traits if t]

    matches_df = match_franchisee_to_franchisors(franchisee_row, franchisors_df)

    print("Franchisee Details")
    print(f"Name: {franchisee_name}")
    print(f"Asset Type: {asset_type}")
    print(f"Liquid Asset INR: {liquid_asset}")
    print(f"Traits: {', '.join(traits)}")
    print()

    print("Top 5 Matched Franchisors")
    table_columns = [
        "Brand Name",
        "Contact Email",
        "asset_match_score",
        "investment_score",
        "trait_score",
        "industry_score",
        "total_score",
    ]

    print(tabulate(matches_df[table_columns], headers="keys", tablefmt="github", showindex=False))


if __name__ == "__main__":
    main()

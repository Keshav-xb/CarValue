#!/usr/bin/env python3
"""Small JSON-line adapter around the supplied RandomForest model."""
from __future__ import annotations

import gzip
import json
import sys
from pathlib import Path

import joblib
import pandas as pd

MODEL_PATH = Path(__file__).with_name("car_price_model.pkl.gz")
FEATURE_COLUMNS = [
    "year",
    "km_driven",
    "mileage(km/ltr/kg)",
    "engine",
    "max_power",
    "seats",
    "fuel_Diesel",
    "fuel_LPG",
    "fuel_Petrol",
    "seller_type_Individual",
    "seller_type_Trustmark Dealer",
    "transmission_Manual",
    "owner_Fourth & Above Owner",
    "owner_Second Owner",
    "owner_Test Drive Car",
    "owner_Third Owner",
]


def encode(payload: dict) -> list[float | int]:
    fuel = payload["fuel"]
    seller_type = payload["sellerType"]
    transmission = payload["transmission"]
    owner = payload["owner"]

    return [
        payload["year"],
        payload["kmDriven"],
        payload["mileage"],
        payload["engine"],
        payload["maxPower"],
        payload["seats"],
        int(fuel == "Diesel"),
        int(fuel == "LPG"),
        int(fuel == "Petrol"),
        int(seller_type == "Individual"),
        int(seller_type == "Trustmark Dealer"),
        int(transmission == "Manual"),
        int(owner == "Fourth & Above Owner"),
        int(owner == "Second Owner"),
        int(owner == "Test Drive Car"),
        int(owner == "Third Owner"),
    ]


def main() -> None:
    payload = json.loads(sys.stdin.read())
    with gzip.open(MODEL_PATH, "rb") as model_file:
        model = joblib.load(model_file)
    frame = pd.DataFrame([encode(payload)], columns=FEATURE_COLUMNS)
    prediction = model.predict(frame)
    value = float(prediction[0])
    if value != value or value in (float("inf"), float("-inf")):
        raise ValueError("Model returned a non-finite valuation")
    print(json.dumps({"price": value}))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001 - JSON boundary must remain friendly.
        print(json.dumps({"error": str(exc)}))
        sys.exit(1)

"""Summarize one saved price series without network access or dependencies."""

import argparse
import csv
from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal, DecimalException, localcontext
import hashlib
import io
import json
from pathlib import Path
import re
import sys


@dataclass(frozen=True)
class Observation:
    timestamp: datetime
    symbol: str
    price: Decimal


def parse_csv(text):
    """Validate a single series and return observations ordered by UTC time."""
    reader = csv.DictReader(io.StringIO(text, newline=""), strict=True)
    if reader.fieldnames is None or sorted(reader.fieldnames) != ["price", "symbol", "timestamp"]:
        raise ValueError("Expected exactly these CSV columns: timestamp,symbol,price")
    observations = []
    seen = set()
    symbol = None
    for row in reader:
        line = reader.line_num
        if None in row or any(value is None for value in row.values()):
            raise ValueError(f"Line {line}: wrong number of columns")
        pair = row["symbol"].strip()
        if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._/-]{0,47}", pair):
            raise ValueError(f"Line {line}: invalid symbol; use a pair such as SAMPLE/USD")
        if symbol is not None and pair != symbol:
            raise ValueError(f"Line {line}: mixed symbols; use one pair per CSV")
        symbol = pair
        try:
            timestamp = datetime.fromisoformat(row["timestamp"].strip().replace("Z", "+00:00"))
            if timestamp.tzinfo is None:
                raise ValueError("timezone required")
            timestamp = timestamp.astimezone(timezone.utc)
        except (ValueError, OverflowError) as exc:
            raise ValueError(f"Line {line}: timestamp must include a timezone") from exc
        if timestamp in seen:
            raise ValueError(f"Line {line}: duplicate timestamp after UTC normalization")
        seen.add(timestamp)
        try:
            price = Decimal(row["price"].strip())
        except DecimalException as exc:
            raise ValueError(f"Line {line}: invalid price") from exc
        if not price.is_finite() or price <= 0:
            raise ValueError(f"Line {line}: price must be finite and positive")
        # Keep inputs within a documented range to bound Decimal arithmetic.
        if not Decimal("1e-30") <= price <= Decimal("1e30") or len(price.as_tuple().digits) > 40:
            raise ValueError(f"Line {line}: price must be 1e-30..1e30 with at most 40 digits")
        observations.append(Observation(timestamp, pair, price))
    if len(observations) < 2:
        raise ValueError("At least two observations are required")
    return sorted(observations, key=lambda item: item.timestamp)


def summarize(observations):
    """Calculate sampled change and maximum observed peak-to-trough decline."""
    prices = [item.price for item in observations]
    with localcontext() as context:
        context.prec = 90
        peak = prices[0]
        drawdown = Decimal(0)
        for price in prices:
            peak = max(peak, price)
            drawdown = max(drawdown, (peak - price) / peak * 100)
        change = (prices[-1] - prices[0]) / prices[0] * 100
    return {
        "symbol": observations[0].symbol,
        "observations": len(observations),
        "start_utc": observations[0].timestamp.isoformat().replace("+00:00", "Z"),
        "end_utc": observations[-1].timestamp.isoformat().replace("+00:00", "Z"),
        "first_price": str(prices[0]),
        "last_price": str(prices[-1]),
        "sample_min_price": str(min(prices)),
        "sample_max_price": str(max(prices)),
        "change_pct": format(change, ".6f"),
        "max_drawdown_pct": format(drawdown, ".6f"),
    }


def markdown_report(summary):
    labels = [
        ("Observations", "observations"), ("Start (UTC)", "start_utc"),
        ("End (UTC)", "end_utc"), ("First price", "first_price"),
        ("Last price", "last_price"), ("Sample minimum", "sample_min_price"),
        ("Sample maximum", "sample_max_price"), ("Change (%)", "change_pct"),
        ("Maximum sampled drawdown (%)", "max_drawdown_pct"),
    ]
    rows = [f"# Price snapshot: {summary['symbol']}", "", "| Metric | Value |", "| --- | --- |"]
    rows.extend(f"| {label} | {summary[key]} |" for label, key in labels)
    rows.extend(["", f"Input SHA-256: `{summary['input_sha256']}`", "",
                 "Calculated from saved observations only. Gaps and intraperiod moves are not measured.",
                 "This report does not assess liquidity, token safety, or future returns.", ""])
    return "\n".join(rows)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path, help="CSV containing timestamp,symbol,price")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    args = parser.parse_args(argv)
    try:
        raw = args.csv_path.read_bytes()
        summary = summarize(parse_csv(raw.decode("utf-8-sig")))
        summary["input_sha256"] = hashlib.sha256(raw).hexdigest()
    except (OSError, UnicodeError, ValueError, csv.Error, DecimalException) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2
    if args.format == "json":
        print(json.dumps(summary, indent=2))
    else:
        print(markdown_report(summary), end="")
    return 0


if __name__ == "__main__":
    sys.exit(main())

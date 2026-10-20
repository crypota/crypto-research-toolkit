import contextlib
from decimal import Decimal
import io
from pathlib import Path
import tempfile
import unittest

from crypto_report import main, parse_csv, summarize


HEADER = "timestamp,symbol,price\n"


class PriceReportTests(unittest.TestCase):
    def test_known_peak_trough_and_recovery(self):
        observations = parse_csv(Path("examples/sample_prices.csv").read_text())
        report = summarize(observations)
        self.assertEqual(report["change_pct"], "5.000000")
        self.assertEqual(report["max_drawdown_pct"], "33.333333")
        self.assertEqual(report["sample_min_price"], "80")
        self.assertEqual(report["sample_max_price"], "120")

    def test_utc_normalization_and_chronological_sort(self):
        data = HEADER + "2026-01-02T04:00:00+04:00,X/USD,120\n2026-01-01T00:00:00Z,X/USD,100\n"
        report = summarize(parse_csv(data))
        self.assertEqual(report["start_utc"], "2026-01-01T00:00:00Z")
        self.assertEqual(report["change_pct"], "20.000000")
        self.assertEqual(report["max_drawdown_pct"], "0.000000")

    def test_duplicate_instant_in_different_timezones_is_rejected(self):
        data = HEADER + "2026-01-01T00:00:00Z,X/USD,100\n2026-01-01T04:00:00+04:00,X/USD,120\n"
        with self.assertRaisesRegex(ValueError, "duplicate"):
            parse_csv(data)

    def test_invalid_prices(self):
        for value in ["0", "-1", "NaN", "Infinity", "abc", "1e-31", "1e31"]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                parse_csv(HEADER + f"2026-01-01T00:00:00Z,X/USD,{value}\n2026-01-02T00:00:00Z,X/USD,1\n")

    def test_mixed_symbols_naive_dates_and_malformed_rows(self):
        bad_rows = [
            "2026-01-02T00:00:00Z,Y/USD,2", "2026-01-02T00:00:00,X/USD,2",
            "2026-01-02T00:00:00Z,X/USD", "2026-01-02T00:00:00Z,X/USD,2,extra",
            "2026-01-02T00:00:00Z,<script>,2",
        ]
        for row in bad_rows:
            with self.subTest(row=row), self.assertRaises(ValueError):
                parse_csv(HEADER + "2026-01-01T00:00:00Z,X/USD,1\n" + row + "\n")

    def test_requires_correct_schema_and_two_observations(self):
        for data in ["", HEADER, HEADER + "2026-01-01T00:00:00Z,X/USD,1\n", "price,price,timestamp\n"]:
            with self.subTest(data=data), self.assertRaises(ValueError):
                parse_csv(data)

    def test_falling_series(self):
        data = HEADER + "2026-01-01T00:00:00Z,X/USD,100\n2026-01-02T00:00:00Z,X/USD,60\n"
        report = summarize(parse_csv(data))
        self.assertEqual(report["change_pct"], "-40.000000")
        self.assertEqual(report["max_drawdown_pct"], "40.000000")

    def test_small_prices_preserve_precision(self):
        data = HEADER + "2026-01-01T00:00:00Z,X/USD,0.000000000000000001\n2026-01-02T00:00:00Z,X/USD,0.000000000000000002\n"
        self.assertEqual(Decimal(summarize(parse_csv(data))["change_pct"]), 100)

    def test_cli_error_is_clean_and_nonzero(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "bad.csv"
            path.write_text(HEADER)
            error = io.StringIO()
            with contextlib.redirect_stderr(error):
                self.assertEqual(main([str(path)]), 2)
            self.assertIn("At least two", error.getvalue())
            self.assertNotIn("Traceback", error.getvalue())


if __name__ == "__main__":
    unittest.main()

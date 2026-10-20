# Crypto Research Toolkit

A small, offline Python tool for reviewing a saved price series. It produces a
Markdown or JSON summary with a hash of the exact input file. No API keys,
wallets, network requests, or third-party packages are needed.

This is an early personal research utility. The included data is **fictional**.

## Quick start

Python 3.10 or newer. Run from the repository root:

```sh
python crypto_report.py examples/sample_prices.csv
python crypto_report.py examples/sample_prices.csv --format json
python -m unittest discover -s tests -v
```

On Windows, `py` may be used instead of `python`.

The example starts at 100 and ends at 105: change is **5%**. Its largest observed
decline is from 120 to 80: maximum sampled drawdown is **33.333333%**.
See the generated [example report](examples/sample_report.md).

## Input contract

UTF-8 CSV (an optional BOM is accepted) with exactly these column names:

```csv
timestamp,symbol,price
2026-01-01T00:00:00Z,SAMPLE/USD,100
2026-01-02T04:00:00+04:00,SAMPLE/USD,105
```

- One asset/quote pair per file, using the same case-sensitive symbol throughout.
- At least two observations. Rows are sorted by time before calculation.
- ISO 8601 timestamps must include a timezone; offsets are normalized to UTC.
- Duplicate instants are rejected, including duplicates expressed in different timezones.
- Prices must be positive, finite decimals between `1e-30` and `1e30`, with at most 40 coefficient digits.
- Symbols may contain letters, numbers, `.`, `_`, `/`, and `-`, up to 48 characters.
- Missing/extra columns, mixed pairs and malformed data fail with exit code 2.

The tool writes only to standard output. To save a report:

```sh
python crypto_report.py examples/sample_prices.csv > report.md
```

Do not redirect output to the input CSV. Prices and percentages are strings in
JSON, preserving decimal values; percentages are rounded to six decimal places.

## What the numbers mean

| Metric | Calculation |
| --- | --- |
| Change | `(last - first) / first * 100` |
| Maximum sampled drawdown | Largest `(earlier running peak - later price) / peak * 100`, reported as a positive decline |
| Sample minimum / maximum | Lowest / highest observed value in the file |
| Input SHA-256 | Hash of the original bytes, including row order and line endings |

These are **sample statistics**, not exchange OHLC values. Irregular sampling,
missing observations, stale data and price manipulation can change the result.
There is no annualization, price fetching, portfolio accounting or profitability
forecast. Fees, slippage, liquidity and token contract risks are not evaluated.

## Research checklist

Before interpreting a real file, record its source, retrieval time, asset contract
and chain, quote currency, sampling interval and any gaps. A matching ticker is
not proof that two sources describe the same asset.

## Contributing

Bug reports should include a minimal **synthetic** CSV, the command, expected
result and Python version. Please do not submit API keys, private trading history
or wallet credentials. Run the test command above before proposing code changes.

## По-русски

Утилита считает изменение цены и максимальную наблюдаемую просадку по сохранённому
CSV. Работает локально на стандартной библиотеке Python. Пример вымышленный;
полученный отчёт не является оценкой надёжности токена или торговым сигналом.

## License

[MIT](LICENSE).

"""Bundle the dashboard into one offline HTML file using only the stdlib."""
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[1]
    html = (root / "index.html").read_text(encoding="utf-8")
    css_tag = '<link rel="stylesheet" href="assets/dashboard.css">'
    assert css_tag in html
    html = html.replace(css_tag, '<style>\n' + (root / "assets/dashboard.css").read_text(encoding="utf-8") + '\n</style>')
    for name in ("analytics", "dashboard"):
        tag = f'<script defer src="assets/{name}.js"></script>'
        assert tag in html
        # Inline scripts run after the HTML, keeping file:// operation dependency-free.
        script = (root / f"assets/{name}.js").read_text(encoding="utf-8")
        assert '</script' not in script.lower()
        html = html.replace(tag, '')
        html = html.replace('</body>', '<script>\n' + script + '\n</script>\n</body>')
    html = html.replace('href="index.html"', 'href="#main"')
    destination = root / "dist/crypto-research-toolkit.html"
    destination.parent.mkdir(exist_ok=True)
    destination.write_text(html, encoding="utf-8")
    print(destination)


if __name__ == "__main__":
    main()

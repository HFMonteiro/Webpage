#!/usr/bin/env python3
"""
ORCID Publications Fetcher
Fetches publications from ORCID API and generates Markdown and HTML files for the website.
"""

import datetime
import html
import pathlib
import sys
import time
from typing import List, Optional

import requests

ORCID = "0000-0002-6060-3335"
API_BASE = f"https://pub.orcid.org/v3.0/{ORCID}"
HEADERS = {"Accept": "application/json"}
TIMEOUT = 30
MAX_RETRIES = 3
RETRY_DELAY = 2


def safe_request(url: str) -> Optional[dict]:
    for attempt in range(MAX_RETRIES):
        try:
            r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as e:
            print(f"Request failed ({attempt + 1}/{MAX_RETRIES}): {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
    return None


def extract_work_details(work_summary: dict) -> dict:
    title = "Untitled"
    year = None
    journal = None
    url = None
    doi = None

    t = work_summary.get("title", {}).get("title", {})
    title = t.get("value", title)

    pub_date = work_summary.get("publication-date", {})
    if isinstance(pub_date, dict):
        y = pub_date.get("year", {})
        if isinstance(y, dict):
            year = y.get("value")

    jt = work_summary.get("journal-title", {})
    if isinstance(jt, dict):
        journal = jt.get("value")

    external_ids = work_summary.get("external-ids", {}).get("external-id", [])
    for ext in external_ids:
        ext_type = ext.get("external-id-type")
        ext_value = ext.get("external-id-value")
        ext_url_field = ext.get("external-id-url") or {}
        ext_url = ext_url_field.get("value") if isinstance(ext_url_field, dict) else None
        if ext_type == "doi" and ext_value:
            doi = ext_value
            if not url and ext_url:
                url = ext_url
        elif ext_type == "uri" and ext_url and not url:
            url = ext_url

    return {"title": title, "year": year, "journal": journal, "url": url, "doi": doi}


def fetch_publications() -> List[dict]:
    print(f"Fetching publications for ORCID: {ORCID}")
    works = safe_request(f"{API_BASE}/works")
    if not works:
        print("Failed to fetch works list")
        return []

    pubs: List[dict] = []
    for group in works.get("group", []):
        summaries = group.get("work-summary", [])
        if not summaries:
            continue
        details = extract_work_details(summaries[0])
        if details.get("title") and details["title"] != "Untitled":
            pubs.append(details)
            print(f"  - {details['title']} ({details.get('year', 'No year')})")

    pubs.sort(key=lambda x: (-(int(x["year"]) if x.get("year") else 0), x.get("title", "")))
    print(f"Successfully processed {len(pubs)} publications")
    return pubs


def format_publication_md(work: dict) -> str:
    parts = [f"**{work.get('title','Untitled')}**"]
    if work.get("year"):
        parts.append(f"({work['year']})")
    if work.get("journal"):
        parts.append(f"*{work['journal']}*")
    citation = " ".join(parts)
    if work.get("url"):
        citation += f" [Link]({work['url']})"
    elif work.get("doi"):
        citation += f" [DOI: {work['doi']}](https://doi.org/{work['doi']})"
    return f"- {citation}"


def generate_markdown(publications: List[dict], lang: str) -> str:
    if lang == "pt":
        header = "# Publicações"
        last_updated = f"*Última atualização: {datetime.datetime.now().strftime('%d/%m/%Y')}*"
        note = "Esta lista é automaticamente atualizada a partir do perfil ORCID."
        none_msg = "Nenhuma publicação encontrada."
    else:
        header = "# Publications"
        last_updated = f"*Last updated: {datetime.datetime.now().strftime('%B %d, %Y')}*"
        note = "This list is automatically updated from the ORCID profile."
        none_msg = "No publications found."

    content = [header, "", last_updated, "", note, ""]
    if publications:
        content.extend(format_publication_md(p) for p in publications)
    else:
        content.append(none_msg)
    content.append("")
    return "\n".join(content)


def generate_html(publications: List[dict], lang: str) -> str:
    if lang == "pt":
        header = "Publicações"
        last_updated = f"Última atualização: {datetime.datetime.now().strftime('%d/%m/%Y')}"
        note = "Esta lista é automaticamente atualizada a partir do perfil ORCID."
        none_msg = "Nenhuma publicação encontrada."
    else:
        header = "Publications"
        last_updated = f"Last updated: {datetime.datetime.now().strftime('%B %d, %Y')}"
        note = "This list is automatically updated from the ORCID profile."
        none_msg = "No publications found."

    parts = [
        f"<h2>{html.escape(header)}</h2>",
        f"<p class=\"meta\"><em>{html.escape(last_updated)}</em></p>",
        f"<p class=\"meta\">{html.escape(note)}</p>",
    ]
    if not publications:
        parts.append(f"<p class=\"error-message\">{html.escape(none_msg)}</p>")
    else:
        parts.append("<ul class=\"publications-list\">")
        for p in publications:
            title = html.escape(p.get("title", "Untitled"))
            year = p.get("year")
            journal = html.escape(p.get("journal") or "")
            url = p.get("url")
            doi = p.get("doi")
            inner = f"<strong>{title}</strong>"
            if year:
                inner += f" ({html.escape(str(year))})"
            if journal:
                inner += f" <em>{journal}</em>"
            if url:
                inner += f" <a href=\"{html.escape(url)}\" target=\"_blank\" rel=\"noopener\">Link</a>"
            elif doi:
                de = html.escape(doi)
                inner += f" <a href=\"https://doi.org/{de}\" target=\"_blank\" rel=\"noopener\">DOI: {de}</a>"
            parts.append(f"<li>{inner}</li>")
        parts.append("</ul>")
    return "\n".join(parts)


def main() -> None:
    print("Starting ORCID publications fetch...")
    pubs = fetch_publications()
    if not pubs:
        print("No publications found or error occurred")
        sys.exit(1)

    out = pathlib.Path("publications")
    out.mkdir(parents=True, exist_ok=True)

    (out / "publications_en.md").write_text(generate_markdown(pubs, "en"), encoding="utf-8")
    (out / "publications_pt.md").write_text(generate_markdown(pubs, "pt"), encoding="utf-8")
    (out / "publications_en.html").write_text(generate_html(pubs, "en"), encoding="utf-8")
    (out / "publications_pt.html").write_text(generate_html(pubs, "pt"), encoding="utf-8")
    print("Generated publications in Markdown and HTML (EN, PT)")


if __name__ == "__main__":
    main()

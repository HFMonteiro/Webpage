#!/usr/bin/env python3
"""
ORCID Publications Fetcher
Fetches publications from ORCID API and generates markdown files for the website.
"""

import json
import requests
import pathlib
import datetime
import sys
import time
from typing import List, Dict, Optional

ORCID = "0000-0002-6060-3335"
API_BASE = f"https://pub.orcid.org/v3.0/{ORCID}"
HEADERS = {"Accept": "application/json"}
TIMEOUT = 30
MAX_RETRIES = 3
RETRY_DELAY = 2


def safe_request(url: str, headers: dict) -> Optional[dict]:
    """Make a safe HTTP request with retries."""
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url, headers=headers, timeout=TIMEOUT)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request failed (attempt {attempt + 1}/{MAX_RETRIES}): {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
            else:
                print(f"Failed to fetch data from {url} after {MAX_RETRIES} attempts")
                return None


def extract_work_details(work_summary: dict) -> dict:
    """Extract relevant details from a work summary."""
    title = "Untitled"
    year = None
    journal = None
    url = None
    doi = None
    
    # Extract title
    if work_summary.get("title") and work_summary["title"].get("title"):
        title = work_summary["title"]["title"].get("value", "Untitled")
    
    # Extract year
    if work_summary.get("publication-date") and work_summary["publication-date"].get("year"):
        year = work_summary["publication-date"]["year"].get("value")
    
    # Extract journal/source
    if work_summary.get("journal-title") and work_summary["journal-title"].get("value"):
        journal = work_summary["journal-title"]["value"]
    
    # Extract external IDs (DOI, URL)
    external_ids = work_summary.get("external-ids", {}).get("external-id", [])
    for ext_id in external_ids:
        ext_type = ext_id.get("external-id-type")
        ext_value = ext_id.get("external-id-value")
        ext_url = ext_id.get("external-id-url", {}).get("value")
        
        if ext_type == "doi" and ext_value:
            doi = ext_value
            if not url and ext_url:
                url = ext_url
        elif ext_type == "uri" and ext_url and not url:
            url = ext_url
    
    return {
        "title": title,
        "year": year,
        "journal": journal,
        "url": url,
        "doi": doi
    }


def format_publication(work: dict, lang: str = "en") -> str:
    """Format a publication as a markdown list item."""
    title = work["title"]
    year = work["year"]
    journal = work["journal"]
    url = work["url"]
    doi = work["doi"]
    
    # Build the citation
    parts = [f"**{title}**"]
    
    if year:
        parts.append(f"({year})")
    
    if journal:
        parts.append(f"*{journal}*")
    
    citation = " ".join(parts)
    
    # Add link if available
    if url:
        citation += f" [Link]({url})"
    elif doi:
        citation += f" [DOI: {doi}](https://doi.org/{doi})"
    
    return f"- {citation}"


def fetch_publications() -> List[dict]:
    """Fetch all publications from ORCID."""
    print(f"Fetching publications for ORCID: {ORCID}")
    
    # Get the works list
    works_url = f"{API_BASE}/works"
    works_data = safe_request(works_url, HEADERS)
    
    if not works_data:
        print("Failed to fetch works list")
        return []
    
    publications = []
    work_groups = works_data.get("group", [])
    
    print(f"Found {len(work_groups)} work groups")
    
    for group in work_groups:
        work_summaries = group.get("work-summary", [])
        if work_summaries:
            # Take the first summary from each group
            work_summary = work_summaries[0]
            work_details = extract_work_details(work_summary)
            
            if work_details["title"] != "Untitled":
                publications.append(work_details)
                print(f"  - {work_details['title']} ({work_details.get('year', 'No year')})")
    
    # Sort by year (most recent first), then by title
    publications.sort(key=lambda x: (-(int(x["year"]) if x["year"] else 0), x["title"]))
    
    print(f"Successfully processed {len(publications)} publications")
    return publications


def generate_markdown(publications: List[dict], lang: str = "en") -> str:
    """Generate markdown content for publications."""
    if lang == "pt":
        header = "# Publicações"
        last_updated = f"*Última atualização: {datetime.datetime.now().strftime('%d/%m/%Y')}*"
        note = "Esta lista é automaticamente atualizada a partir do perfil ORCID."
    else:
        header = "# Publications"
        last_updated = f"*Last updated: {datetime.datetime.now().strftime('%B %d, %Y')}*"
        note = "This list is automatically updated from the ORCID profile."
    
    content = [header, "", last_updated, "", note, ""]
    
    if not publications:
        if lang == "pt":
            content.append("Nenhuma publicação encontrada.")
        else:
            content.append("No publications found.")
    else:
        for pub in publications:
            content.append(format_publication(pub, lang))
    
    content.append("")  # Empty line at end
    return "\n".join(content)


def main():
    """Main function."""
    print("Starting ORCID publications fetch...")
    
    # Fetch publications
    publications = fetch_publications()
    
    if not publications:
        print("No publications found or error occurred")
        sys.exit(1)
    
    # Create output directory
    output_dir = pathlib.Path("publications")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate English version
    en_content = generate_markdown(publications, "en")
    en_file = output_dir / "publications_en.md"
    en_file.write_text(en_content, encoding="utf-8")
    print(f"Generated English publications: {en_file}")
    
    # Generate Portuguese version
    pt_content = generate_markdown(publications, "pt")
    pt_file = output_dir / "publications_pt.md"
    pt_file.write_text(pt_content, encoding="utf-8")
    print(f"Generated Portuguese publications: {pt_file}")
    
    print("ORCID publications fetch completed successfully!")


if __name__ == "__main__":
    main()
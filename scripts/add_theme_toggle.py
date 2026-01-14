#!/usr/bin/env python3
"""
Script to add theme toggle button to all HTML pages
"""
import os
import re
from pathlib import Path

# Theme toggle button HTML (PT version)
THEME_TOGGLE_PT = '''        <button id="theme-toggle" class="theme-toggle" aria-label="Alternar tema escuro/claro" title="Alternar tema">
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </button>
'''

# Theme toggle button HTML (EN version)
THEME_TOGGLE_EN = '''        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark/light theme" title="Toggle theme">
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </button>
'''


def add_theme_toggle_to_file(file_path):
    """Add theme toggle button before language switcher in HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has theme toggle
    if 'theme-toggle' in content:
        print(f"✓ Skipping {file_path} - already has theme toggle")
        return False

    # Skip if no navigation
    if '<nav' not in content:
        print(f"⚠ Skipping {file_path} - no navigation found")
        return False

    # Determine language
    is_pt = '/pt/' in str(file_path) or 'lang="pt-PT"' in content
    toggle_html = THEME_TOGGLE_PT if is_pt else THEME_TOGGLE_EN

    # Pattern to find language switcher div
    pattern = r'(\s*)<div class="lang-switcher"'

    # Replace: add theme toggle before lang switcher
    new_content = re.sub(
        pattern,
        toggle_html + r'\1<div class="lang-switcher"',
        content,
        count=1
    )

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✓ Added theme toggle to {file_path}")
        return True
    else:
        print(f"✗ Could not add theme toggle to {file_path}")
        return False


def main():
    """Process all HTML files in en/ and pt/ directories"""
    base_dir = Path(__file__).parent.parent

    directories = [
        base_dir / 'en',
        base_dir / 'pt'
    ]

    updated_count = 0

    for directory in directories:
        if not directory.exists():
            print(f"⚠ Directory not found: {directory}")
            continue

        print(f"\nProcessing {directory}...")

        for html_file in directory.glob('*.html'):
            if add_theme_toggle_to_file(html_file):
                updated_count += 1

    print(f"\n{'='*60}")
    print(f"✓ Updated {updated_count} files")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()

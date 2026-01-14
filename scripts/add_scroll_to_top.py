#!/usr/bin/env python3
"""
Script to add scroll-to-top button to all HTML pages
"""
import os
import re
from pathlib import Path

# Scroll to top button HTML
SCROLL_TO_TOP_BUTTON = '''
    <!-- Scroll to Top Button -->
    <button id="scroll-to-top" class="scroll-to-top" aria-label="Scroll to top" title="Back to top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    </button>

    <script src="/assets/js/script.js" defer></script>'''


def add_scroll_to_top_to_file(file_path):
    """Add scroll to top button before closing body tag in HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has scroll to top button
    if 'scroll-to-top' in content:
        print(f"✓ Skipping {file_path} - already has scroll-to-top button")
        return False

    # Skip if no body tag
    if '</body>' not in content:
        print(f"⚠ Skipping {file_path} - no closing body tag found")
        return False

    # Find the script tag pattern
    script_pattern = r'(\s*)<script src="/assets/js/script\.js" defer></script>\s*</body>'

    # Replace: add scroll to top button before script
    new_content = re.sub(
        script_pattern,
        SCROLL_TO_TOP_BUTTON + '\n</body>',
        content,
        count=1
    )

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✓ Added scroll-to-top button to {file_path}")
        return True
    else:
        print(f"✗ Could not add scroll-to-top button to {file_path}")
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
            if add_scroll_to_top_to_file(html_file):
                updated_count += 1

    print(f"\n{'='*60}")
    print(f"✓ Updated {updated_count} files")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()

# LinkedIn Highlights

This feature displays a curated set of public LinkedIn posts, mentions, talks, and collaborations on the website.

It intentionally does **not** scrape LinkedIn or automatically harvest mentions. LinkedIn content should be added manually when it is public, relevant, and appropriate to display in a professional portfolio.

## Files

- `en/linkedin.html` — English highlights page
- `pt/linkedin.html` — Portuguese highlights page
- `assets/data/linkedin-posts.json` — curated data source
- `assets/js/linkedin-highlights.js` — renderer and URL validation
- `assets/css/linkedin-highlights.css` — page styling

## Add a post

1. Open the public LinkedIn post.
2. Use LinkedIn's embed option when available.
3. Copy the iframe `src`, not the full iframe.
4. Add a new item to `assets/data/linkedin-posts.json`.

Example:

```json
{
  "posts": [
    {
      "date": "2026-06-27",
      "source": {
        "en": "LinkedIn",
        "pt": "LinkedIn"
      },
      "title": {
        "en": "Conference session on digital public health",
        "pt": "Sessão sobre saúde pública digital"
      },
      "context": {
        "en": "Public post mentioning a talk, project, collaboration, or professional contribution.",
        "pt": "Publicação pública que menciona uma palestra, projeto, colaboração ou contributo profissional."
      },
      "url": "https://www.linkedin.com/feed/update/urn:li:activity:0000000000000000000/",
      "embedUrl": "https://www.linkedin.com/embed/feed/update/urn:li:activity:0000000000000000000"
    }
  ]
}
```

## Safety rules

- Only `https://www.linkedin.com/embed/...` URLs are rendered as frames.
- Direct fallback links must point to `linkedin.com` or `www.linkedin.com`.
- If an embed is blocked by the browser or LinkedIn, the direct link remains available.
- Keep the list curated. Do not use this as a full social feed.

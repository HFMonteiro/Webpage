# Changelog

All notable changes to this project will be documented in this file.

## [v0.1] - 2024-08-24

### Added

**Internationalization & Structure**
- Complete bilingual website structure (English/Portuguese-PT)
- Root `/index.html` redirect to `/en/` for English as default landing
- Language switcher component in navigation
- Proper hreflang tags for SEO and language discovery
- Canonical links for each page variant

**Content Pages (EN/PT)**
- Homepage with hero section and overview cards
- About page with detailed biography and professional background
- Research page with detailed research interests and methodology
- Experience page with professional timeline and current roles
- Publications page with automatic ORCID integration
- Contact page with professional networking information

**ORCID Integration**
- Python script (`scripts/fetch_orcid.py`) for fetching publications from ORCID API
- GitHub Action (`.github/workflows/fetch_orcid.yml`) for weekly automatic updates
- Publications automatically rendered from markdown files
- Placeholder publications content for testing

**SEO & Metadata**
- Complete SEO metadata for all pages (titles, descriptions, keywords)
- Open Graph tags for social media sharing
- Twitter Card metadata
- JSON-LD structured data for Person schema
- Sitemap.xml with hreflang support
- Robots.txt for search engine guidance

**Design & UX**
- Responsive mobile-first design
- Modern component library (cards, buttons, timeline, grids)
- Accessible navigation with skip links and ARIA labels
- Clean typography with proper contrast ratios
- Professional color scheme and branding
- Dark mode support

**Assets & Infrastructure**
- Organized asset structure (`/assets/css/`, `/assets/js/`, `/assets/img/`)
- SVG favicon and placeholder images
- Comprehensive CSS with utility classes
- Enhanced JavaScript for dynamic content loading

**Technical Features**
- Semantic HTML5 structure throughout
- Performance optimizations (deferred JS, lazy loading attributes)
- Security headers and best practices
- Print-friendly styles
- Progressive enhancement approach

### Changed
- Moved from single-page to multi-page bilingual structure
- Updated navigation to support 6 main sections (≤6 as specified)
- Enhanced CSS architecture with custom properties
- Improved accessibility with WCAG AA considerations

### Technical Implementation
- **Languages**: English (default), Portuguese (pt-PT)
- **Structure**: `/en/` and `/pt/` directories with mirrored content
- **External Links**: Open in new tabs with `rel="noopener"`
- **Performance**: Lazy loading images, deferred JavaScript
- **Accessibility**: Skip links, ARIA labels, keyboard navigation
- **SEO**: Complete metadata, structured data, sitemap

### Current Status
- ✅ All major pages implemented (EN/PT)
- ✅ ORCID integration functional
- ✅ SEO optimization complete
- ✅ Responsive design implemented
- ✅ GitHub Actions workflow configured
- ⏳ CV placeholder (needs actual PDF upload)
- ⏳ Production images (using LinkedIn photo placeholder)

### Next Steps
- Upload actual CV PDF to `/docs/Hugo_Monteiro_CV.pdf`
- Add production-quality images and OG images
- Conduct Lighthouse performance audits
- Test ORCID integration in production environment
- Consider adding analytics integration (privacy-friendly)
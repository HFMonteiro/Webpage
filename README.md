# Hugo Monteiro - Professional Website (v0.1)

A bilingual (EN/PT) professional website for Hugo Monteiro, MD/MPH, PhD candidate, featuring automatic ORCID publications integration and modern responsive design.

## 🌟 Features

### Internationalization
- **English** (default landing) and **Portuguese (pt-PT)** versions
- Language switcher in navigation
- Proper hreflang tags for SEO
- Root redirect to `/en/` for English default

### Content Management
- **ORCID Integration**: Automatic weekly updates of publications from ORCID profile
- **Bilingual Content**: Complete page translations for all sections
- **Professional Sections**: About, Research, Experience, Publications, Contact

### Technical Excellence
- **SEO Optimized**: Complete metadata, sitemap.xml, robots.txt, JSON-LD structured data
- **Performance**: Lazy loading, deferred JS, optimized assets
- **Accessibility**: WCAG AA compliant, skip links, ARIA labels
- **Responsive**: Mobile-first design with modern CSS Grid/Flexbox

## 🏗️ Structure

```
/
├── index.html                    # Root redirect to /en/
├── en/                          # English pages
│   ├── index.html               # Homepage
│   ├── about.html               # About/Biography
│   ├── research.html            # Research interests
│   ├── experience.html          # Professional experience
│   ├── publications.html        # Publications (ORCID integrated)
│   └── contact.html             # Contact information
├── pt/                          # Portuguese pages (mirrored structure)
│   ├── index.html               # Página inicial
│   ├── sobre.html               # Sobre/Biografia
│   ├── investigacao.html        # Interesses de investigação
│   ├── experiencia.html         # Experiência profissional
│   ├── publicacoes.html         # Publicações (ORCID integrado)
│   └── contacto.html            # Informações de contacto
├── assets/                      # Static assets
│   ├── css/styles.css           # Main stylesheet
│   ├── js/script.js             # Enhanced JavaScript
│   └── img/                     # Images, favicons
├── publications/                # Auto-generated content
│   ├── publications_en.md       # English publications
│   └── publications_pt.md       # Portuguese publications
├── scripts/                     # Automation
│   └── fetch_orcid.py           # ORCID publications fetcher
├── .github/workflows/           # GitHub Actions
│   ├── site-validation.yml      # Site validation
│   └── fetch_orcid.yml          # Weekly ORCID updates
├── sitemap.xml                  # SEO sitemap
├── robots.txt                   # Search engine directives
└── CHANGELOG.md                 # Version history
```

## 🚀 ORCID Integration

Publications are automatically updated weekly from ORCID profile `0000-0002-6060-3335`:
- **Automated Fetch**: GitHub Action runs every Monday at 06:00 UTC
- **Bilingual Output**: Generates both English and Portuguese publication lists
- **Markdown Format**: Clean, structured publication data
- **Error Handling**: Graceful fallbacks and retry logic

## 🌐 Deployment

The site is designed for static hosting.

- **Primary:** GitHub Pages or any static hosting service

## 🔄 GitHub Actions

**ORCID Publications** (`.github/workflows/fetch_orcid.yml`):
- Fetches latest publications from ORCID API
- Commits updated publication lists automatically

## 📊 Performance & SEO

- **Lighthouse Target**: ≥90 for Performance/Accessibility/Best Practices/SEO
- **SEO**: Complete metadata, hreflang, structured data
- **Performance**: Optimized assets, lazy loading, deferred JS

## 🔧 Maintenance

### Publications Update
Publications are automatically updated via GitHub Action. Manual update:
```bash
python3 scripts/fetch_orcid.py
```

### Translation Maintenance
- Keep English and Portuguese content synchronized
- Update both language versions when making content changes
- Ensure hreflang links remain accurate

## 🎯 Version 0.1 Achievements

- ✅ Bilingual EN/PT structure with language switcher
- ✅ Complete professional content (About, Research, Experience, Publications, Contact)
- ✅ ORCID automatic publications integration
- ✅ SEO optimization (sitemap, robots.txt, structured data)
- ✅ Responsive, accessible design
- ✅ Performance optimizations
- ✅ GitHub Actions automation

## 🏥 About Hugo Monteiro

MD/MPH and PhD candidate in Health Data Science, focused on digital transformation of healthcare policy and operations. Current roles include:
- Public Health Physician (ULS Gaia Espinho)
- Programs Coordinator (Direção Executiva do SNS)  
- External Consultant (WHO/Europe)
- Industry Fellow & Lecturer

**ORCID**: [0000-0002-6060-3335](https://orcid.org/0000-0002-6060-3335)  
**LinkedIn**: [hugo-monteiro](https://www.linkedin.com/in/hugo-monteiro/)

---

**v0.1** - Complete bilingual professional website with ORCID integration and modern responsive design.

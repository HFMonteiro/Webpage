# Hugo's Prototype Static Website

A minimal static website designed for quick prototyping and deployment via raw.githack.com, created for Portuguese MD/MPH Hugo Monteiro with focus on digital health transformation.

## 🏗️ File Structure

```
/
├── index.html                    # Main HTML page (HTML5 boilerplate)
├── styles.css                    # Mobile-first responsive CSS
├── script.js                     # Minimal JavaScript functionality
├── .github/workflows/deploy.yml  # CI workflow for raw.githack deployment
├── README.md                     # This documentation
└── LICENSE                       # GNU GPL v3 License
```

## 🔧 Customization Instructions

**IMPORTANT:** This template uses placeholders that you must replace with your actual values:

### Step 1: Replace Placeholders

Search and replace the following placeholders throughout all files:

- `<USERNAME>` → Your GitHub username (e.g., `HFMonteiro`)
- `<REPO>` → Your repository name (e.g., `Webpage`)

### Files to update:
- `index.html` (footer with raw.githack URL)
- `README.md` (this file, update the example URLs below)

### Step 2: Customize Content

Edit the content in `index.html`:
- Update the site title in `<header>`
- Modify the welcome paragraph in `<main>`
- Change the author name in `<footer>`

## 🚀 Deployment with raw.githack.com

**No GitHub Pages activation needed!** Simply push your code and access it via raw.githack.com.

### Raw.githack URLs:

- **Main branch:** `https://raw.githack.com/<USERNAME>/<REPO>/main/index.html`
- **Development:** `https://raw.githack.com/<USERNAME>/<REPO>/<BRANCH>/index.html`

### Example (after replacing placeholders):
- `https://raw.githack.com/HFMonteiro/Webpage/main/index.html`

## 🔄 CI Workflow

The included GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. **Triggers:** On push to `main` branch and pull requests
2. **Validation:** Checks that `index.html` exists and has proper structure
3. **Linting:** Optional HTML and CSS validation
4. **PR Comments:** Automatically comments on PRs with preview URLs

## 📱 Features

- **Mobile-first responsive design** adapts to all screen sizes
- **Clean, minimal structure** perfect for prototyping
- **Dynamic footer year** automatically updates via JavaScript
- **Console logging** for debugging ("Apollo says hello, Hugo!")
- **Raw.githack deployment** for instant website access

## 💻 Technology Stack

- **HTML5:** Semantic markup with proper structure
- **CSS3:** Mobile-first responsive design with flexbox
- **Vanilla JavaScript:** Minimal DOM manipulation
- **GitHub Actions:** Automated CI/CD workflow

## 🎯 Use Cases

Perfect for:
- Quick prototypes and mockups
- Testing ideas before full development
- Sharing concepts with stakeholders
- Educational projects and demos
- Portfolio landing pages

## 🏥 About the Author

This template was created for Hugo Monteiro, a Portuguese MD/MPH focused on digital health transformation, with hobbies including piano, board games, and outdoor activities with kids.

---

**Quick Start:** Push this code to your GitHub repository and immediately access it at the raw.githack URL above. No additional setup required!

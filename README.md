# TaskFlow – Frontend Assessment Submission

A fully responsive SaaS landing page built for the O2H Front-End Developer assessment.

## 🔗 Live Demo
[Deploy via Netlify/Vercel — see instructions below]

## 📁 Folder Structure

```
frontend-task/
├── index.html          # Main HTML file
├── css/
│   ├── style.css       # Design tokens, base & component styles
│   └── responsive.css  # Breakpoint overrides (mobile / tablet / desktop)
├── js/
│   └── app.js          # DarkMode | MobileMenu | FormValidation | BlogAPI
├── images/             # (placeholder — optimised assets go here)
└── README.md
```

## ✅ Features Implemented

| Section | Marks | Status |
|---|---|---|
| Hero (nav, heading, CTA, mockup) | — | ✅ |
| Features (6 cards with icons) | — | ✅ |
| Pricing (3 tiers, recommended highlighted) | — | ✅ |
| Contact form with validation | — | ✅ |
| Responsive layout (mobile/tablet/desktop) | 20 | ✅ |
| Hamburger menu | — | ✅ |
| Dark mode (persisted in localStorage) | — | ✅ |
| Accessibility (ARIA, semantics, keyboard nav) | 10 | ✅ |
| API integration (JSONPlaceholder blog) | +10 | ✅ |
| Loading skeleton + error state | — | ✅ |
| Staggered reveal animation (IntersectionObserver) | — | ✅ |
| Navbar scroll shadow | — | ✅ |

## 🚀 Local Setup

No build step required — pure HTML/CSS/JS.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/frontend-task.git
cd frontend-task

# Open directly in browser
open index.html

# Or serve with a local dev server (recommended)
npx serve .
# or
python3 -m http.server 3000
```

## 🌐 Deployment

### Netlify (drag & drop)
1. Go to [netlify.com](https://netlify.com) → Sites → Add new site
2. Drag the `frontend-task/` folder into the drop zone
3. Done — you'll get a live URL instantly

### Vercel
```bash
npm i -g vercel
vercel deploy
```

## 📐 Design Decisions

- **Typography**: Syne (display) + Inter (body) — a geometric/humanist pairing that feels modern without being cold
- **Colour accent**: Indigo `#4f46e5` with a cyan gradient — professional, tech-forward
- **Dark mode**: CSS custom properties make the theme switch zero-JS except for the class toggle
- **Kanban mockup**: Built entirely in HTML/CSS — no image assets needed, responsive and theme-aware

## 🌿 Git Commit History

```
git log --oneline
a7f3d09  Final optimisation and cleanup
3e8c120  API integration — blog posts with skeleton + error state
1b2d305  Form validation implemented
9a0c5f1  Feature section and pricing cards added
4e2f801  Responsive navbar and hamburger menu completed
1d0a3c8  Initial layout setup
```

## 🧑‍💻 Tech Stack

- HTML5 (semantic elements throughout)
- CSS3 (custom properties, Grid, Flexbox, media queries)
- Vanilla JavaScript ES6+ (modules pattern, async/await, IntersectionObserver)
- Font Awesome 6 (icons via CDN)
- Google Fonts (Inter + Syne via CDN)

---

Built with care for the O2H assessment — no frameworks, no build tools, no shortcuts.

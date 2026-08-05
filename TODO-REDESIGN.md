# Site Redesign - Utopia Tokyo Style

## Goals
Redesign the site to match the utopiatokyo.com aesthetic:
- 3D scrolling parallax effect
- Rich animations
- Premium fonts

## Steps

- [x] 1. Add premium Google Fonts (Sora + Inter) to `index.html`
- [x] 2. Add font families + 3D utilities to `tailwind.config.js`
- [x] 3. Update `index.css` (smooth scroll, selection, 3D utilities, animated gradient bg)
- [x] 4. Create `src/components/ui/ParallaxSection.jsx` (scroll parallax wrapper)
- [x] 5. Create `src/components/ui/TiltCard.jsx` (3D tilt-on-hover card)
- [x] 6. Create `src/components/ui/MarqueeBand.jsx` (infinite marquee strip)
- [x] 7. Redesign `Header.jsx`/Navbar (fixed glassmorphism header on scroll)
- [x] 8. Redesign `src/components/Hero.jsx` (3D parallax hero, mouse + scroll parallax, floating elements)
- [x] 9. Redesign `src/pages/Home.jsx` (scroll reveals, tilt cards, marquee, parallax section)
- [x] 10. Verify build (npm run build)

## Components Created
- ParallaxSection
- TiltCard
- MarqueeBand

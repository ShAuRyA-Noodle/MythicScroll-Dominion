# ⚡ MONSTER SCROLL DOMINATION

> A cinematic, high-voltage scrollytelling product experience powered by Next.js 14, TypeScript, Framer Motion, and a custom Canvas image-sequence engine.

This is not a landing page.  
This is a kinetic brand system.

---

## 🧠 Project Vision

Modern product websites shouldn’t feel like static pages.

They should feel engineered.

This project recreates the kind of immersive digital experience seen in global campaign microsites — where scroll becomes a timeline, motion becomes narrative, and performance becomes a design constraint.

### 🎯 Objective

Build a production-grade, GPU-optimized scrollytelling experience that demonstrates advanced frontend architecture — not just UI assembly.

---

## 🚀 Core Features

### 🎥 240-Frame Scroll-Driven Canvas Engine

- Custom HTML5 Canvas rendering pipeline  
- 240 PNG frames per product  
- Scroll progress → frame index mapping  
- `requestAnimationFrame` optimized  
- Memory-safe preloading  
- Responsive resizing ("contain" fit)  
- Zero layout shift  
- Smooth 60fps target  

---

### ⚡ Three Product Worlds

Each flavor exists in its own engineered atmosphere:

- **Ultra White** → Frozen Lightning Precision  
- **Original Green** → Nuclear Reactor Chaos  
- **Mango Loco** → Neon Festival Detonation  

Each experience dynamically:

- Changes gradient background  
- Updates theme color  
- Animates product sequence in/out  
- Resets scroll cleanly between transitions  

---

### 🎬 Cinematic Motion System

- Framer Motion scroll orchestration  
- Sticky `500vh+` scroll container  
- Text overlays mapped to scroll progress  
- Controlled fade-in / fade-out sequences  
- `AnimatePresence` flavor transitions  
- Scroll reset logic on product change  

This is motion-system thinking — not DOM-heavy animation.

---

## 🏗 Tech Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Rendering | HTML5 Canvas |
| Font | Outfit (Google Fonts) |
| Deployment | Static Export |

---

## ⚡ Performance Philosophy

This project is built as a system, not a demo.

- No unnecessary re-renders  
- Memoized components  
- GPU-friendly transforms  
- Canvas rendering isolated from React lifecycle  
- Hydration mismatch prevention  
- Static export compatible  
- Minimal layout thrashing  

**Target:**  
Smooth, high-fidelity motion without sacrificing stability.

---

## 📂 Project Structure

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css

  components/
    ScrollEngine.tsx
    TextOverlay.tsx
    Navbar.tsx
    Footer.tsx

  data/
    products.ts

public/
  Monster_01/
  Monster_02/
  Monster_03/

next.config.ts
tailwind.config.ts
tsconfig.json
```

### 🧩 Architecture Priorities

- Clear separation of concerns  
- Isolated scroll engine  
- Scalable data layer  
- Deterministic animation logic  
- Production-ready configuration  

---

## 🛠 Installation

```bash
npm install
npm run build
npm run start
```

Static export ready.  
Deploy anywhere.

---

## 🎯 What This Demonstrates

This project showcases:

- Advanced scroll orchestration  
- Canvas + React integration  
- Performance-aware frontend engineering  
- Brand-level interaction design  
- Clean architectural thinking  

It’s designed to communicate:

> I don’t just build components.  
> I engineer interactive systems.

---

## 🔥 Potential Extensions

- WebGL particle systems  
- Three.js lighting environments  
- Adaptive quality for low-end devices  
- Motion preference detection  
- Full e-commerce integration  
- Product analytics instrumentation  

---

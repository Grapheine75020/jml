# Graphic Tool JML

Outil de composition typographique directionnelle basé sur la charte graphique JML.  
Développé pour les équipes Grapheine et JML Water Feature Design.

![](.github/screenshot.png)

---

## Fonctionnement

**1. Saisir un texte** dans le canvas — police Libre Franklin 200 px, rendu vectoriel natif.

**2. Sélectionner une lettre** en cliquant dessus.

**3. Activer une ou plusieurs directions** — ↑ ↓ ← →  
Chaque bouton est un toggle indépendant. Plusieurs directions peuvent être actives simultanément sur la même lettre.

**4. Régler les tranches**  
Choisir un plafond parmi les presets **3 / 4 / 6**, puis affiner avec le slider (1 → plafond).  
Ajuster l'espacement entre tranches de 0 à 100 px.

**5. Exporter** en SVG vectoriel (Illustrator-ready) ou PNG 300 dpi fond transparent.

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 — App Router — React 19 |
| Langage | TypeScript |
| Rendu | HTML5 Canvas 2D + OpenType.js |
| État | Zustand |
| UI | shadcn/ui — Tailwind CSS v4 — Radix UI |
| Thème | next-themes (light / dark) |
| Déploiement | Coolify — Docker self-hosted |

---

## Démarrage

```bash
npm install
npm run dev
```

---

## Spécifications

| Paramètre | Valeur |
|-----------|--------|
| Police | Libre Franklin Medium 500 |
| Canvas | 1200 × 800 px |
| Directions | Jusqu'à 4 simultanées par lettre |
| Tranches max | Presets 3 / 4 / 6 |
| Export SVG | Paths vectoriels natifs |
| Export PNG | 300 dpi, fond transparent |
| Navigateurs | Chrome, Safari, Edge — desktop ≥ 1280 px |

---

## Crédits

| Rôle | Intervenant |
|------|-------------|
| Conception identité visuelle JML | [Grapheine](https://grapheine.com) |
| Développement | Alessandro Capiluppi / [PicoDesign](https://picodesign.fr) |
| Client | [JML Water Feature Design](https://jmlwaterfeaturedesign.com/fr) |

---

## Licence

Usage interne — voir [LICENSE](./LICENSE).
